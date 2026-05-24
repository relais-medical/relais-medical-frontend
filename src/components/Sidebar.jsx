import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../assets/logo.jpg';
import { LayoutDashboard, CalendarCheck, Building2, ClipboardList, BarChart3, FileText, Users, Bell, Settings } from 'lucide-react';

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const menu = [
    { path: '/dashboard', icon: <LayoutDashboard size={18} />, label: 'Tableau de bord' },
    { path: '/clients', icon: <Building2 size={18} />, label: 'Clients' },
    { path: '/visites', icon: <CalendarCheck size={18} />, label: 'Visites' },
    { path: '/offres', icon: <ClipboardList size={18} />, label: 'Offres' },
    { path: '/rapports', icon: <FileText size={18} />, label: 'Rapports & Planning' },
    { path: '/performance', icon: <BarChart3 size={18} />, label: 'Performance' },
    { path: '/bons-commande', icon: <ClipboardList size={18} />, label: 'Bons de commande' },
    { path: '/commerciaux', icon: <Users size={18} />, label: 'Commerciaux' },
    { path: '/notifications', icon: <Bell size={18} />, label: 'Notifications' },
    { path: '/parametres', icon: <Settings size={18} />, label: 'Paramètres' },
  ];

  return (
    <div className="w-64 min-h-screen flex flex-col shadow-xl" style={{ background: 'linear-gradient(180deg, #1B4F6B 0%, #0D3347 100%)' }}>

      <div className="bg-white p-4 flex items-center justify-center">
        <img src={logo} alt="Relais Médical" className="h-12 w-auto object-contain" />
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menu.map((item) => {
          const active = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-200"
              style={{
                backgroundColor: active ? '#2EC4C4' : 'transparent',
                color: active ? 'white' : 'rgba(255,255,255,0.6)',
                fontWeight: active ? '600' : '400',
              }}>
              {item.icon}
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #2EC4C4, #1B9999)' }}>
            {user.name?.charAt(0)?.toUpperCase()}
          </div>
          <div>
            <p className="text-white text-sm font-semibold">{user.name}</p>
            <p className="text-xs" style={{ color: '#2EC4C4' }}>Commercial</p>
          </div>
        </div>
        <button onClick={logout}
          className="w-full text-xs py-2 rounded-lg text-center"
          style={{ color: 'rgba(255,255,255,0.4)' }}>
          Se déconnecter
        </button>
      </div>
    </div>
  );
}