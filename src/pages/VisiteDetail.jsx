import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, Clock, Target, FileText, AlertCircle, CheckCircle, Edit2, Trash2 } from 'lucide-react';
import api from '../services/api';
import Sidebar from '../components/Sidebar';

export default function VisiteDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [visite, setVisite] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [clients, setClients] = useState([]);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    api.get(`/visites/${id}`).then(res => {
      setVisite(res.data);
      setForm(res.data);
    });
    api.get('/clients').then(res => setClients(res.data));
  }, [id]);

  const handleModifier = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.put(`/visites/${id}`, form);
      setVisite(res.data);
      setShowEdit(false);
      setSuccess('Visite modifiée avec succès !');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSupprimer = async () => {
    if (window.confirm('Voulez-vous vraiment supprimer cette visite ?')) {
      await api.delete(`/visites/${id}`);
      navigate('/visites');
    }
  };

  const statutColor = (statut) => {
    switch(statut) {
      case 'Réalisée': return { bg: '#E6FFFA', color: '#2C7A7B' };
      case 'Prévue': return { bg: '#EBF8FF', color: '#2B6CB0' };
      case 'En attente': return { bg: '#FFFAF0', color: '#C05621' };
      case 'Annulée': return { bg: '#FFF5F5', color: '#C53030' };
      default: return { bg: '#F7F9FC', color: '#6b7280' };
    }
  };

  const prioriteColor = (priorite) => {
    switch(priorite) {
      case 'Haute': return '#E53E3E';
      case 'Moyenne': return '#E8832A';
      case 'Basse': return '#38A169';
      default: return '#6b7280';
    }
  };

  if (!visite) return (
    <div className="min-h-screen flex items-center justify-center" style={{backgroundColor: '#F7F9FC'}}>
      <div className="flex items-center gap-3 text-gray-400">
        <div className="w-5 h-5 border-2 border-teal-400 border-t-transparent rounded-full animate-spin"></div>
        Chargement...
      </div>
    </div>
  );

  const sc = statutColor(visite.statut);

  return (
    <div className="min-h-screen flex" style={{backgroundColor: '#F7F9FC'}}>
      <Sidebar />

      <div className="flex-1 p-8 overflow-auto">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate('/visites')}
            className="w-9 h-9 rounded-xl border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:bg-gray-50 transition">
            <ArrowLeft size={18} />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold" style={{color: '#1B4F6B'}}>Détail visite</h1>
            <p className="text-sm text-gray-400 mt-0.5">{visite.client?.nom}</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={handleSupprimer}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red-200 text-red-500 text-sm font-medium hover:bg-red-50 transition">
              <Trash2 size={15} />
              Supprimer
            </button>
            <button onClick={() => setShowEdit(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold shadow-md hover:opacity-90 transition"
              style={{background: 'linear-gradient(135deg, #2EC4C4, #1B9999)'}}>
              <Edit2 size={15} />
              Modifier
            </button>
          </div>
        </div>

        {success && (
          <div className="mb-6 px-4 py-3 rounded-xl text-sm text-white" style={{backgroundColor: '#2EC4C4'}}>
            ✓ {success}
          </div>
        )}

        <div className="grid grid-cols-3 gap-6">

          {/* Carte visite */}
          <div className="col-span-1 space-y-4">

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-white text-3xl font-bold mb-4 mx-auto"
                style={{background: 'linear-gradient(135deg, #2EC4C4, #1B9999)'}}>
                {visite.client?.nom?.charAt(0)?.toUpperCase()}
              </div>
              <h2 className="text-lg font-bold text-gray-900 mb-1">{visite.client?.nom}</h2>
              <p className="text-sm text-gray-400 mb-4">{visite.client?.ville}</p>
              <span className="px-4 py-1.5 rounded-full text-sm font-medium"
                style={{backgroundColor: sc.bg, color: sc.color}}>
                {visite.statut}
              </span>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
              <h3 className="text-sm font-bold" style={{color: '#1B4F6B'}}>Informations</h3>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{backgroundColor: '#EBF8FF'}}>
                  <Calendar size={14} style={{color: '#2B6CB0'}} />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Date</p>
                  <p className="text-sm font-medium text-gray-800">{visite.date}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{backgroundColor: '#E6FFFA'}}>
                  <Clock size={14} style={{color: '#2C7A7B'}} />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Heure</p>
                  <p className="text-sm font-medium text-gray-800">{visite.heure}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{backgroundColor: '#FFFAF0'}}>
                  <AlertCircle size={14} style={{color: prioriteColor(visite.priorite)}} />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Priorité</p>
                  <p className="text-sm font-medium" style={{color: prioriteColor(visite.priorite)}}>{visite.priorite}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{backgroundColor: '#F0FFF4'}}>
                  <FileText size={14} style={{color: '#276749'}} />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Type de visite</p>
                  <p className="text-sm font-medium text-gray-800">{visite.type_visite}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Détails */}
          <div className="col-span-2 space-y-4">

            {visite.objectif && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Target size={16} style={{color: '#2EC4C4'}} />
                  <h3 className="text-sm font-bold" style={{color: '#1B4F6B'}}>Objectif</h3>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{visite.objectif}</p>
              </div>
            )}

            {visite.compte_rendu && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-2 mb-3">
                  <FileText size={16} style={{color: '#2EC4C4'}} />
                  <h3 className="text-sm font-bold" style={{color: '#1B4F6B'}}>Compte rendu</h3>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{visite.compte_rendu}</p>
              </div>
            )}

            {visite.prochaine_action && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle size={16} style={{color: '#2EC4C4'}} />
                  <h3 className="text-sm font-bold" style={{color: '#1B4F6B'}}>Prochaine action</h3>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{visite.prochaine_action}</p>
              </div>
            )}

            {!visite.objectif && !visite.compte_rendu && !visite.prochaine_action && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                <FileText size={40} className="mx-auto mb-3 text-gray-200" />
                <p className="text-gray-400 text-sm">Aucun détail enregistré</p>
                <button onClick={() => setShowEdit(true)}
                  className="mt-3 text-sm font-medium" style={{color: '#2EC4C4'}}>
                  + Ajouter des informations
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Modifier */}
      {showEdit && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 max-h-screen overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold" style={{color: '#1B4F6B'}}>Modifier la visite</h2>
              <button onClick={() => setShowEdit(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                ✕
              </button>
            </div>

            <form onSubmit={handleModifier} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1.5">Client</label>
                <select value={form.client_id || visite.client?.id} onChange={e => setForm({...form, client_id: e.target.value})}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-teal-400">
                  {clients.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 block mb-1.5">Date</label>
                  <input type="date" value={form.date || ''} onChange={e => setForm({...form, date: e.target.value})}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-teal-400" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 block mb-1.5">Heure</label>
                  <input type="time" value={form.heure || ''} onChange={e => setForm({...form, heure: e.target.value})}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-teal-400" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 block mb-1.5">Type</label>
                  <select value={form.type_visite || ''} onChange={e => setForm({...form, type_visite: e.target.value})}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-teal-400">
                    <option>Prospection</option>
                    <option>Suivi</option>
                    <option>Présentation</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 block mb-1.5">Priorité</label>
                  <select value={form.priorite || ''} onChange={e => setForm({...form, priorite: e.target.value})}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-teal-400">
                    <option>Haute</option>
                    <option>Moyenne</option>
                    <option>Basse</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1.5">Objectif</label>
                <textarea value={form.objectif || ''} onChange={e => setForm({...form, objectif: e.target.value})}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-teal-400"
                  rows={2} />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1.5">Compte rendu</label>
                <textarea value={form.compte_rendu || ''} onChange={e => setForm({...form, compte_rendu: e.target.value})}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-teal-400"
                  rows={2} />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1.5">Prochaine action</label>
                <input value={form.prochaine_action || ''} onChange={e => setForm({...form, prochaine_action: e.target.value})}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-teal-400" />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1.5">Statut</label>
                <select value={form.statut || ''} onChange={e => setForm({...form, statut: e.target.value})}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-teal-400">
                  <option>Prévue</option>
                  <option>Réalisée</option>
                  <option>En attente</option>
                  <option>Annulée</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowEdit(false)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50">
                  Annuler
                </button>
                <button type="submit" disabled={loading}
                  className="flex-1 py-2.5 rounded-xl text-white text-sm font-semibold disabled:opacity-50"
                  style={{background: 'linear-gradient(135deg, #2EC4C4, #1B9999)'}}>
                  {loading ? 'Enregistrement...' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}