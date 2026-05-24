const fs = require('fs');
let r = fs.readFileSync('src/pages/Rapports.jsx', 'utf8');
r = r.replace('src="${LOGO_BASE64}"', 'src="http://127.0.0.1:8000/logo.jpg"');
fs.writeFileSync('src/pages/Rapports.jsx', r);
console.log('OK!');