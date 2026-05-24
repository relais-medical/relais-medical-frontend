import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowLeft, Phone, Mail, MapPin, Edit2, X, Trash2, Plus, User } from 'lucide-react';
import api from '../services/api';
import Sidebar from '../components/Sidebar';

export default function ClientDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [client, setClient] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [showAddContact, setShowAddContact] = useState(false);
  const [form, setForm] = useState({});
  const [users, setUsers] = useState([]);
  const [contactForm, setContactForm] = useState({ nom: '', poste: '', telephone: '', email: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    api.get(`/clients/${id}`).then(res => {
      setClient(res.data);
      setForm(res.data);
    });
    api.get('/users').then(res => setUsers(res.data)).catch(() => {});
  }, [id]);

  const handleModifier = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.put(`/clients/${id}`, form);
      setClient(res.data);
      setShowEdit(false);
      setSuccess('Client modifié avec succès !');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleSupprimer = async () => {
    if (window.confirm('Voulez-vous vraiment supprimer ce client ?')) {
      await api.delete(`/clients/${id}`);
      navigate('/clients');
    }
  };

  const handleAddContact = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/contacts', { ...contactForm, client_id: id });
      setClient({ ...client, contacts: [...(client.contacts || []), res.data] });
      setContactForm({ nom: '', poste: '', telephone: '', email: '' });
      setShowAddContact(false);
      setSuccess('Contact ajouté !');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) { console.error(err); }
  };

  const handleDeleteContact = async (contactId) => {
    if (!window.confirm('Supprimer ce contact ?')) return;
    await api.delete(`/contacts/${contactId}`);
    setClient({ ...client, contacts: client.contacts.filter(c => c.id !== contactId) });
  };

  if (!client) return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F7F9FC' }}>
      <div className="flex items-center gap-3 text-gray-400">
        <div className="w-5 h-5 border-2 border-teal-400 border-t-transparent rounded-full animate-spin"></div>
        Chargement...
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#F7F9FC' }}>
      <Sidebar />
      <div className="flex-1 p-8 overflow-auto">

        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate('/clients')}
            className="w-9 h-9 rounded-xl border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:bg-gray-50 transition">
            <ArrowLeft size={18} />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold" style={{ color: '#1B4F6B' }}>Détail client</h1>
            <p className="text-sm text-gray-400 mt-0.5">{client.nom}</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={handleSupprimer}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red-200 text-red-500 text-sm font-medium hover:bg-red-50 transition">
              <Trash2 size={15} /> Supprimer
            </button>
            <button onClick={() => setShowEdit(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold shadow-md hover:opacity-90 transition"
              style={{ background: 'linear-gradient(135deg, #2EC4C4, #1B9999)' }}>
              <Edit2 size={15} /> Modifier
            </button>
          </div>
        </div>

        {success && (
          <div className="mb-6 px-4 py-3 rounded-xl text-sm text-white" style={{ backgroundColor: '#2EC4C4' }}>
            ✓ {success}
          </div>
        )}

        <div className="grid grid-cols-3 gap-6">

          {/* Colonne gauche */}
          <div className="col-span-1 space-y-4">

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-white text-3xl font-bold mb-4 mx-auto"
                style={{ background: 'linear-gradient(135deg, #2EC4C4, #1B9999)' }}>
                {client.nom?.charAt(0)?.toUpperCase()}
              </div>
              <h2 className="text-lg font-bold text-gray-900 mb-1">{client.nom}</h2>
              <p className="text-sm text-gray-400 mb-4">{client.secteur}</p>
              <span className="px-4 py-1.5 rounded-full text-sm font-medium"
                style={{
                  backgroundColor: client.type === 'Client' ? '#E6FFFA' : '#FFFAF0',
                  color: client.type === 'Client' ? '#2C7A7B' : '#C05621'
                }}>
                {client.type}
              </span>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-3">
              <h3 className="text-sm font-bold" style={{ color: '#1B4F6B' }}>Coordonnées</h3>
              {client.telephone && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#E6FFFA' }}>
                    <Phone size={14} style={{ color: '#2C7A7B' }} />
                  </div>
                  <span className="text-sm text-gray-700">{client.telephone}</span>
                </div>
              )}
              {client.email && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#EBF8FF' }}>
                    <Mail size={14} style={{ color: '#2B6CB0' }} />
                  </div>
                  <span className="text-sm text-gray-700">{client.email}</span>
                </div>
              )}
              {client.ville && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#FFFAF0' }}>
                    <MapPin size={14} style={{ color: '#C05621' }} />
                  </div>
                  <span className="text-sm text-gray-700">{client.ville}</span>
                </div>
              )}
            </div>

            {/* Chargé de contact */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-sm font-bold mb-3" style={{ color: '#1B4F6B' }}>Chargé de contact</h3>
              {client.commercial ? (
                <div className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: '#F7F9FC' }}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-bold"
                    style={{ background: 'linear-gradient(135deg, #1B4F6B, #2EC4C4)' }}>
                    {client.commercial.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{client.commercial.name}</p>
                    <p className="text-xs text-gray-400">{client.commercial.email}</p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-400">Non assigné</p>
              )}
            </div>
          </div>

          {/* Colonne droite */}
          <div className="col-span-2 space-y-4">

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-sm font-bold mb-4" style={{ color: '#1B4F6B' }}>Informations générales</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Type', value: client.type },
                  { label: 'Secteur', value: client.secteur },
                  { label: 'Ville', value: client.ville },
                  { label: 'CA généré', value: client.ca_genere ? `${client.ca_genere} DH` : '0.00 DH' },
                ].map((info, i) => (
                  <div key={i} className="p-4 rounded-xl" style={{ backgroundColor: '#F7F9FC' }}>
                    <p className="text-xs text-gray-400 mb-1">{info.label}</p>
                    <p className="text-sm font-semibold text-gray-800">{info.value || '—'}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Contacts */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold" style={{ color: '#1B4F6B' }}>
                  Contacts ({client.contacts?.length || 0})
                </h3>
                <button onClick={() => setShowAddContact(true)}
                  className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg text-white"
                  style={{ background: 'linear-gradient(135deg, #2EC4C4, #1B9999)' }}>
                  <Plus size={12} /> Ajouter
                </button>
              </div>
              {client.contacts && client.contacts.length > 0 ? (
                <div className="space-y-2">
                  {client.contacts.map((contact, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl" style={{ backgroundColor: '#F7F9FC' }}>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-bold"
                          style={{ background: 'linear-gradient(135deg, #2EC4C4, #1B9999)' }}>
                          {contact.nom?.charAt(0)?.toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-800">{contact.nom}</p>
                          <p className="text-xs text-gray-400">{contact.poste || '—'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        {contact.telephone && (
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Phone size={11} /> {contact.telephone}
                          </div>
                        )}
                        {contact.email && (
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Mail size={11} /> {contact.email}
                          </div>
                        )}
                        <button onClick={() => handleDeleteContact(contact.id)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-50 transition">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <User size={32} className="mx-auto mb-2 text-gray-200" />
                  <p className="text-sm text-gray-400">Aucun contact enregistré</p>
                </div>
              )}
            </div>

            {/* Visites */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold" style={{ color: '#1B4F6B' }}>Visites</h3>
                <button className="text-xs font-medium" style={{ color: '#2EC4C4' }}>+ Ajouter une visite</button>
              </div>
              {client.visites && client.visites.length > 0 ? (
                <div className="space-y-2">
                  {client.visites.map((v, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl" style={{ backgroundColor: '#F7F9FC' }}>
                      <span className="text-sm text-gray-700">{v.date}</span>
                      <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: '#E6FFFA', color: '#2C7A7B' }}>{v.statut}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400 text-center py-4">Aucune visite enregistrée</p>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* Modal Modifier */}
      {showEdit && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold" style={{ color: '#1B4F6B' }}>Modifier le client</h2>
              <button onClick={() => setShowEdit(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200">
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleModifier} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 block mb-1.5">Nom *</label>
                  <input required value={form.nom || ''} onChange={e => setForm({ ...form, nom: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-teal-400 transition" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 block mb-1.5">Ville</label>
                  <input value={form.ville || ''} onChange={e => setForm({ ...form, ville: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-teal-400 transition" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 block mb-1.5">Téléphone</label>
                  <input value={form.telephone || ''} onChange={e => setForm({ ...form, telephone: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-teal-400 transition" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 block mb-1.5">Email</label>
                  <input value={form.email || ''} onChange={e => setForm({ ...form, email: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-teal-400 transition" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 block mb-1.5">Secteur</label>
                  <input value={form.secteur || ''} onChange={e => setForm({ ...form, secteur: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-teal-400 transition" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 block mb-1.5">Type</label>
                  <select value={form.type || 'Prospect'} onChange={e => setForm({ ...form, type: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-teal-400 transition">
                    <option value="Prospect">Prospect</option>
                    <option value="Client">Client</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1.5">Chargé de contact</label>
                <select value={form.user_id || ''} onChange={e => setForm({ ...form, user_id: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-teal-400 transition">
                  <option value="">Non assigné</option>
                  {users.map(u => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1.5">Notes</label>
                <textarea value={form.notes || ''} onChange={e => setForm({ ...form, notes: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-teal-400 transition"
                  rows={3} />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowEdit(false)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50">
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

      {/* Modal Ajouter Contact */}
      {showAddContact && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold" style={{ color: '#1B4F6B' }}>Nouveau contact</h2>
              <button onClick={() => setShowAddContact(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200">
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleAddContact} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 block mb-1.5">Nom *</label>
                  <input required value={contactForm.nom}
                    onChange={e => setContactForm({ ...contactForm, nom: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-teal-400 transition"
                    placeholder="Dr. Ahmed" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 block mb-1.5">Poste</label>
                  <input value={contactForm.poste}
                    onChange={e => setContactForm({ ...contactForm, poste: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-teal-400 transition"
                    placeholder="Directeur médical" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 block mb-1.5">Téléphone</label>
                  <input value={contactForm.telephone}
                    onChange={e => setContactForm({ ...contactForm, telephone: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-teal-400 transition"
                    placeholder="06 XX XX XX XX" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 block mb-1.5">Email</label>
                  <input type="email" value={contactForm.email}
                    onChange={e => setContactForm({ ...contactForm, email: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-teal-400 transition"
                    placeholder="contact@exemple.com" />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowAddContact(false)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50">
                  Annuler
                </button>
                <button type="submit"
                  className="flex-1 py-2.5 rounded-xl text-white text-sm font-semibold"
                  style={{ background: 'linear-gradient(135deg, #2EC4C4, #1B9999)' }}>
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}