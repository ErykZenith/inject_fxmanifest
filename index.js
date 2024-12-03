const fs = require('fs');
const path = require('path');

const baseDirectory = '/ServerResource/resources';

const newCode = `--(
--Inject FxManifest
client_scripts {
"@.../init.lua"
}
server_scripts {
"@.../init.lua"
}
--)
`;

const readFile = (filePath) => {
  return fs.readFileSync(filePath, 'utf8');
};

const writeFile = (filePath, content) => {
  fs.writeFileSync(filePath, content, 'utf8');
};

const updateFxManifest = (filePath, code) => {
  let content = readFile(filePath);

  const startPattern = /--\([\s\S]*?--\)\n?/g;
  if (startPattern.test(content)) {
    content = content.replace(startPattern, '');
  }

  content = code + content.trimStart();

  writeFile(filePath, content);
  console.log(`\x1b[33m update : \x1b[32m${filePath}`);
};

const findFxManifests = (directory) => {
  const resources = fs.readdirSync(directory);
  
  for (const file of resources) {
    const filePath = path.join(directory, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      findFxManifests(filePath);
    } else if (file === 'fxmanifest.lua') {
      updateFxManifest(filePath, newCode);
    }
  }
};

try {
  findFxManifests(path.resolve(__dirname, `../${baseDirectory}`));
  console.log('\x1b[0m');
} catch (error) {
  console.error(error.message);
}
