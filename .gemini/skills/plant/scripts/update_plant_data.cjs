const fs = require('fs');
const path = require('path');

const plantsDir = path.join(process.cwd(), 'plants');
const dataFilePath = path.join(plantsDir, 'data.js');
const indexFilePath = path.join(plantsDir, 'index.json');

function getAllJsonFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getAllJsonFiles(filePath, fileList);
    } else if (file.endsWith('.json') && file !== 'index.json') {
      fileList.push(filePath);
    }
  }
  return fileList;
}

function updatePlantData() {
  const jsonFiles = getAllJsonFiles(plantsDir);
  
  const plantData = [];
  const plantIds = [];

  for (const filePath of jsonFiles) {
    try {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      plantData.push(data);
      plantIds.push(data.id);
    } catch (e) {
      console.error(`Error reading ${filePath}: ${e.message}`);
    }
  }

  // Sort by id for consistency
  plantData.sort((a, b) => a.id.localeCompare(b.id));
  plantIds.sort();

  // Update plants/index.json
  fs.writeFileSync(indexFilePath, JSON.stringify(plantIds, null, 2));
  console.log(`Updated ${indexFilePath}`);

  // Update plants/data.js
  const jsContent = `// Auto-generated plant data. Updated by /plant command.\nwindow.PLANT_DATA = ${JSON.stringify(plantData, null, 2)};\n`;
  fs.writeFileSync(dataFilePath, jsContent);
  console.log(`Updated ${dataFilePath}`);
}

updatePlantData();
