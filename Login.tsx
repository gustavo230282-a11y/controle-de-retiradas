import React, { useState } from 'react';
import { supabase } from '../services/supaClient';
import { LogIn, Box } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      // Auth state change will be picked up by App.tsx
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-600 to-blue-800">
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl p-8 animate-fade-in-up">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-primary text-white p-4 rounded-full mb-4 shadow-lg">
            <Box size={40} />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Controle de Retirada</h1>
          <p className="text-gray-500 text-sm mt-1">Acesso Restrito via Supabase</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-3 rounded-lg font-bold shadow-md hover:bg-blue-700 transition-colors flex justify-center items-center gap-2"
          >
            {loading ? 'Entrando...' : <><LogIn size={20} /> Entrar</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
