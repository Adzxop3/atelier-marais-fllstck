import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast'; 

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? '/api/login' : '/api/register';
    
    const loadingToast = toast.loading('Chargement...');

    try {
      const res = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      
      toast.dismiss(loadingToast);

      if (!res.ok) throw new Error(data.message);

      if (isLogin) {
        login(data.user, data.token);
        toast.success(`BIENVENUE ${data.user.username.toUpperCase()}`);
        navigate('/'); 
      } else {
        setIsLogin(true);
        toast.success("COMPTE CRÉÉ. CONNECTEZ-VOUS.");
      }
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error(err.message.toUpperCase()); 
    }
  };

  return (
    <div className="min-h-screen pt-24 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-black uppercase tracking-tighter">
            {isLogin ? 'Connexion' : 'Créer un compte'}
          </h2>
          <p className="mt-2 text-xs text-gray-500 uppercase tracking-widest">
            {isLogin ? 'Bon retour parmi nous' : 'Rejoignez L\'Atelier'}
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {!isLogin && (
              <input
                type="text"
                placeholder="NOM D'UTILISATEUR"
                required
                className="w-full border border-gray-300 p-3 text-sm focus:border-black outline-none font-bold uppercase placeholder:font-normal"
                value={formData.username}
                onChange={e => setFormData({...formData, username: e.target.value})}
              />
            )}
            <input
              type="email"
              placeholder="EMAIL"
              required
              className="w-full border border-gray-300 p-3 text-sm focus:border-black outline-none font-bold placeholder:font-normal"
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
            />
            <input
              type="password"
              placeholder="MOT DE PASSE"
              required
              className="w-full border border-gray-300 p-3 text-sm focus:border-black outline-none font-bold placeholder:font-normal"
              value={formData.password}
              onChange={e => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-4 text-xs font-bold uppercase tracking-widest hover:bg-gray-900 transition-colors"
          >
            {isLogin ? 'Se connecter' : "S'inscrire"}
          </button>
        </form>

        <div className="text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-xs text-gray-500 underline uppercase tracking-widest hover:text-black transition-colors"
          >
            {isLogin ? "Pas encore de compte ? S'inscrire" : "Déjà un compte ? Se connecter"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;