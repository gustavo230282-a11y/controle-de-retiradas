import React from 'react';
import { PackagePlus, Search, Shield, FileBarChart } from 'lucide-react';
import Header from './Header';
import { User, UserLevel, ViewState } from '../types';

interface Props {
  user: User;
  onNavigate: (view: ViewState) => void;
  onLogout: () => void;
}

const Dashboard: React.FC<Props> = ({ user, onNavigate, onLogout }) => {
  return (
    <div className="flex flex-col h-full">
      <Header variant="dashboard" user={user} onLogout={onLogout} />

      <div className="flex-1 px-4 pb-6 space-y-4 overflow-y-auto">

        {/* Main Action: New Withdrawal */}
        <button
          onClick={() => onNavigate('new-withdrawal')}
          className="w-full bg-white p-6 rounded-2xl shadow-md border-l-8 border-primary hover:shadow-lg transition-all active:scale-95 flex items-center justify-between group"
        >
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-full text-primary group-hover:bg-primary group-hover:text-white transition-colors">
              <PackagePlus size={32} />
            </div>
            <div className="text-left">
              <h3 className="text-xl font-bold text-gray-800">Nova Retirada</h3>
              <p className="text-gray-500 text-sm">Registrar saída de material</p>
            </div>
          </div>
        </button>

        {/* Secondary Action: Consult */}
        <button
          onClick={() => onNavigate('list-withdrawals')}
          className="w-full bg-white p-6 rounded-2xl shadow-md border-l-8 border-secondary hover:shadow-lg transition-all active:scale-95 flex items-center justify-between group"
        >
          <div className="flex items-center gap-4">
            <div className="bg-gray-100 p-3 rounded-full text-gray-600 group-hover:bg-gray-600 group-hover:text-white transition-colors">
              <Search size={32} />
            </div>
            <div className="text-left">
              <h3 className="text-xl font-bold text-gray-800">Consultar</h3>
              <p className="text-gray-500 text-sm">Ver histórico e canhotos</p>
            </div>
          </div>
        </button>

        {/* New Action: Report */}
        <button
          onClick={() => onNavigate('report')}
          className="w-full bg-white p-6 rounded-2xl shadow-md border-l-8 border-success hover:shadow-lg transition-all active:scale-95 flex items-center justify-between group"
        >
          <div className="flex items-center gap-4">
            <div className="bg-green-100 p-3 rounded-full text-success group-hover:bg-success group-hover:text-white transition-colors">
              <FileBarChart size={32} />
            </div>
            <div className="text-left">
              <h3 className="text-xl font-bold text-gray-800">Relatório</h3>
              <p className="text-gray-500 text-sm">Gerar lista por período</p>
            </div>
          </div>
        </button>

        {/* Admin Action: Only if Admin */}
        {user.level === UserLevel.ADMIN && (
          <button
            onClick={() => onNavigate('admin-users')}
            className="w-full bg-white p-6 rounded-2xl shadow-md border-l-8 border-gray-800 hover:shadow-lg transition-all active:scale-95 flex items-center justify-between group"
          >
            <div className="flex items-center gap-4">
              <div className="bg-gray-200 p-3 rounded-full text-gray-800 group-hover:bg-gray-800 group-hover:text-white transition-colors">
                <Shield size={32} />
              </div>
              <div className="text-left">
                <h3 className="text-xl font-bold text-gray-800">Admin</h3>
                <p className="text-gray-500 text-sm">Gerenciar usuários</p>
              </div>
            </div>
          </button>
        )}

      </div>

      <div className="text-center p-4 text-xs text-gray-400">
        GPS System &copy; {new Date().getFullYear()}
      </div>
    </div>
  );
};

export default Dashboard;