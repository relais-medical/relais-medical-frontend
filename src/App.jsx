import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import ClientDetail from './pages/ClientDetail';
import Visites from './pages/Visites';
import VisiteDetail from './pages/VisiteDetail';
import Rapports from './pages/Rapports';
import Offres from './pages/Offres';
import Performance from './pages/Performance';
import BonsCommande from './pages/BonsCommande';
import Commerciaux from './pages/Commerciaux';
import Notifications from './pages/Notifications';
import Parametres from './pages/Parametres';
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/clients" element={<Clients />} />
        <Route path="/clients/:id" element={<ClientDetail />} />
        <Route path="/visites" element={<Visites />} />
        <Route path="/visites/:id" element={<VisiteDetail />} />
        <Route path="/rapports" element={<Rapports />} />
        <Route path="/offres" element={<Offres />} />
        <Route path="/performance" element={<Performance />} />
        <Route path="/bons-commande" element={<BonsCommande />} />
        <Route path="/commerciaux" element={<Commerciaux />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/parametres" element={<Parametres />} />
      
      </Routes>
    </BrowserRouter>
  );
}