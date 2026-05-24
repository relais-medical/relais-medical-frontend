const fs = require('fs');
let r = fs.readFileSync('src/pages/Rapports.jsx', 'utf8');
const logo = fs.readFileSync('logo_base64.txt', 'utf8');
r = r.replace(/const LOGO_BASE64 = "[\s\S]*?";/, 'const LOGO_BASE64 = "' + logo + '";');
fs.writeFileSync('src/pages/Rapports.jsx', r);
console.log('Logo remplacé avec succès !');