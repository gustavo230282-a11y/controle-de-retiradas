import React, { useState } from 'react';
import { User, UserLevel } from './types';
import { AuthService } from './services/db';
import { UserPlus, Shield, Save } from 'lucide-react';
import Header from './Header';

interface Props {
  onBack: () => void;
}

const AdminPanel: React.FC<Props> = ({ onBack }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [level, setLevel] = useState<UserLevel>(UserLevel.OPERATOR);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) return;

    const newUser: User = {
      id: crypto.randomUUID(),
      name,
      email,
      passwordHash: password, // Storing plain for mock
      level
    };

    AuthService.createUser(newUser);
    alert('Usuário criado com sucesso!');
    setName('');
    setEmail('');
    setPassword('');
  };

  const users = AuthService.getAllUsers();

  return (
    <div className="bg-white rounded-lg shadow-md p-6 animate-fade-in">
      <Header
        variant="page"
        title="Administração"
        onBack={onBack}
        icon={<Shield className="text-primary" />}
      />

      <form onSubmit={handleSubmit} className="mb-8 bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">Cadastrar Novo Usuário</h3>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Nome"
            required
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full px-4 py-2 rounded border"
          />
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full px-4 py-2 rounded border"
          />
          <input
            type="password"
            placeholder="Senha"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full px-4 py-2 rounded border"
          />
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value as UserLevel)}
            className="w-full px-4 py-2 rounded border bg-white"
          >
            <option value={UserLevel.OPERATOR}>Operador</option>
            <option value={UserLevel.ADMIN}>Admin</option>
          </select>
          <button
            type="submit"
            className="w-full bg-success text-white py-2 rounded font-bold hover:bg-green-700 transition flex justify-center items-center gap-2"
          >
            <UserPlus size={20} /> Criar Usuário
          </button>
        </div>
      </form>

      <div>
        <h3 className="text-lg font-semibold mb-2 text-gray-700">Usuários Existentes</h3>
        <div className="space-y-2">
          {users.map(u => (
            <div key={u.id} className="flex justify-between items-center p-3 bg-white border rounded shadow-sm">
              <div>
                <p className="font-bold">{u.name}</p>
                <p className="text-sm text-gray-500">{u.email}</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded font-bold ${u.level === UserLevel.ADMIN ? 'bg-blue-100 text-blue-800' : 'bg-gray-200 text-gray-800'}`}>
                {u.level.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
