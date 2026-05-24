import { useState, useEffect } from 'react';
import { Plus, Search, FileText, Eye, Trash2, CheckCircle, Clock, ShoppingCart, Send, XCircle } from 'lucide-react';
import api from '../services/api';
import Sidebar from '../components/Sidebar';

export default function Offres() {
  const [offres, setOffres] = useState([]);
  const [clients, setClients] = useState([]);
  const [recherche, setRecherche] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState({
    client_id: '', date: '',
    delai_livraison: 15, validite: 30,
    produits: [{ nom: '', quantite: 1, prix_unitaire: 0 }]
  });

  useEffect(() => {
    api.get('/offres').then(res => setOffres(res.data)).catch(err => console.error(err));
    api.get('/clients').then(res => setClients(res.data)).catch(err => console.error(err));
  }, []);

  const genererReference = () => {
    const date = new Date();
    const num = String(offres.length + 1).padStart(3, '0');
    return `O-${date.getFullYear()}-${num}`;
  };

  const offresFiltres = offres.filter(o =>
    o.client?.nom?.toLowerCase().includes(recherche.toLowerCase())
  );

  const ajouterProduit = () => {
    setForm({ ...form, produits: [...form.produits, { nom: '', quantite: 1, prix_unitaire: 0 }] });
  };

  const supprimerProduit = (i) => {
    setForm({ ...form, produits: form.produits.filter((_, idx) => idx !== i) });
  };

  const modifierProduit = (i, champ, valeur) => {
    const p = [...form.produits];
    p[i][champ] = valeur;
    setForm({ ...form, produits: p });
  };

  const calculerTotal = () =>
    form.produits.reduce((acc, p) => acc + (p.quantite * p.prix_unitaire), 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = { ...form, reference: genererReference(), montant_total: calculerTotal(), statut: 'En cours' };
      await api.post('/offres', data);
      const res = await api.get('/offres');
      setOffres(res.data);
      setShowForm(false);
      setForm({ client_id: '', date: '', delai_livraison: 15, validite: 30, produits: [{ nom: '', quantite: 1, prix_unitaire: 0 }] });
      setSuccess('Offre ajoutée avec succès !');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSupprimer = async (id) => {
    if (window.confirm('Supprimer cette offre ?')) {
      await api.delete(`/offres/${id}`);
      setOffres(offres.filter(o => o.id !== id));
    }
  };

  const handleStatut = async (offre, nouveauStatut) => {
    try {
      await api.put(`/offres/${offre.id}`, {
        client_id: offre.client?.id,
        date: offre.date,
        delai_livraison: offre.delai_livraison,
        validite: offre.validite,
        montant_total: offre.montant_total,
        reference: offre.reference,
        statut: nouveauStatut
      });
      const res = await api.get('/offres');
      setOffres(res.data);
      setSuccess(`Offre marquée "${nouveauStatut}" !`);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) { console.error(err); }
  };

  const statutColor = (s) => {
    const map = {
      'En cours':  { bg: '#EBF8FF', color: '#2B6CB0' },
      'Validée':   { bg: '#E6FFFA', color: '#2C7A7B' },
      'Commandée': { bg: '#F0FFF4', color: '#276749' },
      'Transmise': { bg: '#FAF5FF', color: '#6B46C1' },
      'Refusée':   { bg: '#FFF5F5', color: '#C53030' },
    };
    return map[s] || { bg: '#F7F9FC', color: '#6b7280' };
  };

  const boutonsStatut = (offre) => {
    const statuts = [
      { label: 'Valider',     value: 'Validée',   icon: <CheckCircle size={11} />, bg: '#E6FFFA', color: '#2C7A7B' },
      { label: 'En cours',    value: 'En cours',  icon: <Clock size={11} />,       bg: '#EBF8FF', color: '#2B6CB0' },
      { label: 'Commander',   value: 'Commandée', icon: <ShoppingCart size={11} />,bg: '#F0FFF4', color: '#276749' },
      { label: 'Transmettre', value: 'Transmise', icon: <Send size={11} />,        bg: '#FAF5FF', color: '#6B46C1' },
      { label: 'Refuser',     value: 'Refusée',   icon: <XCircle size={11} />,     bg: '#FFF5F5', color: '#C53030' },
    ];
    return statuts.filter(s => s.value !== offre.statut);
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#F7F9FC' }}>
      <Sidebar />
      <div className="flex-1 p-8 overflow-auto">

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: '#1B4F6B' }}>Offres commerciales</h1>
            <p className="text-sm text-gray-400 mt-1">{offres.length} offres enregistrées</p>
          </div>
          <button onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold shadow-md"
            style={{ background: 'linear-gradient(135deg, #2EC4C4, #1B9999)' }}>
            <Plus size={16} /> Nouvelle offre
          </button>
        </div>

        {success && (
          <div className="mb-4 px-4 py-3 rounded-xl text-sm text-white" style={{ backgroundColor: '#2EC4C4' }}>
            ✓ {success}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-2.5">
            <Search size={16} className="text-gray-400" />
            <input type="text" placeholder="Rechercher par client..." value={recherche}
              onChange={e => setRecherche(e.target.value)} className="flex-1 text-sm outline-none" />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: '#F7F9FC' }}>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400">RÉFÉRENCE</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400">CLIENT</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400">DATE</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400">MONTANT HT</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400">STATUT</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {offresFiltres.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-400 text-sm">
                    <FileText size={36} className="mx-auto mb-2 text-gray-200" />
                    Aucune offre — cliquez sur + Nouvelle offre
                  </td>
                </tr>
              ) : (
                offresFiltres.map((o, i) => {
                  const sc = statutColor(o.statut);
                  return (
                    <tr key={i} className="border-t border-gray-50 hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <span className="text-sm font-bold" style={{ color: '#1B4F6B' }}>{o.reference}</span>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm font-semibold text-gray-800">{o.client?.nom}</p>
                        <p className="text-xs text-gray-400">{o.client?.ville}</p>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">{o.date}</td>
                      <td className="px-4 py-4">
                        <span className="text-sm font-bold" style={{ color: '#1B4F6B' }}>
                          {Number(o.montant_total).toLocaleString()} DH HT
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-xs px-3 py-1 rounded-full font-medium"
                          style={{ backgroundColor: sc.bg, color: sc.color }}>
                          {o.statut}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1 flex-wrap">
                          {boutonsStatut(o).map((btn, j) => (
                            <button key={j} onClick={() => handleStatut(o, btn.value)}
                              className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium hover:opacity-80 transition"
                              style={{ backgroundColor: btn.bg, color: btn.color }}>
                              {btn.icon} {btn.label}
                            </button>
                          ))}
                          <button onClick={() => setShowDetail(o)}
                            className="w-7 h-7 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: '#EBF8FF', color: '#2B6CB0' }}>
                            <Eye size={13} />
                          </button>
                          <button onClick={() => handleSupprimer(o.id)}
                            className="w-7 h-7 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: '#FFF5F5', color: '#C53030' }}>
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Nouvelle offre */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold" style={{ color: '#1B4F6B' }}>Nouvelle offre</h2>
              <button onClick={() => setShowForm(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 block mb-1.5">Client *</label>
                  <select required value={form.client_id} onChange={e => setForm({ ...form, client_id: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none">
                    <option value="">Sélectionner</option>
                    {clients.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 block mb-1.5">Date *</label>
                  <input required type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 block mb-1.5">Délai livraison (j)</label>
                  <input type="number" value={form.delai_livraison}
                    onChange={e => setForm({ ...form, delai_livraison: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 block mb-1.5">Validité (j)</label>
                  <input type="number" value={form.validite}
                    onChange={e => setForm({ ...form, validite: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-gray-500">Produits</label>
                  <button type="button" onClick={ajouterProduit}
                    className="text-xs px-3 py-1.5 rounded-lg text-white"
                    style={{ background: 'linear-gradient(135deg, #2EC4C4, #1B9999)' }}>
                    + Ajouter
                  </button>
                </div>
                <div className="border border-gray-100 rounded-xl overflow-hidden">
                  <div className="grid grid-cols-12 px-3 py-2" style={{ backgroundColor: '#F7F9FC' }}>
                    <div className="col-span-6 text-xs text-gray-400 font-semibold">Produit</div>
                    <div className="col-span-2 text-xs text-gray-400 font-semibold text-center">Qté</div>
                    <div className="col-span-3 text-xs text-gray-400 font-semibold text-right">Prix unit.</div>
                    <div className="col-span-1"></div>
                  </div>
                  {form.produits.map((p, i) => (
                    <div key={i} className="grid grid-cols-12 items-center border-t border-gray-100 px-3 py-2">
                      <div className="col-span-6 pr-2">
                        <input placeholder="Nom produit" value={p.nom}
                          onChange={e => modifierProduit(i, 'nom', e.target.value)}
                          className="w-full text-sm outline-none border border-gray-200 rounded-lg px-2 py-1.5" />
                      </div>
                      <div className="col-span-2 px-1">
                        <input type="number" value={p.quantite}
                          onChange={e => modifierProduit(i, 'quantite', e.target.value)}
                          className="w-full text-sm outline-none border border-gray-200 rounded-lg px-2 py-1.5 text-center" />
                      </div>
                      <div className="col-span-3 px-1">
                        <input type="number" value={p.prix_unitaire}
                          onChange={e => modifierProduit(i, 'prix_unitaire', e.target.value)}
                          className="w-full text-sm outline-none border border-gray-200 rounded-lg px-2 py-1.5 text-right" />
                      </div>
                      <div className="col-span-1 flex justify-end">
                        <button type="button" onClick={() => supprimerProduit(i)}
                          className="text-red-300 hover:text-red-500 text-sm">✕</button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="text-right mt-2">
                  <span className="text-sm font-bold" style={{ color: '#1B4F6B' }}>
                    Total HT : {calculerTotal().toLocaleString()} DH
                  </span>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600">
                  Annuler
                </button>
                <button type="submit" disabled={loading}
                  className="flex-1 py-2.5 rounded-xl text-white text-sm font-semibold disabled:opacity-50"
                  style={{ background: 'linear-gradient(135deg, #2EC4C4, #1B9999)' }}>
                  {loading ? 'Enregistrement...' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Détail */}
      {showDetail && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold" style={{ color: '#1B4F6B' }}>{showDetail.reference}</h2>
                <p className="text-sm text-gray-400">{showDetail.client?.nom} — {showDetail.date}</p>
              </div>
              <button onClick={() => setShowDetail(null)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">✕</button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Client', value: showDetail.client?.nom },
                  { label: 'Date', value: showDetail.date },
                  { label: 'Statut', value: showDetail.statut },
                  { label: 'Montant HT', value: `${Number(showDetail.montant_total).toLocaleString()} DH HT` },
                  { label: 'Délai livraison', value: `${showDetail.delai_livraison} jours` },
                  { label: 'Validité', value: `${showDetail.validite} jours` },
                ].map((f, i) => (
                  <div key={i} className="p-3 rounded-xl" style={{ backgroundColor: '#F7F9FC' }}>
                    <p className="text-xs text-gray-400 mb-1">{f.label}</p>
                    <p className="text-sm font-semibold text-gray-800">{f.value || '—'}</p>
                  </div>
                ))}
              </div>

              {showDetail.produits && showDetail.produits.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-400 mb-2">PRODUITS</p>
                  <div className="border border-gray-100 rounded-xl overflow-hidden">
                    <div className="grid grid-cols-12 px-4 py-2 text-xs text-gray-400 font-semibold" style={{ backgroundColor: '#F7F9FC' }}>
                      <div className="col-span-6">Produit</div>
                      <div className="col-span-2 text-center">Qté</div>
                      <div className="col-span-2 text-right">Prix unit.</div>
                      <div className="col-span-2 text-right">Total</div>
                    </div>
                    {showDetail.produits.map((p, i) => (
                      <div key={i} className="grid grid-cols-12 px-4 py-2 border-t border-gray-50 text-sm">
                        <div className="col-span-6 text-gray-800">{p.nom}</div>
                        <div className="col-span-2 text-center text-gray-600">{p.quantite}</div>
                        <div className="col-span-2 text-right text-gray-600">{Number(p.prix_unitaire).toLocaleString()}</div>
                        <div className="col-span-2 text-right font-semibold" style={{ color: '#1B4F6B' }}>
                          {(p.quantite * p.prix_unitaire).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}