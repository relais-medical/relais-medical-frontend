import { useState, useEffect } from 'react';
import { Mail, Send, CheckSquare, Square } from 'lucide-react';
import api from '../services/api';
import Sidebar from '../components/Sidebar';

export default function Notifications() {
  const [clients, setClients] = useState([]);
  const [selectionnes, setSelectionnes] = useState([]);
  const [sujet, setSujet] = useState('');
  const [message, setMessage] = useState('');
  const [tousSelectionnes, setTousSelectionnes] = useState(false);

  useEffect(() => {
    api.get('/clients').then(res => {
      setClients(res.data.filter(c => c.email));
    }).catch(() => {});
  }, []);

  const toggleClient = (id) => {
    setSelectionnes(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleTous = () => {
    if (tousSelectionnes) { setSelectionnes([]); setTousSelectionnes(false); }
    else { setSelectionnes(clients.map(c => c.id)); setTousSelectionnes(true); }
  };

  const handleEnvoyer = () => {
    if (!sujet || !message) { alert('Remplir sujet et message !'); return; }
    if (selectionnes.length === 0) { alert('Selectionner un client !'); return; }
    const emails = clients.filter(c => selectionnes.includes(c.id)).map(c => c.email).join(',');
    const gmailUrl = `https://mail.google.com/mail/?view=cm&to=${encodeURIComponent(emails)}&su=${encodeURIComponent(sujet)}&body=${encodeURIComponent(message)}`;
    window.open(gmailUrl, '_blank');
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#F7F9FC' }}>
      <Sidebar />
      <div className="flex-1 p-8 overflow-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold" style={{ color: '#1B4F6B' }}>Notifications clients</h1>
          <p className="text-sm text-gray-400 mt-1">Informer vos clients par email</p>
        </div>
        <div className="grid grid-cols-5 gap-6">
          <div className="col-span-3">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
              <h2 className="text-sm font-bold" style={{ color: '#1B4F6B' }}>Composer le message</h2>
              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1.5">Sujet *</label>
                <input value={sujet} onChange={e => setSujet(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none"
                  placeholder="Nouveau equipement disponible" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1.5">Message *</label>
                <textarea value={message} onChange={e => setMessage(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none"
                  rows={8} placeholder="Bonjour, nous avons le plaisir..." />
              </div>
              <div className="p-3 rounded-xl text-xs" style={{ backgroundColor: '#EBF8FF', color: '#2B6CB0' }}>
                Le message s ouvrira dans Gmail avec les destinataires deja remplis.
              </div>
              <button onClick={handleEnvoyer}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white text-sm font-semibold"
                style={{ background: 'linear-gradient(135deg, #2EC4C4, #1B9999)' }}>
                <Send size={16} />
                Ouvrir dans Gmail ({selectionnes.length} destinataire{selectionnes.length !== 1 ? 's' : ''})
              </button>
            </div>
          </div>
          <div className="col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold" style={{ color: '#1B4F6B' }}>Destinataires ({selectionnes.length}/{clients.length})</h2>
                <button onClick={toggleTous} className="flex items-center gap-1 text-xs font-medium" style={{ color: '#2EC4C4' }}>
                  {tousSelectionnes ? <CheckSquare size={14} /> : <Square size={14} />}
                  {tousSelectionnes ? 'Deselectionner' : 'Tout selectionner'}
                </button>
              </div>
              {clients.length === 0 ? (
                <div className="text-center py-8">
                  <Mail size={32} className="mx-auto mb-2 text-gray-200" />
                  <p className="text-sm text-gray-400">Aucun client avec email</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {clients.map((c, i) => (
                    <div key={i} onClick={() => toggleClient(c.id)}
                      className="flex items-center gap-3 p-3 rounded-xl cursor-pointer"
                      style={{ backgroundColor: selectionnes.includes(c.id) ? '#E6FFFA' : 'transparent', border: selectionnes.includes(c.id) ? '1px solid #2EC4C4' : '1px solid transparent' }}>
                      <div className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: selectionnes.includes(c.id) ? '#2EC4C4' : '#F7F9FC', border: selectionnes.includes(c.id) ? 'none' : '1px solid #D1D5DB' }}>
                        {selectionnes.includes(c.id) && <span className="text-white text-xs">v</span>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate">{c.nom}</p>
                        <p className="text-xs text-gray-400 truncate">{c.email}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
