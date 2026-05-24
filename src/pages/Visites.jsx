import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Plus, Search, Calendar, Clock, Eye, Edit2, Trash2, CheckCircle, RotateCcw, XCircle, Archive, User } from 'lucide-react';
import api from '../services/api';
import Sidebar from '../components/Sidebar';

const FormVisite = ({ data, setData, onSubmit, title, onClose, loading, clients }) => (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 max-h-screen overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold" style={{ color: '#1B4F6B' }}>{title}</h2>
        <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200">✕</button>
      </div>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-gray-500 block mb-1.5">Client *</label>
          <select required value={data.client_id} onChange={e => setData({ ...data, client_id: e.target.value })}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-teal-400">
            <option value="">Sélectionner un client</option>
            {clients.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-gray-500 block mb-1.5">Date *</label>
            <input required type="date" value={data.date} onChange={e => setData({ ...data, date: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-teal-400" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 block mb-1.5">Heure *</label>
            <input required type="time" value={data.heure} onChange={e => setData({ ...data, heure: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-teal-400" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-gray-500 block mb-1.5">Type de visite</label>
            <select value={data.type_visite} onChange={e => setData({ ...data, type_visite: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-teal-400">
              <option>Prospection</option>
              <option>Suivi</option>
              <option>Présentation</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 block mb-1.5">Priorité</label>
            <select value={data.priorite} onChange={e => setData({ ...data, priorite: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-teal-400">
              <option>Haute</option>
              <option>Moyenne</option>
              <option>Basse</option>
            </select>
          </div>
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-500 block mb-1.5">Objectif</label>
          <textarea value={data.objectif} onChange={e => setData({ ...data, objectif: e.target.value })}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-teal-400"
            rows={2} placeholder="Objectif de la visite..." />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-500 block mb-1.5">Compte rendu</label>
          <textarea value={data.compte_rendu} onChange={e => setData({ ...data, compte_rendu: e.target.value })}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-teal-400"
            rows={2} placeholder="Compte rendu de la visite..." />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-500 block mb-1.5">Prochaine action</label>
          <input value={data.prochaine_action} onChange={e => setData({ ...data, prochaine_action: e.target.value })}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-teal-400"
            placeholder="Prochaine action à faire..." />
        </div>
        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50">Annuler</button>
          <button type="submit" disabled={loading}
            className="flex-1 py-2.5 rounded-xl text-white text-sm font-semibold disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, #2EC4C4, #1B9999)' }}>
            {loading ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
      </form>
    </div>
  </div>
);

export default function Visites() {
  const navigate = useNavigate();
  const [visites, setVisites] = useState([]);
  const [clients, setClients] = useState([]);
  const [users, setUsers] = useState([]);
  const [filtre, setFiltre] = useState('Tous');
  const [recherche, setRecherche] = useState('');
  const [modeArchive, setModeArchive] = useState(false);
  const [commercialSelectionne, setCommercialSelectionne] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [visiteSelected, setVisiteSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState({
    client_id: '', date: '', heure: '', type_visite: 'Prospection',
    priorite: 'Moyenne', objectif: '', compte_rendu: '',
    prochaine_action: '', statut: 'Prévue'
  });

  useEffect(() => {
    api.get('/visites').then(res => setVisites(res.data));
    api.get('/clients').then(res => setClients(res.data));
    api.get('/users').then(res => setUsers(res.data)).catch(() => {});
  }, []);

  const statutsActifs = ['Prévue', 'En attente', 'Reportée'];
  const statutsArchives = ['Réalisée', 'Annulée'];

  const visitesBase = visites.filter(v =>
    modeArchive
      ? statutsArchives.includes(v.statut)
      : statutsActifs.includes(v.statut)
  );

  const visitesFiltrees = visitesBase.filter(v => {
    const matchFiltre = filtre === 'Tous' || v.statut === filtre;
    const matchRecherche = v.client?.nom?.toLowerCase().includes(recherche.toLowerCase());
    const matchCommercial = !commercialSelectionne || v.user_id === commercialSelectionne;
    return matchFiltre && matchRecherche && matchCommercial;
  });

  const nbArchives = visites.filter(v => statutsArchives.includes(v.statut)).length;
  const nbActives = visites.filter(v => statutsActifs.includes(v.statut)).length;

  const getNbVisitesParCommercial = (userId) => {
    return visites.filter(v => v.user_id === userId).length;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/visites', { ...form, statut: 'Prévue' });
      const res = await api.get('/visites');
      setVisites(res.data);
      setShowForm(false);
      setForm({ client_id: '', date: '', heure: '', type_visite: 'Prospection', priorite: 'Moyenne', objectif: '', compte_rendu: '', prochaine_action: '', statut: 'Prévue' });
      setSuccess('Visite ajoutée avec succès !');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleModifier = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put(`/visites/${visiteSelected.id}`, visiteSelected);
      const res = await api.get('/visites');
      setVisites(res.data);
      setShowEdit(false);
      setSuccess('Visite modifiée avec succès !');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleSupprimer = async (id) => {
    if (window.confirm('Voulez-vous vraiment supprimer cette visite ?')) {
      await api.delete(`/visites/${id}`);
      setVisites(visites.filter(v => v.id !== id));
      setSuccess('Visite supprimée !');
      setTimeout(() => setSuccess(''), 3000);
    }
  };

  const handleStatut = async (visite, nouveauStatut) => {
    try {
      await api.put(`/visites/${visite.id}`, { ...visite, client_id: visite.client?.id, statut: nouveauStatut });
      const res = await api.get('/visites');
      setVisites(res.data);
      setSuccess(`Visite marquée comme "${nouveauStatut}" !`);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) { console.error(err); }
  };

  const statutColor = (statut) => {
    switch (statut) {
      case 'Réalisée':   return { bg: '#E6FFFA', color: '#2C7A7B' };
      case 'Prévue':     return { bg: '#EBF8FF', color: '#2B6CB0' };
      case 'En attente': return { bg: '#FFFAF0', color: '#C05621' };
      case 'Reportée':   return { bg: '#FAF5FF', color: '#6B46C1' };
      case 'Annulée':    return { bg: '#FFF5F5', color: '#C53030' };
      default:           return { bg: '#F7F9FC', color: '#6b7280' };
    }
  };

  const prioriteColor = (priorite) => {
    switch (priorite) {
      case 'Haute':   return '#E53E3E';
      case 'Moyenne': return '#E8832A';
      case 'Basse':   return '#38A169';
      default:        return '#6b7280';
    }
  };

  const filtresActifs = ['Tous', 'Prévue', 'En attente', 'Reportée'];
  const filtresArchives = ['Tous', 'Réalisée', 'Annulée'];

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#F7F9FC' }}>
      <Sidebar />

      {/* Liste latérale commerciaux */}
      <div className="w-64 bg-white border-r border-gray-100 flex flex-col">
        <div className="p-4 border-b border-gray-100">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Commerciaux</p>
        </div>
        <div className="flex-1 p-3 space-y-1 overflow-y-auto">
          <button
            onClick={() => setCommercialSelectionne(null)}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl transition"
            style={{
              backgroundColor: !commercialSelectionne ? '#1B4F6B' : 'transparent',
              color: !commercialSelectionne ? 'white' : '#374151'
            }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: !commercialSelectionne ? 'rgba(255,255,255,0.2)' : '#F7F9FC' }}>
              <User size={16} color={!commercialSelectionne ? 'white' : '#6b7280'} />
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold">Tous</p>
              <p className="text-xs opacity-70">{visites.length} visites</p>
            </div>
          </button>

          {users.map(u => (
            <button key={u.id}
              onClick={() => setCommercialSelectionne(u.id)}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-xl transition"
              style={{
                backgroundColor: commercialSelectionne === u.id ? '#1B4F6B' : 'transparent',
                color: commercialSelectionne === u.id ? 'white' : '#374151'
              }}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #2EC4C4, #1B9999)' }}>
                {u.name?.charAt(0)?.toUpperCase()}
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold">{u.name}</p>
                <p className="text-xs opacity-70">{getNbVisitesParCommercial(u.id)} visites</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 p-8 overflow-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: '#1B4F6B' }}>
              {modeArchive ? '📦 Archives des visites' : 'Visites'}
              {commercialSelectionne && (
                <span className="text-lg font-normal text-gray-400 ml-2">
                  — {users.find(u => u.id === commercialSelectionne)?.name}
                </span>
              )}
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              {modeArchive ? `${nbArchives} visites archivées` : `${nbActives} visites actives`}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => { setModeArchive(!modeArchive); setFiltre('Tous'); }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition"
              style={{
                backgroundColor: modeArchive ? '#1B4F6B' : 'white',
                color: modeArchive ? 'white' : '#1B4F6B',
                borderColor: '#1B4F6B'
              }}>
              <Archive size={15} />
              {modeArchive ? 'Visites actives' : `Archives (${nbArchives})`}
            </button>
            {!modeArchive && (
              <button onClick={() => setShowForm(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold shadow-md hover:opacity-90 transition"
                style={{ background: 'linear-gradient(135deg, #2EC4C4, #1B9999)' }}>
                <Plus size={16} /> Nouvelle visite
              </button>
            )}
          </div>
        </div>

        {success && (
          <div className="mb-4 px-4 py-3 rounded-xl text-sm text-white" style={{ backgroundColor: '#2EC4C4' }}>
            ✓ {success}
          </div>
        )}

        {modeArchive && (
          <div className="mb-4 px-4 py-3 rounded-xl text-sm flex items-center gap-2"
            style={{ backgroundColor: '#EBF8FF', color: '#2B6CB0' }}>
            <Archive size={16} />
            Mode Archives — Visites Réalisées et Annulées
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex gap-4 items-center">
            <div className="flex-1 flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-2.5">
              <Search size={16} className="text-gray-400" />
              <input type="text" placeholder="Rechercher une visite..."
                value={recherche} onChange={e => setRecherche(e.target.value)}
                className="flex-1 text-sm outline-none text-gray-700" />
            </div>
            <div className="flex gap-2">
              {(modeArchive ? filtresArchives : filtresActifs).map(f => (
                <button key={f} onClick={() => setFiltre(f)}
                  className="px-3 py-2 rounded-xl text-xs font-medium transition"
                  style={{
                    backgroundColor: filtre === f ? '#1B4F6B' : '#F7F9FC',
                    color: filtre === f ? 'white' : '#6b7280',
                  }}>
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid px-6 py-3 border-b border-gray-100 bg-gray-50"
            style={{ gridTemplateColumns: '2fr 1.2fr 1fr 1fr 1fr 1.8fr' }}>
            <p className="text-xs font-semibold text-gray-400">CLIENT</p>
            <p className="text-xs font-semibold text-gray-400">DATE & HEURE</p>
            <p className="text-xs font-semibold text-gray-400">TYPE</p>
            <p className="text-xs font-semibold text-gray-400">PRIORITÉ</p>
            <p className="text-xs font-semibold text-gray-400">STATUT</p>
            <p className="text-xs font-semibold text-gray-400">ACTIONS</p>
          </div>

          {visitesFiltrees.length === 0 ? (
            <div className="p-12 text-center">
              <Calendar size={40} className="mx-auto mb-3 text-gray-200" />
              <p className="text-gray-400 text-sm">
                {modeArchive ? 'Aucune visite archivée' : 'Aucune visite active'}
              </p>
              {!modeArchive && (
                <button onClick={() => setShowForm(true)}
                  className="mt-3 text-sm font-medium" style={{ color: '#2EC4C4' }}>
                  + Ajouter une visite
                </button>
              )}
            </div>
          ) : (
            visitesFiltrees.map((visite, i) => {
              const sc = statutColor(visite.statut);
              return (
                <div key={i} className="grid px-6 py-4 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition items-center"
                  style={{ gridTemplateColumns: '2fr 1.2fr 1fr 1fr 1fr 1.8fr' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                      style={{ background: 'linear-gradient(135deg, #2EC4C4, #1B9999)' }}>
                      {visite.client?.nom?.charAt(0)?.toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{visite.client?.nom}</p>
                      <p className="text-xs text-gray-400">{visite.client?.ville}</p>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-1 text-sm text-gray-700">
                      <Calendar size={13} className="text-gray-400" /> {visite.date}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                      <Clock size={11} /> {visite.heure}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{visite.type_visite}</p>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: prioriteColor(visite.priorite) }}></div>
                    <span className="text-sm text-gray-600">{visite.priorite}</span>
                  </div>
                  <span className="text-xs px-3 py-1 rounded-full font-medium"
                    style={{ backgroundColor: sc.bg, color: sc.color }}>
                    {visite.statut}
                  </span>
                  <div className="flex items-center gap-1 flex-wrap">
                    {!modeArchive && (
                      <>
                        {visite.statut !== 'Réalisée' && (
                          <button onClick={() => handleStatut(visite, 'Réalisée')}
                            className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium hover:opacity-80"
                            style={{ backgroundColor: '#E6FFFA', color: '#2C7A7B' }}>
                            <CheckCircle size={11} /> Réalisée
                          </button>
                        )}
                        {visite.statut !== 'En attente' && (
                          <button onClick={() => handleStatut(visite, 'En attente')}
                            className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium hover:opacity-80"
                            style={{ backgroundColor: '#FFFAF0', color: '#C05621' }}>
                            <RotateCcw size={11} /> Reporter
                          </button>
                        )}
                        {visite.statut !== 'Annulée' && (
                          <button onClick={() => handleStatut(visite, 'Annulée')}
                            className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium hover:opacity-80"
                            style={{ backgroundColor: '#FFF5F5', color: '#C53030' }}>
                            <XCircle size={11} /> Annuler
                          </button>
                        )}
                      </>
                    )}
                    <button onClick={() => navigate(`/visites/${visite.id}`)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: '#EBF8FF', color: '#2B6CB0' }}>
                      <Eye size={13} />
                    </button>
                    {!modeArchive && (
                      <button onClick={() => { setVisiteSelected({ ...visite, client_id: visite.client?.id }); setShowEdit(true); }}
                        className="w-7 h-7 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: '#E6FFFA', color: '#2C7A7B' }}>
                        <Edit2 size={13} />
                      </button>
                    )}
                    <button onClick={() => handleSupprimer(visite.id)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: '#FFF5F5', color: '#C53030' }}>
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {showForm && (
        <FormVisite data={form} setData={setForm} onSubmit={handleSubmit}
          title="Nouvelle visite" onClose={() => setShowForm(false)}
          loading={loading} clients={clients} />
      )}

      {showEdit && visiteSelected && (
        <FormVisite data={visiteSelected} setData={setVisiteSelected} onSubmit={handleModifier}
          title="Modifier la visite" onClose={() => setShowEdit(false)}
          loading={loading} clients={clients} />
      )}
    </div>
  );
}