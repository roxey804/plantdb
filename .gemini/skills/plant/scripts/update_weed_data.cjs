const fs = require('fs');
const path = require('path');

const weedsDir = path.join(process.cwd(), 'weeds');
const dataFilePath = path.join(weedsDir, 'data.js');
const indexFilePath = path.join(weedsDir, 'index.json');

function updateWeedData() {
  const files = fs.readdirSync(weedsDir);
  const jsonFiles = files.filter(f => f.endsWith('.json') && f !== 'index.json');
  
  const weedData = [];
  const weedIds = [];

  for (const file of jsonFiles) {
    const filePath = path.join(weedsDir, file);
    try {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      weedData.push(data);
      weedIds.push(data.id);
    } catch (e) {
      console.error(`Error reading ${file}: ${e.message}`);
    }
  }

  // Sort by id for consistency
  weedData.sort((a, b) => a.id.localeCompare(b.id));
  weedIds.sort();

  // Update weeds/index.json
  fs.writeFileSync(indexFilePath, JSON.stringify(weedIds, null, 2));
  console.log(`Updated ${indexFilePath}`);

  // Update weeds/data.js
  const jsContent = `// Auto-generated weed data.\nwindow.WEED_DATA = ${JSON.stringify(weedData, null, 2)};\n`;
  fs.writeFileSync(dataFilePath, jsContent);
  console.log(`Updated ${dataFilePath}`);
}

updateWeedData();
