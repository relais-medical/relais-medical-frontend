import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Plus, Search, FileText, Eye, Trash2, User } from 'lucide-react';
import api from '../services/api';
import Sidebar from '../components/Sidebar';

export default function Rapports() {
  const navigate = useNavigate();
  const [rapports, setRapports] = useState([]);
  const [clients, setClients] = useState([]);
  const [users, setUsers] = useState([]);
  const [commercialSelectionne, setCommercialSelectionne] = useState(null);
  const [recherche, setRecherche] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState({
    client_id: '', date: '', contact: '', fonction: '',
    type_visite: 'Prospection', objectif: '', compte_rendu: '',
    prochaine_action: '', statut: 'Réalisée', interet_client: 3,
  });

  useEffect(() => {
    api.get('/rapports').then(res => setRapports(res.data)).catch(err => console.error(err));
    api.get('/clients').then(res => setClients(res.data)).catch(err => console.error(err));
    api.get('/users').then(res => setUsers(res.data)).catch(() => {});
  }, []);

  const rapportsFiltres = rapports.filter(r => {
    const matchRecherche = r.client?.nom?.toLowerCase().includes(recherche.toLowerCase());
    const matchCommercial = commercialSelectionne === null || r.user_id === commercialSelectionne;
    return matchRecherche && matchCommercial;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/rapports', form);
      const res = await api.get('/rapports');
      setRapports(res.data);
      setShowForm(false);
      setForm({ client_id: '', date: '', contact: '', fonction: '', type_visite: 'Prospection', objectif: '', compte_rendu: '', prochaine_action: '', statut: 'Réalisée', interet_client: 3 });
      setSuccess('Rapport ajouté avec succès !');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSupprimer = async (id) => {
    if (window.confirm('Supprimer ce rapport ?')) {
      await api.delete(`/rapports/${id}`);
      setRapports(rapports.filter(r => r.id !== id));
    }
  };

  const handlePrint = (rapport) => {
    const win = window.open('', '_blank');
    win.document.write(`
      <html><head><title>Rapport — ${rapport.client?.nom}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; padding: 20px; color: #1a1a1a; font-size: 11px; }
        .header-table { width: 100%; border-collapse: collapse; margin-bottom: 0; }
        .header-table td { border: 1px solid #1B4F6B; padding: 4px 8px; vertical-align: middle; }
        .header-ref { width: 180px; font-size: 10px; color: #333; }
        .header-title { text-align: center; font-size: 13px; font-weight: bold; color: #1B4F6B; }
        .header-logo { width: 160px; text-align: right; }
        table.data { width: 100%; border-collapse: collapse; margin-top: 6px; }
        table.data th { background-color: #1B4F6B; color: white; padding: 7px 5px; text-align: center; font-size: 10px; border: 1px solid #0d3347; font-weight: bold; }
        table.data td { padding: 7px 5px; border: 1px solid #ccc; font-size: 10px; vertical-align: top; text-align: left; }
        table.data tr:nth-child(even) td { background-color: #EBF8FF; }
        table.data tr:nth-child(odd) td { background-color: #ffffff; }
        table.data td.center { text-align: center; }
        .stars { color: #F4A261; font-size: 12px; }
        .footer { margin-top: 16px; border-top: 2px solid #1B4F6B; padding-top: 6px; font-size: 9px; color: #888; text-align: center; }
        @page { size: A4 landscape; margin: 10mm; }
      </style></head><body>
      <table class="header-table">
        <tr>
          <td class="header-ref" rowspan="4">
            <div>Référence : F CO 01</div>
            <div>Edition : 01</div>
            <div>Date d'application : 02/06/2023</div>
            <div>Page : 1/1</div>
          </td>
          <td class="header-title" rowspan="2" style="font-size:15px;">Processus commercial</td>
          <td class="header-logo" rowspan="4"><img src="http://127.0.0.1:8000/logo.jpg" style="height:60px;width:auto;" /></td>
        </tr>
        <tr></tr>
        <tr><td class="header-title">Planning et Rapports</td></tr>
        <tr><td class="header-title" style="font-size:10px;color:#555;">Semaine du : <strong>${rapport.date}</strong></td></tr>
      </table>
      <table class="data">
        <thead>
          <tr>
            <th style="width:7%">Date</th>
            <th style="width:12%">Client / Prospect</th>
            <th style="width:9%">Contact</th>
            <th style="width:9%">Fonction</th>
            <th style="width:8%">Téléphone</th>
            <th style="width:7%">Ville</th>
            <th style="width:16%">Objet de visite</th>
            <th style="width:18%">Compte-rendu</th>
            <th style="width:11%">État de suivi</th>
            <th style="width:3%">★</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="center">${rapport.date || '—'}</td>
            <td><strong>${rapport.client?.nom || '—'}</strong></td>
            <td>${rapport.contact || '—'}</td>
            <td>${rapport.fonction || '—'}</td>
            <td>${rapport.client?.telephone || '—'}</td>
            <td>${rapport.client?.ville || '—'}</td>
            <td>${(rapport.objectif || '—').replace(/\n/g, '<br>')}</td>
            <td>${(rapport.compte_rendu || '—').replace(/\n/g, '<br>')}</td>
            <td>${(rapport.prochaine_action || '—').replace(/\n/g, '<br>')}</td>
            <td class="center stars">${'★'.repeat(rapport.interet_client || 0)}</td>
          </tr>
        </tbody>
      </table>
      <div class="footer">Relais Médical — Rapport généré le ${new Date().toLocaleDateString('fr-FR')} — Document confidentiel</div>
      </body></html>
    `);
    win.document.close();
    win.print();
  };

  const statutColor = (s) => {
    const map = {
      'Réalisée': { bg: '#E6FFFA', color: '#2C7A7B' },
      'En attente': { bg: '#FFFAF0', color: '#C05621' },
      'Annulée': { bg: '#FFF5F5', color: '#C53030' }
    };
    return map[s] || { bg: '#F7F9FC', color: '#6b7280' };
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#F7F9FC' }}>
      <Sidebar />

      {/* Liste latérale commerciaux */}
      <div className="w-52 min-h-screen bg-white border-r border-gray-100 flex flex-col shadow-sm">
        <div className="p-4 border-b border-gray-100">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Commerciaux</p>
        </div>
        <div className="flex-1 p-3 space-y-1 overflow-y-auto">
          {/* Tous */}
          <button
            onClick={() => setCommercialSelectionne(null)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition"
            style={{
              backgroundColor: commercialSelectionne === null ? '#1B4F6B' : 'transparent',
              color: commercialSelectionne === null ? 'white' : '#6b7280',
            }}>
            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0"
              style={{
                background: commercialSelectionne === null ? 'rgba(255,255,255,0.2)' : '#F7F9FC',
                color: commercialSelectionne === null ? 'white' : '#6b7280',
              }}>
              <User size={14} />
            </div>
            <div className="text-left">
              <p className="text-xs font-semibold">Tous</p>
              <p className="text-xs opacity-70">{rapports.length} rapports</p>
            </div>
          </button>

          {/* Chaque commercial */}
          {users.map(u => {
            const count = rapports.filter(r => r.user_id === u.id).length;
            const actif = commercialSelectionne === u.id;
            return (
              <button key={u.id}
                onClick={() => setCommercialSelectionne(u.id)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition"
                style={{
                  backgroundColor: actif ? '#1B4F6B' : 'transparent',
                  color: actif ? 'white' : '#6b7280',
                }}>
                <div className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{
                    background: actif ? 'rgba(255,255,255,0.2)' : 'linear-gradient(135deg, #2EC4C4, #1B9999)',
                    color: 'white',
                  }}>
                  {u.name?.charAt(0)?.toUpperCase()}
                </div>
                <div className="text-left">
                  <p className="text-xs font-semibold">{u.name}</p>
                  <p className="text-xs opacity-70">{count} rapport{count !== 1 ? 's' : ''}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 p-8 overflow-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: '#1B4F6B' }}>
              Rapports & Planning
              {commercialSelectionne !== null && (
                <span className="ml-2 text-base font-normal text-gray-400">
                  — {users.find(u => u.id === commercialSelectionne)?.name}
                </span>
              )}
            </h1>
            <p className="text-sm text-gray-400 mt-1">{rapportsFiltres.length} rapports</p>
          </div>
          <button onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold shadow-md"
            style={{ background: 'linear-gradient(135deg, #2EC4C4, #1B9999)' }}>
            <Plus size={16} /> Nouveau rapport
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
            <input type="text" placeholder="Rechercher..." value={recherche}
              onChange={e => setRecherche(e.target.value)} className="flex-1 text-sm outline-none" />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: '#F7F9FC' }}>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400">CLIENT</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400">CONTACT</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400">DATE</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400">TYPE</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400">INTÉRÊT</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {rapportsFiltres.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-400 text-sm">
                    <FileText size={36} className="mx-auto mb-2 text-gray-200" />
                    Aucun rapport trouvé
                  </td>
                </tr>
              ) : (
                rapportsFiltres.map((r, i) => {
                  const sc = statutColor(r.statut);
                  return (
                    <tr key={i} className="border-t border-gray-50 hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm"
                            style={{ background: 'linear-gradient(135deg, #2EC4C4, #1B9999)' }}>
                            {r.client?.nom?.charAt(0)?.toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-800">{r.client?.nom}</p>
                            <p className="text-xs text-gray-400">{r.client?.ville}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm text-gray-700">{r.contact || '—'}</p>
                        <p className="text-xs text-gray-400">{r.fonction || ''}</p>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">{r.date}</td>
                      <td className="px-4 py-4 text-sm text-gray-600">{r.type_visite}</td>
                      <td className="px-4 py-4">
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map(s => (
                            <span key={s} className="text-sm" style={{ color: s <= r.interet_client ? '#F4A261' : '#E5E7EB' }}>★</span>
                          ))}
                        </div>
                      </td>
                      
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <button onClick={() => setShowDetail(r)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: '#EBF8FF', color: '#2B6CB0' }}>
                            <Eye size={14} />
                          </button>
                          <button onClick={() => handlePrint(r)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: '#E6FFFA', color: '#2C7A7B' }}>
                            🖨️
                          </button>
                          <button onClick={() => handleSupprimer(r.id)}
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

      {/* Modal Nouveau rapport */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold" style={{ color: '#1B4F6B' }}>Nouveau rapport</h2>
              <button onClick={() => setShowForm(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 block mb-1.5">Client *</label>
                  <select required value={form.client_id} onChange={e => setForm({ ...form, client_id: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-teal-400">
                    <option value="">Sélectionner</option>
                    {clients.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 block mb-1.5">Date *</label>
                  <input required type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-teal-400" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 block mb-1.5">Contact</label>
                  <input value={form.contact} onChange={e => setForm({ ...form, contact: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-teal-400"
                    placeholder="Dr Sayarh" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 block mb-1.5">Fonction</label>
                  <input value={form.fonction} onChange={e => setForm({ ...form, fonction: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-teal-400"
                    placeholder="Directeur médical" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 block mb-1.5">Type de visite</label>
                  <select value={form.type_visite} onChange={e => setForm({ ...form, type_visite: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-teal-400">
                    <option>Prospection</option><option>Suivi</option><option>Présentation</option>
                  </select>
                </div>
                
          </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1.5">Objet de visite</label>
                <textarea value={form.objectif} onChange={e => setForm({ ...form, objectif: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-teal-400"
                  rows={2} placeholder="Objectif..." />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1.5">Compte rendu</label>
                <textarea value={form.compte_rendu} onChange={e => setForm({ ...form, compte_rendu: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-teal-400"
                  rows={4} placeholder="Détails de la visite..." />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1.5">État de suivi / Actions</label>
                <textarea value={form.prochaine_action} onChange={e => setForm({ ...form, prochaine_action: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-teal-400"
                  rows={2} placeholder="Actions à faire..." />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1.5">Intérêt client</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map(s => (
                    <button key={s} type="button" onClick={() => setForm({ ...form, interet_client: s })}>
                      <span className="text-2xl" style={{ color: s <= form.interet_client ? '#F4A261' : '#E5E7EB' }}>★</span>
                    </button>
                  ))}
                  <span className="text-sm text-gray-400 ml-2">{form.interet_client}/5</span>
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
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold" style={{ color: '#1B4F6B' }}>Rapport de visite</h2>
                <p className="text-sm text-gray-400">{showDetail.client?.nom} — {showDetail.date}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handlePrint(showDetail)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border border-gray-200 hover:bg-gray-50">
                  🖨️ Imprimer
                </button>
                <button onClick={() => setShowDetail(null)}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">✕</button>
              </div>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Client', value: showDetail.client?.nom },
                  { label: 'Date', value: showDetail.date },
                  { label: 'Contact', value: showDetail.contact },
                  { label: 'Fonction', value: showDetail.fonction },
                  { label: 'Ville', value: showDetail.client?.ville },
                  { label: 'Type', value: showDetail.type_visite },
                ].map((f, i) => (
                  <div key={i} className="p-3 rounded-xl" style={{ backgroundColor: '#F7F9FC' }}>
                    <p className="text-xs text-gray-400 mb-1">{f.label}</p>
                    <p className="text-sm font-semibold text-gray-800">{f.value || '—'}</p>
                  </div>
                ))}
              </div>
              {showDetail.objectif && (
                <div className="p-4 rounded-xl border border-gray-100">
                  <p className="text-xs font-semibold text-gray-400 mb-2">OBJET DE VISITE</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{showDetail.objectif}</p>
                </div>
              )}
              {showDetail.compte_rendu && (
                <div className="p-4 rounded-xl" style={{ backgroundColor: '#F0FFF4' }}>
                  <p className="text-xs font-semibold mb-2" style={{ color: '#2C7A7B' }}>COMPTE RENDU</p>
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{showDetail.compte_rendu}</p>
                </div>
              )}
              {showDetail.prochaine_action && (
                <div className="p-4 rounded-xl" style={{ backgroundColor: '#FFFAF0' }}>
                  <p className="text-xs font-semibold mb-2" style={{ color: '#C05621' }}>ÉTAT DE SUIVI / ACTIONS</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{showDetail.prochaine_action}</p>
                </div>
              )}
              <div className="flex items-center gap-2 pt-2">
                <p className="text-xs text-gray-400">Intérêt client :</p>
                {[1, 2, 3, 4, 5].map(s => (
                  <span key={s} className="text-lg" style={{ color: s <= showDetail.interet_client ? '#F4A261' : '#E5E7EB' }}>★</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}