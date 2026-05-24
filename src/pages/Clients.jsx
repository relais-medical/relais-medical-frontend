import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Search, Plus, Building2, Phone, Mail, Trash2, User } from 'lucide-react';
import api from '../services/api';
import Sidebar from '../components/Sidebar';

export default function Clients() {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [users, setUsers] = useState([]);
  const [filtre, setFiltre] = useState('Tous');
  const [recherche, setRecherche] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    nom: '', ville: '', email: '', secteur: '', type: 'Prospect', notes: '', user_id: ''
  });
  const [contacts, setContacts] = useState([
    { nom: '', poste: '', telephone: '', email: '' }
  ]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    api.get('/clients').then(res => setClients(res.data));
    api.get('/users').then(res => setUsers(res.data)).catch(() => {});
  }, []);

  const clientsFiltres = clients.filter(c => {
    const matchFiltre = filtre === 'Tous' || c.type === filtre;
    const matchRecherche = c.nom.toLowerCase().includes(recherche.toLowerCase());
    return matchFiltre && matchRecherche;
  });

  const addContact = () => {
    setContacts([...contacts, { nom: '', poste: '', telephone: '', email: '' }]);
  };

  const removeContact = (index) => {
    setContacts(contacts.filter((_, i) => i !== index));
  };

  const updateContact = (index, field, value) => {
    const updated = [...contacts];
    updated[index][field] = value;
    setContacts(updated);
  };

  const resetForm = () => {
    setForm({ nom: '', ville: '', email: '', secteur: '', type: 'Prospect', notes: '', user_id: '' });
    setContacts([{ nom: '', poste: '', telephone: '', email: '' }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 1. Créer le client
      const res = await api.post('/clients', form);
      const clientId = res.data.id;

      // 2. Ajouter les contacts
      const contactsValides = contacts.filter(c => c.nom.trim() !== '');
      for (const contact of contactsValides) {
        await api.post('/contacts', { ...contact, client_id: clientId });
      }

      setClients([...clients, res.data]);
      setShowForm(false);
      resetForm();
      setSuccess('Client ajouté avec succès !');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#F7F9FC' }}>
      <Sidebar />

      <div className="flex-1 p-8 overflow-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: '#1B4F6B' }}>Clients & Prospects</h1>
            <p className="text-sm text-gray-400 mt-1">{clients.length} clients enregistrés</p>
          </div>
          <button onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold shadow-md hover:opacity-90 transition"
            style={{ background: 'linear-gradient(135deg, #2EC4C4, #1B9999)' }}>
            <Plus size={16} />
            Nouveau client
          </button>
        </div>

        {success && (
          <div className="mb-4 px-4 py-3 rounded-xl text-sm text-white flex items-center gap-2" style={{ backgroundColor: '#2EC4C4' }}>
            ✓ {success}
          </div>
        )}

        {/* Recherche + Filtres */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex gap-4 items-center">
            <div className="flex-1 flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-2.5">
              <Search size={16} className="text-gray-400" />
              <input type="text" placeholder="Rechercher un client..."
                value={recherche} onChange={e => setRecherche(e.target.value)}
                className="flex-1 text-sm outline-none text-gray-700" />
            </div>
            <div className="flex gap-2">
              {['Tous', 'Client', 'Prospect'].map(f => (
                <button key={f} onClick={() => setFiltre(f)}
                  className="px-4 py-2 rounded-xl text-sm font-medium transition"
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

        {/* Liste */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-5 px-6 py-3 border-b border-gray-100 bg-gray-50">
            <p className="text-xs font-semibold text-gray-400 col-span-2">CLIENT</p>
            <p className="text-xs font-semibold text-gray-400">SECTEUR</p>
            <p className="text-xs font-semibold text-gray-400">CONTACT</p>
            <p className="text-xs font-semibold text-gray-400">TYPE</p>
          </div>

          {clientsFiltres.length === 0 ? (
            <div className="p-12 text-center">
              <Building2 size={40} className="mx-auto mb-3 text-gray-200" />
              <p className="text-gray-400 text-sm">Aucun client trouvé</p>
              <button onClick={() => setShowForm(true)}
                className="mt-3 text-sm font-medium" style={{ color: '#2EC4C4' }}>
                + Ajouter un client
              </button>
            </div>
          ) : (
            clientsFiltres.map((client, i) => (
              <div key={i} onClick={() => navigate(`/clients/${client.id}`)}
                className="grid grid-cols-5 px-6 py-4 border-b border-gray-50 last:border-0 hover:bg-gray-50 cursor-pointer transition items-center">
                <div className="col-span-2 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #2EC4C4, #1B9999)' }}>
                    {client.nom?.charAt(0)?.toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{client.nom}</p>
                    <p className="text-xs text-gray-400">{client.ville}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">{client.secteur || '—'}</p>
                </div>
                <div className="space-y-1">
                  {client.telephone && (
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Phone size={11} /> {client.telephone}
                    </div>
                  )}
                  {client.email && (
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Mail size={11} /> {client.email}
                    </div>
                  )}
                </div>
                <div>
                  <span className="text-xs px-3 py-1 rounded-full font-medium"
                    style={{
                      backgroundColor: client.type === 'Client' ? '#E6FFFA' : '#FFFAF0',
                      color: client.type === 'Client' ? '#2C7A7B' : '#C05621'
                    }}>
                    {client.type}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal Nouveau Client */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

            {/* Header modal */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold" style={{ color: '#1B4F6B' }}>Nouveau client</h2>
              <button onClick={() => { setShowForm(false); resetForm(); }}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200">
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">

              {/* Infos générales */}
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Informations générales</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-500 block mb-1.5">Nom *</label>
                    <input required value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-teal-400 transition"
                      placeholder="Clinique Al Irfane" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 block mb-1.5">Ville</label>
                    <input value={form.ville} onChange={e => setForm({ ...form, ville: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-teal-400 transition"
                      placeholder="Casablanca" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 block mb-1.5">Email</label>
                    <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-teal-400 transition"
                      placeholder="contact@exemple.com" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 block mb-1.5">Secteur</label>
                    <input value={form.secteur} onChange={e => setForm({ ...form, secteur: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-teal-400 transition"
                      placeholder="Clinique privée" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 block mb-1.5">Type</label>
                    <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-teal-400 transition">
                      <option value="Prospect">Prospect</option>
                      <option value="Client">Client</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 block mb-1.5">Chargé de compte</label>
                    <select value={form.user_id} onChange={e => setForm({ ...form, user_id: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-teal-400 transition">
                      <option value="">— Sélectionner un commercial —</option>
                      {users.map(u => (
                        <option key={u.id} value={u.id}>{u.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="mt-4">
                  <label className="text-xs font-semibold text-gray-500 block mb-1.5">Notes</label>
                  <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-teal-400 transition"
                    rows={2} placeholder="Notes sur le client..." />
                </div>
              </div>

              {/* Contacts */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Contacts</p>
                  <button type="button" onClick={addContact}
                    className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg text-white"
                    style={{ background: 'linear-gradient(135deg, #2EC4C4, #1B9999)' }}>
                    <Plus size={12} /> Ajouter un contact
                  </button>
                </div>

                <div className="space-y-3">
                  {contacts.map((contact, index) => (
                    <div key={index} className="p-4 rounded-xl border border-gray-100" style={{ backgroundColor: '#F7F9FC' }}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                            style={{ background: 'linear-gradient(135deg, #2EC4C4, #1B9999)' }}>
                            {index + 1}
                          </div>
                          <span className="text-xs font-semibold text-gray-500">Contact {index + 1}</span>
                        </div>
                        {contacts.length > 1 && (
                          <button type="button" onClick={() => removeContact(index)}
                            className="w-6 h-6 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-50 transition">
                            <Trash2 size={12} />
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs text-gray-400 block mb-1">Nom *</label>
                          <input value={contact.nom}
                            onChange={e => updateContact(index, 'nom', e.target.value)}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-teal-400 transition bg-white"
                            placeholder="Dr. Ahmed" />
                        </div>
                        <div>
                          <label className="text-xs text-gray-400 block mb-1">Poste</label>
                          <input value={contact.poste}
                            onChange={e => updateContact(index, 'poste', e.target.value)}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-teal-400 transition bg-white"
                            placeholder="Directeur médical" />
                        </div>
                        <div>
                          <label className="text-xs text-gray-400 block mb-1">Téléphone</label>
                          <input value={contact.telephone}
                            onChange={e => updateContact(index, 'telephone', e.target.value)}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-teal-400 transition bg-white"
                            placeholder="06 XX XX XX XX" />
                        </div>
                        <div>
                          <label className="text-xs text-gray-400 block mb-1">Email</label>
                          <input value={contact.email}
                            onChange={e => updateContact(index, 'email', e.target.value)}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-teal-400 transition bg-white"
                            placeholder="ahmed@exemple.com" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Boutons */}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => { setShowForm(false); resetForm(); }}
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
    </div>
  );
}