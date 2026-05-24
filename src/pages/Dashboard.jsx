import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { Calendar, CheckCircle, Users, Target, TrendingUp, FileText, Plus, Clock } from 'lucide-react';
import api from '../services/api';

export default function Dashboard() {
  const navigate = useNavigate();
  const [visites, setVisites] = useState([]);
  const [clients, setClients] = useState([]);
  const [offres, setOffres] = useState([]);
  const [rapports, setRapports] = useState([]);

  useEffect(() => {
    api.get('/visites').then(res => setVisites(res.data)).catch(() => {});
    api.get('/clients').then(res => setClients(res.data)).catch(() => {});
    api.get('/offres').then(res => setOffres(res.data)).catch(() => {});
    api.get('/rapports').then(res => setRapports(res.data)).catch(() => {});
  }, []);

  const visitesPrivues = visites.filter(v => v.statut === 'Prévue').length;
  const visitesRealisees = visites.filter(v => v.statut === 'Réalisée').length;
  const clientsActifs = clients.filter(c => c.type === 'Client').length;
  const prospects = clients.filter(c => c.type === 'Prospect').length;
  const offresEnCours = offres.filter(o => o.statut === 'En cours').length;
  const caTotal = offres.filter(o => o.statut === 'Validée' || o.statut === 'Commandée')
    .reduce((acc, o) => acc + parseFloat(o.montant_total || 0), 0);

  const stats = [
    { label: 'Visites prévues', value: visitesPrivues, icon: Calendar, bg: '#EBF8FF', color: '#2B6CB0' },
    { label: 'Visites réalisées', value: visitesRealisees, icon: CheckCircle, bg: '#F0FFF4', color: '#276749' },
    { label: 'Clients actifs', value: clientsActifs, icon: Users, bg: '#E6FFFA', color: '#2C7A7B' },
    { label: 'Prospects', value: prospects, icon: Target, bg: '#FFFAF0', color: '#C05621' },
    { label: "Chiffre d'affaires", value: caTotal > 0 ? `${(caTotal/1000).toFixed(0)}K DH` : '0 DH', icon: TrendingUp, bg: '#EBF8FF', color: '#2B6CB0' },
    { label: 'Offres en cours', value: offresEnCours, icon: FileText, bg: '#FAF5FF', color: '#553C9A' },
  ];

  // Dernières activités depuis rapports et visites
  const derniersRapports = rapports.slice(0, 2).map(r => ({
    title: `Rapport — ${r.client?.nom || '—'}`,
    sub: r.type_visite || 'Rapport ajouté',
    time: r.date,
    color: '#2EC4C4'
  }));

  const dernieresVisites = visites.slice(0, 2).map(v => ({
    title: `Visite — ${v.client?.nom || '—'}`,
    sub: v.statut,
    time: v.date,
    color: '#1B4F6B'
  }));

  const activites = [...derniersRapports, ...dernieresVisites].slice(0, 4);

  // Dernières offres réelles
  const dernièresOffres = offres.slice(0, 3);

  const statutOffreColor = (s) => {
    const map = {
      'En cours':  { color: '#E8832A', bg: '#FFF4E8' },
      'Validée':   { color: '#2EC4C4', bg: '#E6FFFA' },
      'Commandée': { color: '#276749', bg: '#F0FFF4' },
      'Transmise': { color: '#553C9A', bg: '#FAF5FF' },
      'Refusée':   { color: '#C53030', bg: '#FFF5F5' },
    };
    return map[s] || { color: '#6b7280', bg: '#F7F9FC' };
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#F7F9FC' }}>
      <Sidebar />

      <div className="flex-1 p-8 overflow-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: '#1B4F6B' }}>Tableau de bord</h1>
            <p className="text-sm text-gray-400 mt-1">
              {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
          <button onClick={() => navigate('/visites')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold shadow-md hover:opacity-90 transition"
            style={{ background: 'linear-gradient(135deg, #2EC4C4, #1B9999)' }}>
            <Plus size={16} />
            Nouvelle visite
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {stats.map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition cursor-pointer">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: s.bg }}>
                    <Icon size={20} color={s.color} />
                  </div>
                </div>
                <p className="text-2xl font-bold mb-1" style={{ color: '#1B4F6B' }}>{s.value}</p>
                <p className="text-xs text-gray-400">{s.label}</p>
              </div>
            );
          })}
        </div>

        {/* Bottom */}
        <div className="grid grid-cols-5 gap-4">

          {/* Activité récente */}
          <div className="col-span-3 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold" style={{ color: '#1B4F6B' }}>Activité récente</h2>
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <Clock size={12} />
                Récent
              </div>
            </div>
            {activites.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-6">Aucune activité récente</p>
            ) : (
              <div className="space-y-3">
                {activites.map((a, i) => (
                  <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition cursor-pointer">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: a.color }}></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">{a.title}</p>
                      <p className="text-xs text-gray-400">{a.sub}</p>
                    </div>
                    <span className="text-xs text-gray-400">{a.time}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Offres récentes */}
          <div className="col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold" style={{ color: '#1B4F6B' }}>Offres récentes</h2>
              <button onClick={() => navigate('/offres')} className="text-xs font-medium" style={{ color: '#2EC4C4' }}>
                Voir tout →
              </button>
            </div>
            {dernièresOffres.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-6">Aucune offre</p>
            ) : (
              <div className="space-y-3">
                {dernièresOffres.map((o, i) => {
                  const sc = statutOffreColor(o.statut);
                  return (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl" style={{ backgroundColor: '#F7F9FC' }}>
                      <div>
                        <p className="text-sm font-medium text-gray-800">{o.client?.nom}</p>
                        <p className="text-sm font-bold mt-0.5" style={{ color: '#1B4F6B' }}>
                          {Number(o.montant_total).toLocaleString()} DH
                        </p>
                      </div>
                      <span className="text-xs px-2.5 py-1 rounded-full font-medium"
                        style={{ backgroundColor: sc.bg, color: sc.color }}>
                        {o.statut}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}