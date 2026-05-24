import { useState, useEffect } from 'react';
import { Plus, Search, FileText, Eye, Trash2, Upload } from 'lucide-react';
import api from '../services/api';
import Sidebar from '../components/Sidebar';

export default function BonsCommande() {
  const [bons, setBons] = useState([]);
  const [clients, setClients] = useState([]);
  const [recherche, setRecherche] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [fichier, setFichier] = useState(null);
  const [form, setForm] = useState({
    client_id: '', numero: '', date: '',
    montant: '', statut: 'Non livrée', notes: '', modalite_paiement: 'Non défini'
  });

  useEffect(() => {
    api.get('/bons-commande').then(res => setBons(res.data)).catch(err => console.error(err));
    api.get('/clients').then(res => setClients(res.data)).catch(err => console.error(err));
  }, []);

  const bonsFiltres = bons.filter(b =>
    b.client?.nom?.toLowerCase().includes(recherche.toLowerCase()) ||
    b.client?.ville?.toLowerCase().includes(recherche.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      Object.keys(form).forEach(k => formData.append(k, form[k]));
      if (fichier) formData.append('fichier', fichier);
      await api.post('/bons-commande', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const res = await api.get('/bons-commande');
      setBons(res.data);
      setShowForm(false);
      setForm({ client_id: '', numero: '', date: '', montant: '', statut: 'Non livrée', notes: '', modalite_paiement: 'Non défini' });
      setFichier(null);
      setSuccess('Bon de commande ajouté !');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSupprimer = async (id) => {
    if (window.confirm('Supprimer ce bon de commande ?')) {
      await api.delete(`/bons-commande/${id}`);
      setBons(bons.filter(b => b.id !== id));
    }
  };

  const handlePaiement = async (bon, modalite) => {
    try {
      await api.put(`/bons-commande/${bon.id}`, {
        client_id: bon.client?.id,
        numero: bon.numero,
        date: bon.date,
        montant: bon.montant,
        statut: bon.statut,
        notes: bon.notes,
        modalite_paiement: modalite
      });
      const res = await api.get('/bons-commande');
      setBons(res.data);
      setSuccess(`Paiement "${modalite}" enregistré !`);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) { console.error(err); }
  };

  const handleStatut = async (bon, statut) => {
    try {
      await api.put(`/bons-commande/${bon.id}`, {
        client_id: bon.client?.id,
        numero: bon.numero,
        date: bon.date,
        montant: bon.montant,
        statut: statut,
        notes: bon.notes,
        modalite_paiement: bon.modalite_paiement
      });
      const res = await api.get('/bons-commande');
      setBons(res.data);
      setSuccess(`Statut "${statut}" enregistré !`);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) { console.error(err); }
  };

  const statutColor = (s) => {
    const map = {
      'Non livrée': { bg: '#FFFAF0', color: '#C05621' },
      'Livrée':     { bg: '#E6FFFA', color: '#2C7A7B' },
    };
    return map[s] || { bg: '#F7F9FC', color: '#6b7280' };
  };

  const paiementColor = (p) => {
    const map = {
      'Espèces':    { bg: '#F0FFF4', color: '#276749' },
      'Chèque':     { bg: '#EBF8FF', color: '#2B6CB0' },
      'Virement':   { bg: '#FAF5FF', color: '#553C9A' },
      'Traite':     { bg: '#FFFAF0', color: '#C05621' },
      'Non défini': { bg: '#F7F9FC', color: '#9CA3AF' },
    };
    return map[p] || { bg: '#F7F9FC', color: '#9CA3AF' };
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#F7F9FC' }}>
      <Sidebar />
      <div className="flex-1 p-8 overflow-auto">

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: '#1B4F6B' }}>Bons de commande</h1>
            <p className="text-sm text-gray-400 mt-1">{bons.length} bons enregistrés</p>
          </div>
          <button onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold shadow-md"
            style={{ background: 'linear-gradient(135deg, #2EC4C4, #1B9999)' }}>
            <Plus size={16} /> Nouveau BC
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
            <input type="text" placeholder="Rechercher par client ou ville..."
              value={recherche} onChange={e => setRecherche(e.target.value)}
              className="flex-1 text-sm outline-none" />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: '#F7F9FC' }}>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400">NUMÉRO</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400">CLIENT</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400">DATE</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400">MONTANT</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400">STATUT</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400">PAIEMENT</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400">FICHIER</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {bonsFiltres.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-gray-400 text-sm">
                    <FileText size={36} className="mx-auto mb-2 text-gray-200" />
                    Aucun bon de commande
                  </td>
                </tr>
              ) : (
                bonsFiltres.map((b, i) => {
                  const sc = statutColor(b.statut);
                  const pc = paiementColor(b.modalite_paiement || 'Non défini');
                  return (
                    <tr key={i} className="border-t border-gray-50 hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <span className="text-sm font-bold" style={{ color: '#1B4F6B' }}>{b.numero}</span>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm font-semibold text-gray-800">{b.client?.nom}</p>
                        <p className="text-xs text-gray-400">{b.client?.ville}</p>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">{b.date}</td>
                      <td className="px-4 py-4">
                        <span className="text-sm font-bold" style={{ color: '#1B4F6B' }}>
                          {Number(b.montant).toLocaleString()} DH
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <select
                          value={b.statut || 'Non livrée'}
                          onChange={e => handleStatut(b, e.target.value)}
                          className="text-xs px-2 py-1.5 rounded-lg border outline-none cursor-pointer font-medium"
                          style={{ backgroundColor: sc.bg, color: sc.color, borderColor: sc.color + '40' }}>
                          <option>Non livrée</option>
                          <option>Livrée</option>
                        </select>
                      </td>
                      <td className="px-4 py-4">
                        <select
                          value={b.modalite_paiement || 'Non défini'}
                          onChange={e => handlePaiement(b, e.target.value)}
                          className="text-xs px-2 py-1.5 rounded-lg border outline-none cursor-pointer font-medium"
                          style={{ backgroundColor: pc.bg, color: pc.color, borderColor: pc.color + '40' }}>
                          <option>Non défini</option>
                          <option>Espèces</option>
                          <option>Chèque</option>
                          <option>Virement</option>
                          <option>Traite</option>
                        </select>
                      </td>
                      <td className="px-4 py-4">
                        {b.fichier ? (
                          <a href={`http://127.0.0.1:8000/bons_commande/${b.fichier}`}
                            target="_blank" rel="noreferrer"
                            className="text-xs px-3 py-1 rounded-lg font-medium"
                            style={{ backgroundColor: '#EBF8FF', color: '#2B6CB0' }}>
                            📄 Voir
                          </a>
                        ) : (
                          <span className="text-xs text-gray-300">—</span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <button onClick={() => setShowDetail(b)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: '#EBF8FF', color: '#2B6CB0' }}>
                            <Eye size={14} />
                          </button>
                          <button onClick={() => handleSupprimer(b.id)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: '#FFF5F5', color: '#C53030' }}>
                            <Trash2 size={14} />
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

      {/* Modal Nouveau BC */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold" style={{ color: '#1B4F6B' }}>Nouveau bon de commande</h2>
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
                    {clients.map(c => <option key={c.id} value={c.id}>{c.nom} — {c.ville}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 block mb-1.5">Numéro BC *</label>
                  <input required value={form.numero} onChange={e => setForm({ ...form, numero: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none"
                    placeholder="BC-2026-001" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 block mb-1.5">Date *</label>
                  <input required type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 block mb-1.5">Montant (DH)</label>
                  <input type="number" value={form.montant} onChange={e => setForm({ ...form, montant: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none"
                    placeholder="0" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 block mb-1.5">Statut</label>
                  <select value={form.statut} onChange={e => setForm({ ...form, statut: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none">
                    <option>Non livrée</option>
                    <option>Livrée</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 block mb-1.5">Modalité de paiement</label>
                  <select value={form.modalite_paiement} onChange={e => setForm({ ...form, modalite_paiement: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none">
                    <option>Non défini</option>
                    <option>Espèces</option>
                    <option>Chèque</option>
                    <option>Virement</option>
                    <option>Traite</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1.5">Notes / Produits</label>
                <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none"
                  rows={3} placeholder="Détails des produits commandés, prix..." />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1.5">Fichier BC (PDF ou image)</label>
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center">
                  <input type="file" accept=".pdf,.jpg,.jpeg,.png"
                    onChange={e => setFichier(e.target.files[0])}
                    className="hidden" id="fichier-bc" />
                  <label htmlFor="fichier-bc" className="cursor-pointer">
                    <Upload size={24} className="mx-auto mb-2 text-gray-300" />
                    <p className="text-sm text-gray-400">
                      {fichier ? fichier.name : 'Cliquez pour uploader le BC'}
                    </p>
                    <p className="text-xs text-gray-300 mt-1">PDF, JPG, PNG</p>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600">Annuler</button>
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
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold" style={{ color: '#1B4F6B' }}>{showDetail.numero}</h2>
                <p className="text-sm text-gray-400">{showDetail.client?.nom} — {showDetail.client?.ville}</p>
              </div>
              <button onClick={() => setShowDetail(null)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">✕</button>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Client', value: showDetail.client?.nom },
                { label: 'Ville', value: showDetail.client?.ville },
                { label: 'Date', value: showDetail.date },
                { label: 'Montant', value: `${Number(showDetail.montant).toLocaleString()} DH` },
                { label: 'Statut', value: showDetail.statut },
                { label: 'Modalité paiement', value: showDetail.modalite_paiement || 'Non défini' },
              ].map((f, i) => (
                <div key={i} className="flex justify-between p-3 rounded-xl" style={{ backgroundColor: '#F7F9FC' }}>
                  <p className="text-xs text-gray-400">{f.label}</p>
                  <p className="text-sm font-semibold text-gray-800">{f.value || '—'}</p>
                </div>
              ))}

              {showDetail.notes && (
                <div className="p-4 rounded-xl" style={{ backgroundColor: '#EBF8FF' }}>
                  <p className="text-xs font-semibold mb-1" style={{ color: '#2B6CB0' }}>NOTES / PRODUITS</p>
                  <p className="text-sm text-gray-700 whitespace-pre-line">{showDetail.notes}</p>
                </div>
              )}

              {showDetail.fichier && (
                <a href={`http://127.0.0.1:8000/bons_commande/${showDetail.fichier}`}
                  target="_blank" rel="noreferrer"
                  className="block text-center py-2.5 rounded-xl text-white text-sm font-semibold"
                  style={{ background: 'linear-gradient(135deg, #2EC4C4, #1B9999)' }}>
                  📄 Voir le fichier BC
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}