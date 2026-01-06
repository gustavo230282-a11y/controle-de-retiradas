import React, { useState, useEffect } from 'react';
import { User, ViewState, UserLevel } from './types';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import WithdrawalForm from './components/WithdrawalForm';
import WithdrawalList from './components/WithdrawalList';
import AdminPanel from './components/AdminPanel';
import WithdrawalReport from './components/WithdrawalReport';
import Layout from './components/Layout';
import { supabase } from './services/supaClient';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<ViewState>(() => {
    return (localStorage.getItem('app_current_view') as ViewState) || 'dashboard';
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const mappedUser: User = {
          id: session.user.id,
          name: session.user.user_metadata.name || session.user.email || 'Usuário',
          email: session.user.email || '',
          passwordHash: '',
          level: (session.user.user_metadata.level as UserLevel) || UserLevel.OPERATOR
        };
        setCurrentUser(mappedUser);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const mappedUser: User = {
          id: session.user.id,
          name: session.user.user_metadata.name || session.user.email || 'Usuário',
          email: session.user.email || '',
          passwordHash: '',
          level: (session.user.user_metadata.level as UserLevel) || UserLevel.OPERATOR
        };
        setCurrentUser(mappedUser);
        // Only reset view if we were on login (implicit) or if logged out
        // Actually, better to reset to dashboard on login to ensure fresh state
        if (!currentUser) setCurrentView('dashboard');
      } else {
        setCurrentUser(null);
        setCurrentView('dashboard');
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('app_current_view');
  };

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('app_current_view', currentView);
    }
  }, [currentView, currentUser]);

  const renderContent = () => {
    if (!currentUser) {
      return <Login />;
    }

    switch (currentView) {
      case 'dashboard':
        return (
          <Dashboard
            user={currentUser}
            onNavigate={setCurrentView}
            onLogout={handleLogout}
          />
        );
      case 'new-withdrawal':
        return (
          <WithdrawalForm
            currentUser={currentUser}
            onSuccess={() => setCurrentView('list-withdrawals')}
            onCancel={() => setCurrentView('dashboard')}
          />
        );
      case 'list-withdrawals':
        return (
          <WithdrawalList
            currentUser={currentUser}
            onBack={() => setCurrentView('dashboard')}
          />
        );
      case 'report':
        return (
          <WithdrawalReport
            onBack={() => setCurrentView('dashboard')}
          />
        );
      case 'admin-users':
        return (
          <AdminPanel
            onBack={() => setCurrentView('dashboard')}
          />
        );
      default:
        return <div>Rota não encontrada</div>;
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen bg-gray-100">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {renderContent()}
    </Layout>
  );
};

export default App;
