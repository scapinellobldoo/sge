import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { Municipalities } from './components/Municipalities';
import { Delegations } from './components/Delegations';
import { Teams } from './components/Teams';
import { Athletes } from './components/Athletes';
import { Officials } from './components/Officials';
import { Events } from './components/Events';
import { Competitions } from './components/Competitions';
import { Registrations } from './components/Registrations';
import { Results } from './components/Results';
import { Reports } from './components/Reports';
import { UserManagement } from './components/UserManagement';
import { UserApproval } from './components/UserApproval';
import { Header } from './components/Header';
import { Toaster } from './components/ui/sonner';
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';
import { ChangePasswordForm } from './components/auth/ChangePasswordForm';
import { PendingApproval } from './components/auth/PendingApproval';
import { authService, AuthUser, LoginCredentials, RegisterData, ChangePasswordData } from './utils/auth';
import { toast } from 'sonner@2.0.3';

export type UserRole = 'gestor' | 'dirigente' | 'arbitro' | 'atleta' | 'leitor' | 'operador';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  permissions: string[];
}

export type ActiveModule = 
  | 'dashboard' 
  | 'municipalities' 
  | 'delegations' 
  | 'teams' 
  | 'athletes' 
  | 'officials' 
  | 'events' 
  | 'competitions' 
  | 'registrations' 
  | 'results' 
  | 'reports' 
  | 'users'
  | 'approvals';

type AuthState = 'loading' | 'login' | 'register' | 'pending-approval' | 'change-password' | 'authenticated';

interface AppState {
  authState: AuthState;
  currentUser: AuthUser | null;
  isLoading: boolean;
  pendingEmail?: string;
}

export default function App() {
  const [activeModule, setActiveModule] = useState<ActiveModule>('dashboard');
  const [appState, setAppState] = useState<AppState>({
    authState: 'loading',
    currentUser: null,
    isLoading: false
  });

  // Verificar autenticação no carregamento da aplicação
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (authService.isAuthenticated()) {
          const user = await authService.getCurrentUser();
          if (user) {
            if (user.needsPasswordChange || user.isFirstLogin) {
              setAppState({
                authState: 'change-password',
                currentUser: user,
                isLoading: false
              });
            } else {
              setAppState({
                authState: 'authenticated',
                currentUser: user,
                isLoading: false
              });
            }
          } else {
            setAppState({
              authState: 'login',
              currentUser: null,
              isLoading: false
            });
          }
        } else {
          setAppState({
            authState: 'login',
            currentUser: null,
            isLoading: false
          });
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setAppState({
          authState: 'login',
          currentUser: null,
          isLoading: false
        });
      }
    };

    checkAuth();
  }, []);

  const handleLogin = async (credentials: LoginCredentials) => {
    setAppState(prev => ({ ...prev, isLoading: true }));
    try {
      const { user } = await authService.login(credentials);
      
      if (user.needsPasswordChange || user.isFirstLogin) {
        setAppState({
          authState: 'change-password',
          currentUser: user,
          isLoading: false
        });
      } else {
        setAppState({
          authState: 'authenticated',
          currentUser: user,
          isLoading: false
        });
        toast.success(`Bem-vindo, ${user.name}!`);
      }
    } catch (error) {
      setAppState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const handleRegister = async (userData: RegisterData) => {
    setAppState(prev => ({ ...prev, isLoading: true }));
    try {
      await authService.register(userData);
      setAppState({
        authState: 'pending-approval',
        currentUser: null,
        isLoading: false,
        pendingEmail: userData.email
      });
    } catch (error) {
      setAppState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const handleChangePassword = async (passwords: ChangePasswordData) => {
    if (!appState.currentUser) return;
    
    setAppState(prev => ({ ...prev, isLoading: true }));
    try {
      await authService.changePassword(passwords);
      const updatedUser = { ...appState.currentUser, needsPasswordChange: false, isFirstLogin: false };
      setAppState({
        authState: 'authenticated',
        currentUser: updatedUser,
        isLoading: false
      });
      toast.success('Senha alterada com sucesso! Bem-vindo ao SGE.');
    } catch (error) {
      setAppState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const handleLogout = () => {
    authService.logout();
    setAppState({
      authState: 'login',
      currentUser: null,
      isLoading: false
    });
    setActiveModule('dashboard');
    toast.info('Sessão encerrada');
  };

  const showLogin = () => {
    setAppState(prev => ({ ...prev, authState: 'login' }));
  };

  const showRegister = () => {
    setAppState(prev => ({ ...prev, authState: 'register' }));
  };

  // Converter AuthUser para User para compatibilidade com componentes existentes
  const getCurrentUser = (): User | null => {
    if (!appState.currentUser) return null;
    
    return {
      id: appState.currentUser.id,
      name: appState.currentUser.name,
      email: appState.currentUser.email,
      role: appState.currentUser.role as UserRole,
      permissions: appState.currentUser.role === 'gestor' ? ['all'] : []
    };
  };

  const renderModule = () => {
    const currentUser = getCurrentUser();
    if (!currentUser) return null;

    switch (activeModule) {
      case 'dashboard':
        return <Dashboard currentUser={currentUser} />;
      case 'municipalities':
        return <Municipalities currentUser={currentUser} />;
      case 'delegations':
        return <Delegations currentUser={currentUser} />;
      case 'teams':
        return <Teams currentUser={currentUser} />;
      case 'athletes':
        return <Athletes currentUser={currentUser} />;
      case 'officials':
        return <Officials currentUser={currentUser} />;
      case 'events':
        return <Events currentUser={currentUser} />;
      case 'competitions':
        return <Competitions currentUser={currentUser} />;
      case 'registrations':
        return <Registrations currentUser={currentUser} />;
      case 'results':
        return <Results currentUser={currentUser} />;
      case 'reports':
        return <Reports currentUser={currentUser} />;
      case 'users':
        return <UserManagement currentUser={currentUser} />;
      case 'approvals':
        return <UserApproval currentUser={currentUser} />;
      default:
        return <Dashboard currentUser={currentUser} />;
    }
  };

  // Renderizar telas de autenticação
  if (appState.authState === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando SGE...</p>
        </div>
      </div>
    );
  }

  if (appState.authState === 'login') {
    return (
      <>
        <LoginForm 
          onLogin={handleLogin}
          onShowRegister={showRegister}
          isLoading={appState.isLoading}
        />
        <Toaster />
      </>
    );
  }

  if (appState.authState === 'register') {
    return (
      <>
        <RegisterForm 
          onRegister={handleRegister}
          onShowLogin={showLogin}
          isLoading={appState.isLoading}
        />
        <Toaster />
      </>
    );
  }

  if (appState.authState === 'pending-approval') {
    return (
      <>
        <PendingApproval 
          userEmail={appState.pendingEmail || ''}
          onBackToLogin={showLogin}
        />
        <Toaster />
      </>
    );
  }

  if (appState.authState === 'change-password' && appState.currentUser) {
    return (
      <>
        <ChangePasswordForm 
          onChangePassword={handleChangePassword}
          isFirstLogin={appState.currentUser.isFirstLogin}
          userEmail={appState.currentUser.email}
          isLoading={appState.isLoading}
        />
        <Toaster />
      </>
    );
  }

  // Renderizar aplicação principal quando autenticado
  const currentUser = getCurrentUser();
  if (appState.authState === 'authenticated' && currentUser) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex">
          <Sidebar 
            activeModule={activeModule} 
            onModuleChange={setActiveModule}
            currentUser={currentUser}
          />
          <div className="flex-1">
            <Header 
              currentUser={currentUser} 
              onLogout={handleLogout}
            />
            <main className="p-6">
              {renderModule()}
            </main>
          </div>
        </div>
        <Toaster />
      </div>
    );
  }

  // Fallback
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
      <div className="text-center">
        <p className="text-muted-foreground">Erro no sistema de autenticação</p>
      </div>
    </div>
  );
}