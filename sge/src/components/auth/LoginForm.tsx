import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { Eye, EyeOff, Shield, Activity } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { projectId, publicAnonKey } from '../../utils/supabase/info';

interface LoginFormProps {
  onLogin: (credentials: { email: string; password: string }) => Promise<void>;
  onShowRegister: () => void;
  isLoading?: boolean;
}

export function LoginForm({ onLogin, onShowRegister, isLoading = false }: LoginFormProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [serverStatus, setServerStatus] = useState<'unknown' | 'checking' | 'online' | 'offline'>('unknown');
  const [isOfflineMode, setIsOfflineMode] = useState(false);

  const testServer = async () => {
    setServerStatus('checking');
    try {
      const baseUrl = `https://${projectId}.supabase.co/functions/v1/make-server-3ec57ca8`;
      console.log('🧪 Testing simplified server at:', baseUrl);
      
      // Testar as rotas básicas
      const tests = [
        { name: 'Test', url: `${baseUrl}/test`, method: 'GET' },
        { name: 'Health', url: `${baseUrl}/health`, method: 'GET' },
        { 
          name: 'Login Test', 
          url: `${baseUrl}/auth/login`, 
          method: 'POST',
          body: { email: 'admin@sge.gov.br', password: 'SGE@Admin2024!' }
        }
      ];
      
      const results = [];
      
      for (const test of tests) {
        try {
          console.log(`🔍 Testing ${test.name}:`, test.url);
          
          const options: RequestInit = {
            method: test.method,
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
          };
          
          if (test.body) {
            options.body = JSON.stringify(test.body);
            console.log(`📤 ${test.name} body:`, test.body);
          }
          
          const response = await fetch(test.url, options);
          console.log(`📊 ${test.name} Status:`, response.status);
          
          const responseText = await response.text();
          console.log(`📄 ${test.name} Response:`, responseText);
          
          if (response.ok) {
            let data;
            try {
              data = JSON.parse(responseText);
            } catch {
              data = responseText;
            }
            console.log(`✅ ${test.name} Success:`, data);
            results.push({ name: test.name, success: true, data });
          } else {
            console.log(`❌ ${test.name} Failed:`, responseText);
            results.push({ name: test.name, success: false, error: responseText, status: response.status });
          }
        } catch (error) {
          console.error(`❌ ${test.name} Exception:`, error);
          results.push({ name: test.name, success: false, error: error.message });
        }
      }
      
      const successCount = results.filter(r => r.success).length;
      
      if (successCount >= 2) { // Pelo menos Test e Health devem funcionar
        setServerStatus('online');
        toast.success(`Servidor funcionando: ${successCount}/${tests.length} rotas OK`);
      } else {
        setServerStatus('offline');
        toast.error('Servidor com problemas');
      }
      
      console.log('📈 Test Results:', results);
      
    } catch (error) {
      console.error('❌ Server test error:', error);
      setServerStatus('offline');
      toast.error('Erro ao conectar com o servidor');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Por favor, preencha todos os campos');
      return;
    }

    try {
      await onLogin(formData);
      
      // Verificar se está em modo offline
      const mode = localStorage.getItem('sge_mode');
      if (mode === 'offline') {
        setIsOfflineMode(true);
        toast.success('Login realizado em modo offline/demo');
      } else {
        toast.success('Login realizado com sucesso');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'Email ou senha incorretos');
      toast.error('Erro ao realizar login');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-primary rounded-full flex items-center justify-center">
            <Shield className="w-8 h-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl">SGE - Sistema de Gerenciamento Esportivo</CardTitle>
          <CardDescription>
            Entre com suas credenciais para acessar o sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu.email@exemplo.com"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                disabled={isLoading}
                autoComplete="email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Digite sua senha"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  disabled={isLoading}
                  autoComplete="current-password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-auto p-1"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>

          <div className="mt-6 text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              Não possui uma conta?{' '}
              <Button 
                variant="link" 
                className="p-0 h-auto"
                onClick={onShowRegister}
                disabled={isLoading}
              >
                Cadastre-se aqui
              </Button>
            </p>
            
            <div className="space-y-3">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-xs text-blue-800 mb-2">
                  <strong>Credenciais de teste (Administrador):</strong>
                </p>
                <div className="text-xs text-blue-700 space-y-1">
                  <p><strong>Email:</strong> admin@sge.gov.br</p>
                  <p><strong>Senha:</strong> SGE@Admin2024!</p>
                </div>
                <div className="flex gap-2 mt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="flex-1 text-xs"
                    onClick={() => {
                      setFormData({
                        email: 'admin@sge.gov.br',
                        password: 'SGE@Admin2024!'
                      });
                    }}
                    disabled={isLoading}
                  >
                    Preencher credenciais
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={testServer}
                    disabled={serverStatus === 'checking'}
                  >
                    <Activity className="w-3 h-3 mr-1" />
                    {serverStatus === 'checking' ? 'Testando...' : 'Testar Servidor'}
                  </Button>
                </div>
              </div>
              
              {serverStatus !== 'unknown' && (
                <div className={`p-3 rounded-lg border text-xs ${
                  serverStatus === 'online' ? 'bg-green-50 border-green-200 text-green-800' :
                  serverStatus === 'offline' ? 'bg-red-50 border-red-200 text-red-800' :
                  'bg-yellow-50 border-yellow-200 text-yellow-800'
                }`}>
                  <strong>Status do Servidor:</strong> {
                    serverStatus === 'online' ? '✅ Online' :
                    serverStatus === 'offline' ? '❌ Offline (Modo Demo Disponível)' :
                    '⏳ Verificando...'
                  }
                </div>
              )}
              
              {isOfflineMode && (
                <div className="p-3 rounded-lg border border-orange-200 bg-orange-50 text-xs text-orange-800">
                  <strong>⚠️ Modo Demo/Offline:</strong> Funcionando localmente sem servidor. 
                  Todas as funcionalidades estão disponíveis para demonstração.
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}