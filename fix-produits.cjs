const fs = require('fs');
let r = fs.readFileSync('src/pages/Offres.jsx', 'utf8');

const ancien = `<div key={i} className="grid grid-cols-12 gap-2 mb-2 items-center">
    <div className="col-span-5">
      <input placeholder="Nom produit" value={p.nom} onChange={e => modifierProduit(i, 'nom', e.target.value)}
        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none" />
    </div>
    <div className="col-span-2">
      <input type="number" placeholder="Qté" value={p.quantite} onChange={e => modifierProduit(i, 'quantite', e.target.value)}
        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none" />
    </div>
    <div className="col-span-4">
      <input type="number" placeholder="Prix unitaire" value={p.prix_unitaire} onChange={e => modifierProduit(i, 'prix_unitaire', e.target.value)}
        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none" />
    </div>
    <div className="col-span-1">
      <button type="button" onClick={() => supprimerProduit(i)}
        className="w-8 h-8 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-50">✕</button>
    </div>
  </div>`;

const nouveau = `<div key={i} className="grid grid-cols-12 gap-0 items-center border-t border-gray-50 px-3 py-1.5">
      <div className="col-span-6">
        <input placeholder="Nom produit" value={p.nom} onChange={e => modifierProduit(i, 'nom', e.target.value)}
          className="w-full text-sm outline-none bg-transparent" />
      </div>
      <div className="col-span-2">
        <input type="number" placeholder="1" value={p.quantite} onChange={e => modifierProduit(i, 'quantite', e.target.value)}
          className="w-full text-sm outline-none bg-transparent text-center" />
      </div>
      <div className="col-span-3">
        <input type="number" placeholder="0" value={p.prix_unitaire} onChange={e => modifierProduit(i, 'prix_unitaire', e.target.value)}
          className="w-full text-sm outline-none bg-transparent text-right" />
      </div>
      <div className="col-span-1 flex justify-end">
        <button type="button" onClick={() => supprimerProduit(i)}
          className="text-red-300 hover:text-red-500 text-xs">✕</button>
      </div>
    </div>`;

r = r.replace(ancien, nouveau);
fs.writeFileSync('src/pages/Offres.jsx', r);
console.log('OK!');