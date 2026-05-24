import { useState } from 'react';
import { User, Lock, Building2, Save } from 'lucide-react';
import api from '../services/api';
import Sidebar from '../components/Sidebar';

export default function Parametres() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [profil, setProfil] = useState({ name: user.name || '', email: user.email || '' });
  const [motDePasse, setMotDePasse] = useState({ nouveau: '', confirmer: '' });
  const [entreprise, setEntreprise] = useState(() => {
    const saved = localStorage.getItem('entreprise');
    return saved ? JSON.parse(saved) : { nom: 'Relais Medical', telephone: '', adresse: '' };
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const showSuccess = (msg) => { setSuccess(msg); setTimeout(() => setSuccess(''), 3000); };
  const showError = (msg) => { setError(msg); setTimeout(() => setError(''), 3000); };

  const handleProfil = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/users/${user.id}`, profil);
      localStorage.setItem('user', JSON.stringify({ ...user, ...profil }));
      showSuccess('Profil mis à jour !');
    } catch { showError('Erreur lors de la mise à jour'); }
  };

  const handleMotDePasse = async (e) => {
    e.preventDefault();
    if (motDePasse.nouveau !== motDePasse.confirmer) { showError('Les mots de passe ne correspondent pas !'); return; }
    if (motDePasse.nouveau.length < 6) { showError('Mot de passe trop court (min 6 caractères)'); return; }
    try {
      await api.put(`/users/${user.id}`, { password: motDePasse.nouveau });
      setMotDePasse({ nouveau: '', confirmer: '' });
      showSuccess('Mot de passe modifié !');
    } catch { showError('Erreur lors du changement'); }
  };

  const handleEntreprise = (e) => {
    e.preventDefault();
    localStorage.setItem('entreprise', JSON.stringify(entreprise));
    showSuccess('Informations entreprise sauvegardées !');
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#F7F9FC' }}>
      <Sidebar />
      <div className="flex-1 p-8 overflow-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold" style={{ color: '#1B4F6B' }}>Paramètres</h1>
          <p className="text-sm text-gray-400 mt-1">Gérer votre compte et préférences</p>
        </div>

        {success && <div className="mb-4 px-4 py-3 rounded-xl text-sm text-white" style={{ backgroundColor: '#2EC4C4' }}>✓ {success}</div>}
        {error && <div className="mb-4 px-4 py-3 rounded-xl text-sm text-white" style={{ backgroundColor: '#C53030' }}>✕ {error}</div>}

        <div className="grid grid-cols-2 gap-6">

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#E6FFFA' }}>
                <User size={20} color="#2C7A7B" />
              </div>
              <h2 className="text-sm font-bold" style={{ color: '#1B4F6B' }}>Mon profil</h2>
            </div>
            <form onSubmit={handleProfil} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1.5">Nom complet</label>
                <input value={profil.name} onChange={e => setProfil({ ...profil, name: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-teal-400" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1.5">Email</label>
                <input type="email" value={profil.email} onChange={e => setProfil({ ...profil, email: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-teal-400" />
              </div>
              <button type="submit"
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-white text-sm font-semibold"
                style={{ background: 'linear-gradient(135deg, #2EC4C4, #1B9999)' }}>
                <Save size={15} /> Sauvegarder
              </button>
            </form>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#EBF8FF' }}>
                <Lock size={20} color="#2B6CB0" />
              </div>
              <h2 className="text-sm font-bold" style={{ color: '#1B4F6B' }}>Changer mot de passe</h2>
            </div>
            <form onSubmit={handleMotDePasse} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1.5">Nouveau mot de passe</label>
                <input type="password" value={motDePasse.nouveau} onChange={e => setMotDePasse({ ...motDePasse, nouveau: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-teal-400" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1.5">Confirmer mot de passe</label>
                <input type="password" value={motDePasse.confirmer} onChange={e => setMotDePasse({ ...motDePasse, confirmer: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-teal-400" />
              </div>
              <button type="submit"
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-white text-sm font-semibold"
                style={{ background: 'linear-gradient(135deg, #1B4F6B, #0D3347)' }}>
                <Lock size={15} /> Modifier
              </button>
            </form>
          </div>

          <div className="col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#FAF5FF' }}>
                <Building2 size={20} color="#6B46C1" />
              </div>
              <h2 className="text-sm font-bold" style={{ color: '#1B4F6B' }}>Informations entreprise</h2>
            </div>
            <form onSubmit={handleEntreprise}>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 block mb-1.5">Nom entreprise</label>
                  <input value={entreprise.nom} onChange={e => setEntreprise({ ...entreprise, nom: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-teal-400" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 block mb-1.5">Téléphone</label>
                  <input value={entreprise.telephone} onChange={e => setEntreprise({ ...entreprise, telephone: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-teal-400"
                    placeholder="+212 6XX XXX XXX" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 block mb-1.5">Adresse</label>
                  <input value={entreprise.adresse} onChange={e => setEntreprise({ ...entreprise, adresse: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-teal-400"
                    placeholder="Casablanca, Maroc" />
                </div>
              </div>
              <button type="submit"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold"
                style={{ background: 'linear-gradient(135deg, #6B46C1, #553C9A)' }}>
                <Save size={15} /> Enregistrer
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}