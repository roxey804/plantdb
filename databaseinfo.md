# Database Migration Strategy: Local to Supabase

This document outlines the plan for moving the "Plant db" from local static files and `localStorage` to a cloud-based dynamic database using **Supabase**.

## Current vs. Future Architecture

| Feature | Current (Local/Static) | Supabase (Cloud) |
| :--- | :--- | :--- |
| **Plant Database** | Static JSON files in `plants/` | `plants` table |
| **User State** | `localStorage` | `wishlist` and `garden_state` tables |
| **Images** | Local files in `images/` | Supabase Storage (Buckets) |
| **Access** | Single device only | Multi-device sync (Desktop/Mobile) |

## Data Models (Table Designs)

### 1. `plants` (Master Database)
Stores the botanical data currently held in individual JSON files.

| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | `text` (PK) | Unique slug (e.g., 'basil', 'snapdragon') |
| `common_name` | `text` | Display name |
| `category` | `text` | flower, herb, fruit, vegetable, houseplant |
| `variety` | `text` | Variety name |
| `data` | `jsonb` | Stores complex objects: `schedule`, `care`, `characteristics`, `propagation`, etc. |
| `image_url` | `text` | Link to main image in Storage |

### 2. `wishlist`
Stores plants the user wants to grow.

| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | `uuid` (PK) | Unique identifier |
| `common_name` | `text` | User-defined name |
| `category` | `text` | Selected category |
| `image_url` | `text` | Uploaded image path or external URL |
| `notes` | `text` | User notes |
| `user_id` | `uuid` | (Optional) For multi-user support |
| `created_at` | `timestamp` | Date added |

### 3. `categories` (Optional/Relational)
To manage subcategories and taxonomies more strictly.

| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | `int` (PK) | |
| `name` | `text` | e.g., 'Vegetables' |
| `parent_id` | `int` | Link to another category for sub-grouping |

## Setup Steps (To Revisit)

1.  **Project Initialization**: Create a project at [supabase.com](https://supabase.com).
2.  **Table Creation**: Use the Supabase SQL Editor to run the creation scripts.
3.  **Data Migration**:
    *   Write a Node script to read `plants/*.json` and `INSERT` into the `plants` table.
    *   Upload current `images/` to a Supabase Storage Bucket.
4.  **Frontend Update**:
    *   Replace `plants/data.js` and `wishlist/data.js` script tags with the Supabase JS Client.
    *   Update `loadState` and `saveState` functions in `index.html` to use `supabase.from('table').select()` and `.insert()`.
5.  **Environment Variables**: Secure the Supabase URL and Anon Key (essential before GitLab upload).
