import { useState, useEffect } from 'react';
import { Plus, Trash2, User, Mail, Eye, Edit2, X, Target } from 'lucide-react';
import api from '../services/api';
import Sidebar from '../components/Sidebar';

export default function Commerciaux() {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(null);
  const [showEdit, setShowEdit] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState({ name: '', email: '', objectif: '' });
  const [editForm, setEditForm] = useState({ name: '', email: '', objectif: '' });

  useEffect(() => {
    api.get('/users').then(res => setUsers(res.data)).catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/users', form);
      setUsers([...users, res.data]);
      setShowForm(false);
      setForm({ name: '', email: '', objectif: '' });
      setSuccess('Commercial ajouté avec succès !');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put(`/users/${showEdit.id}`, editForm);
      const res = await api.get('/users');
      setUsers(res.data);
      setShowEdit(null);
      setSuccess('Commercial modifié !');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleSupprimer = async (id) => {
    if (window.confirm('Supprimer ce commercial ?')) {
      await api.delete(`/users/${id}`);
      setUsers(users.filter(u => u.id !== id));
    }
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#F7F9FC' }}>
      <Sidebar />
      <div className="flex-1 p-8 overflow-auto">

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: '#1B4F6B' }}>Commerciaux</h1>
            <p className="text-sm text-gray-400 mt-1">{users.length} commerciaux enregistrés</p>
          </div>
          <button onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold shadow-md"
            style={{ background: 'linear-gradient(135deg, #2EC4C4, #1B9999)' }}>
            <Plus size={16} /> Nouveau commercial
          </button>
        </div>

        {success && (
          <div className="mb-4 px-4 py-3 rounded-xl text-sm text-white" style={{ backgroundColor: '#2EC4C4' }}>
            ✓ {success}
          </div>
        )}

        <div className="grid grid-cols-3 gap-4">
          {users.map((u, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-bold"
                  style={{ background: 'linear-gradient(135deg, #2EC4C4, #1B9999)' }}>
                  {u.name?.charAt(0)?.toUpperCase()}
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setShowDetail(u)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: '#EBF8FF', color: '#2B6CB0' }}>
                    <Eye size={14} />
                  </button>
                  <button onClick={() => { setShowEdit(u); setEditForm({ name: u.name, email: u.email, objectif: u.objectif || '' }); }}
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: '#E6FFFA', color: '#2C7A7B' }}>
                    <Edit2 size={14} />
                  </button>
                  <button onClick={() => handleSupprimer(u.id)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: '#FFF5F5', color: '#C53030' }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <h3 className="text-sm font-bold text-gray-800 mb-1">{u.name}</h3>
              <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                <Mail size={11} />
                {u.email}
              </div>
              {u.objectif && (
                <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                  <Target size={11} />
                  {u.objectif}
                </div>
              )}
              <div className="mt-2">
                <span className="text-xs px-3 py-1 rounded-full font-medium"
                  style={{ backgroundColor: '#E6FFFA', color: '#2C7A7B' }}>
                  Commercial
                </span>
              </div>
            </div>
          ))}

          {users.length === 0 && (
            <div className="col-span-3 text-center py-16">
              <User size={40} className="mx-auto mb-3 text-gray-200" />
              <p className="text-gray-400 text-sm">Aucun commercial enregistré</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal Nouveau commercial */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold" style={{ color: '#1B4F6B' }}>Nouveau commercial</h2>
              <button onClick={() => setShowForm(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1.5">Nom complet *</label>
                <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-teal-400"
                  placeholder="Ex: Sara Benali" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1.5">Email *</label>
                <input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-teal-400"
                  placeholder="sara@relaismedical.ma" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1.5">Objectif mensuel</label>
                <input value={form.objectif} onChange={e => setForm({ ...form, objectif: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-teal-400"
                  placeholder="Ex: 10 visites, 5 offres..." />
              </div>
              <div className="p-3 rounded-xl text-xs" style={{ backgroundColor: '#EBF8FF', color: '#2B6CB0' }}>
                💡 Mot de passe par défaut : <strong>relais2026</strong>
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
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold" style={{ color: '#1B4F6B' }}>Détail commercial</h2>
              <button onClick={() => setShowDetail(null)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                <X size={16} />
              </button>
            </div>
            <div className="flex flex-col items-center mb-6">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-white text-3xl font-bold mb-3"
                style={{ background: 'linear-gradient(135deg, #2EC4C4, #1B9999)' }}>
                {showDetail.name?.charAt(0)?.toUpperCase()}
              </div>
              <h3 className="text-lg font-bold text-gray-800">{showDetail.name}</h3>
              <span className="text-xs px-3 py-1 rounded-full font-medium mt-2"
                style={{ backgroundColor: '#E6FFFA', color: '#2C7A7B' }}>
                Commercial
              </span>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between p-3 rounded-xl" style={{ backgroundColor: '#F7F9FC' }}>
                <p className="text-xs text-gray-400">Nom complet</p>
                <p className="text-sm font-semibold text-gray-800">{showDetail.name}</p>
              </div>
              <div className="flex justify-between p-3 rounded-xl" style={{ backgroundColor: '#F7F9FC' }}>
                <p className="text-xs text-gray-400">Email</p>
                <p className="text-sm font-semibold text-gray-800">{showDetail.email}</p>
              </div>
              {showDetail.objectif && (
                <div className="flex justify-between p-3 rounded-xl" style={{ backgroundColor: '#F7F9FC' }}>
                  <p className="text-xs text-gray-400">Objectif mensuel</p>
                  <p className="text-sm font-semibold text-gray-800">{showDetail.objectif}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal Éditer */}
      {showEdit && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold" style={{ color: '#1B4F6B' }}>Modifier commercial</h2>
              <button onClick={() => setShowEdit(null)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleEdit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1.5">Nom complet *</label>
                <input required value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-teal-400" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1.5">Email *</label>
                <input required type="email" value={editForm.email} onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-teal-400" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1.5">Objectif mensuel</label>
                <input value={editForm.objectif} onChange={e => setEditForm({ ...editForm, objectif: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-teal-400"
                  placeholder="Ex: 10 visites, 5 offres..." />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowEdit(null)}
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
    </div>
  );
}