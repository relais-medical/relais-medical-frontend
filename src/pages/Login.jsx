import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import logo from '../assets/logo.jpg';
import bgImage from '../assets/login-bg.webp';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/dashboard');
    } catch (err) {
      setError('Email ou mot de passe incorrect');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      backgroundImage: `url(${bgImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}>
      {/* Overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(135deg, rgba(27,79,107,0.80) 0%, rgba(46,196,196,0.50) 100%)',
      }} />

      {/* Carte */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        background: 'rgba(255,255,255,0.15)',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        border: '1px solid rgba(255,255,255,0.3)',
        borderRadius: '16px',
        padding: '32px',
        width: '100%',
        maxWidth: '380px',
        boxShadow: '0 8px 40px rgba(27,79,107,0.35)',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
          <img src={logo} alt="Relais Médical" style={{ height: '64px', objectFit: 'contain' }} />
        </div>

        <h1 style={{ color: 'white', textAlign: 'center', fontSize: '22px', fontWeight: 600, margin: '0 0 4px' }}>
          Bienvenue !
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.75)', textAlign: 'center', fontSize: '13px', margin: '0 0 24px' }}>
          Connectez-vous à votre compte
        </p>

        {error && (
          <div style={{
            background: 'rgba(220,38,38,0.2)',
            border: '1px solid rgba(255,255,255,0.3)',
            color: 'white',
            borderRadius: '8px',
            padding: '10px 14px',
            fontSize: '13px',
            marginBottom: '16px',
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ color: 'rgba(255,255,255,0.85)', fontSize: '13px', fontWeight: 500, display: 'block', marginBottom: '6px' }}>
              Email
            </label>
            <input
              type="email"
              placeholder="exemple@mail.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                background: 'rgba(255,255,255,0.2)',
                border: '1px solid rgba(255,255,255,0.35)',
                borderRadius: '10px',
                padding: '12px 14px',
                fontSize: '13px',
                color: 'white',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ color: 'rgba(255,255,255,0.85)', fontSize: '13px', fontWeight: 500, display: 'block', marginBottom: '6px' }}>
              Mot de passe
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                background: 'rgba(255,255,255,0.2)',
                border: '1px solid rgba(255,255,255,0.35)',
                borderRadius: '10px',
                padding: '12px 14px',
                fontSize: '13px',
                color: 'white',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'rgba(255,255,255,0.75)', cursor: 'pointer' }}>
              <input type="checkbox" />
              Se souvenir de moi
            </label>
            <a href="#" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.75)', textDecoration: 'none' }}>
              Mot de passe oublié ?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #1B4F6B, #2EC4C4)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              padding: '13px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(46,196,196,0.4)',
            }}
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '13px', color: 'rgba(255,255,255,0.6)', marginTop: '20px' }}>
  Pas encore de compte ?{' '}
  <a href="#" style={{ color: 'white', fontWeight: 500 }}>Contacter l'admin</a>
</p>

<div style={{
  marginTop: '16px',
  padding: '10px 14px',
  borderRadius: '10px',
  background: 'rgba(255,255,255,0.1)',
  border: '1px solid rgba(255,255,255,0.2)',
}}>
  <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '1px' }}>
    Compte
  </p>
  <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.85)', marginBottom: '2px' }}>
    📧 imane@relaismedical.ma
  </p>
  <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.85)' }}>
    🔑 123456
  </p>
</div>
      </div>
    </div>
  );
}