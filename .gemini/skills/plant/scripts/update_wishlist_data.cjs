const fs = require('fs');
const path = require('path');

const wishlistDir = path.join(process.cwd(), 'wishlist');
const dataFilePath = path.join(wishlistDir, 'data.js');
const indexFilePath = path.join(wishlistDir, 'index.json');

function updateWishlistData() {
  const files = fs.readdirSync(wishlistDir);
  const jsonFiles = files.filter(f => f.endsWith('.json') && f !== 'index.json');
  
  const wishlistData = [];
  const wishlistIds = [];

  for (const file of jsonFiles) {
    const filePath = path.join(wishlistDir, file);
    try {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      wishlistData.push(data);
      wishlistIds.push(data.id);
    } catch (e) {
      console.error(`Error reading ${file}: ${e.message}`);
    }
  }

  // Sort by id for consistency
  wishlistData.sort((a, b) => a.id.localeCompare(b.id));
  wishlistIds.sort();

  // Update wishlist/index.json
  fs.writeFileSync(indexFilePath, JSON.stringify(wishlistIds, null, 2));
  console.log(`Updated ${indexFilePath}`);

  // Update wishlist/data.js
  const jsContent = `// Auto-generated wishlist data.\nwindow.WISHLIST_DATA = ${JSON.stringify(wishlistData, null, 2)};\n`;
  fs.writeFileSync(dataFilePath, jsContent);
  console.log(`Updated ${dataFilePath}`);
}

updateWishlistData();
