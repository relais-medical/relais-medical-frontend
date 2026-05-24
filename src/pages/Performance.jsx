import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { TrendingUp, Users, FileText, Calendar } from 'lucide-react';
import api from '../services/api';
import Sidebar from '../components/Sidebar';

export default function Performance() {
  const [annee, setAnnee] = useState(new Date().getFullYear());
  const [offres, setOffres] = useState([]);
  const [clients, setClients] = useState([]);
  const [visites, setVisites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/offres'),
      api.get('/clients'),
      api.get('/visites'),
    ]).then(([o, c, v]) => {
      setOffres(o.data);
      setClients(c.data);
      setVisites(v.data);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  // Filtrer par année
  const offresFiltrees = offres.filter(o => o.date && new Date(o.date).getFullYear() === parseInt(annee));
  const clientsFiltres = clients.filter(c => c.created_at && new Date(c.created_at).getFullYear() === parseInt(annee));
  const visitesFiltrees = visites.filter(v => v.date && new Date(v.date).getFullYear() === parseInt(annee));

  // Chiffre d'affaires par mois
  const mois = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
  const caParMois = mois.map((m, i) => ({
    mois: m,
    ca: offresFiltrees
      .filter(o => o.statut === 'Acceptée' && new Date(o.date).getMonth() === i)
      .reduce((acc, o) => acc + parseFloat(o.montant_total || 0), 0)
  }));

  // Statuts des offres pour le camembert
  const statutsOffres = [
    { name: 'En cours',   value: offresFiltrees.filter(o => o.statut === 'En cours').length,   color: '#2B6CB0' },
    { name: 'Validée',    value: offresFiltrees.filter(o => o.statut === 'Validée').length,    color: '#2EC4C4' },
    { name: 'Commandée',  value: offresFiltrees.filter(o => o.statut === 'Commandée').length,  color: '#276749' },
    { name: 'Transmise',  value: offresFiltrees.filter(o => o.statut === 'Transmise').length,  color: '#6B46C1' },
    { name: 'Refusée',    value: offresFiltrees.filter(o => o.statut === 'Refusée').length,    color: '#C53030' },
  ].filter(s => s.value > 0);

  const totalOffres = statutsOffres.reduce((acc, s) => acc + s.value, 0);

  // Clients actifs = clients qui ont au moins une visite cette année
  const clientsActifs = clients.filter(c =>
    visitesFiltrees.some(v => v.client_id === c.id)
  );

  // Total CA
  const totalCA = offresFiltrees
    .filter(o => o.statut === 'Acceptée')
    .reduce((acc, o) => acc + parseFloat(o.montant_total || 0), 0);

  const annees = [];
  for (let a = 2023; a <= new Date().getFullYear() + 1; a++) annees.push(a);

  if (loading) return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#F7F9FC' }}>
      <Sidebar />
      <div className="flex-1 flex items-center justify-center">
        <p className="text-gray-400">Chargement...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#F7F9FC' }}>
      <Sidebar />
      <div className="flex-1 p-8 overflow-auto">

        {/* En-tête */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: '#1B4F6B' }}>Performance</h1>
            <p className="text-sm text-gray-400 mt-1">Tableau de bord annuel</p>
          </div>
          <select value={annee} onChange={e => setAnnee(e.target.value)}
            className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none font-semibold"
            style={{ color: '#1B4F6B' }}>
            {annees.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: 'CA réalisé', value: `${totalCA.toLocaleString()} DH`, icon: <TrendingUp size={20} />, color: '#2EC4C4' },
            { label: 'Offres total', value: offresFiltrees.length, icon: <FileText size={20} />, color: '#1B4F6B' },
            { label: 'Nouveaux clients', value: clientsFiltres.length, icon: <Users size={20} />, color: '#F4A261' },
            { label: 'Visites', value: visitesFiltrees.length, icon: <Calendar size={20} />, color: '#FC5C65' },
          ].map((k, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
                  style={{ backgroundColor: k.color }}>
                  {k.icon}
                </div>
              </div>
              <p className="text-2xl font-bold" style={{ color: '#1B4F6B' }}>{k.value}</p>
              <p className="text-xs text-gray-400 mt-1">{k.label}</p>
            </div>
          ))}
        </div>

        {/* Graphiques */}
        <div className="grid grid-cols-2 gap-6 mb-6">

          {/* Chiffre d'affaires par mois */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-sm font-bold mb-4" style={{ color: '#1B4F6B' }}>
              Chiffre d'affaires par mois ({annee})
            </h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={caParMois}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="mois" tick={{ fontSize: 11, fill: '#9ca3af' }} />
                <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} />
                <Tooltip formatter={(v) => `${v.toLocaleString()} DH`} />
                <Bar dataKey="ca" fill="#2EC4C4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Statuts des offres */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-sm font-bold mb-4" style={{ color: '#1B4F6B' }}>
              Statuts des offres ({annee})
            </h2>
            {statutsOffres.length === 0 ? (
              <div className="flex items-center justify-center h-56 text-gray-300 text-sm">
                Aucune offre cette année
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={statutsOffres} cx="50%" cy="50%" outerRadius={90}
    dataKey="value"
    label={({ name, value }) => `${name} ${totalOffres > 0 ? Math.round(value/totalOffres*100) : 0}%`}
    labelLine={true}>
                    {statutsOffres.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Clients */}
        <div className="grid grid-cols-2 gap-6">

          {/* Nouveaux clients */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-sm font-bold mb-4" style={{ color: '#1B4F6B' }}>
              Nouveaux clients ({annee})
            </h2>
            {clientsFiltres.length === 0 ? (
              <p className="text-gray-300 text-sm text-center py-8">Aucun nouveau client cette année</p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {clientsFiltres.map((c, i) => (
                  <div key={i} className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                      style={{ background: 'linear-gradient(135deg, #2EC4C4, #1B9999)' }}>
                      {c.nom?.charAt(0)?.toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{c.nom}</p>
                      <p className="text-xs text-gray-400">{c.ville}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Clients actifs */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-sm font-bold mb-4" style={{ color: '#1B4F6B' }}>
              Clients actifs ({annee})
            </h2>
            {clientsActifs.length === 0 ? (
              <p className="text-gray-300 text-sm text-center py-8">Aucun client actif cette année</p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {clientsActifs.map((c, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded-xl hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                        style={{ background: 'linear-gradient(135deg, #1B4F6B, #0D3347)' }}>
                        {c.nom?.charAt(0)?.toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{c.nom}</p>
                        <p className="text-xs text-gray-400">{c.ville}</p>
                      </div>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full font-medium"
                      style={{ backgroundColor: '#E6FFFA', color: '#2C7A7B' }}>
                      Actif
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
