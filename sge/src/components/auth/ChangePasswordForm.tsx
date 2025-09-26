import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { Eye, EyeOff, Key } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface ChangePasswordFormProps {
  onChangePassword: (passwords: { currentPassword: string; newPassword: string }) => Promise<void>;
  isFirstLogin?: boolean;
  userEmail: string;
  isLoading?: boolean;
}

export function ChangePasswordForm({ 
  onChangePassword, 
  isFirstLogin = false, 
  userEmail,
  isLoading = false 
}: ChangePasswordFormProps) {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [error, setError] = useState('');

  const validatePassword = (password: string) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
      return 'A senha deve ter pelo menos 8 caracteres';
    }
    if (!hasUpperCase) {
      return 'A senha deve conter pelo menos uma letra maiúscula';
    }
    if (!hasLowerCase) {
      return 'A senha deve conter pelo menos uma letra minúscula';
    }
    if (!hasNumbers) {
      return 'A senha deve conter pelo menos um número';
    }
    if (!hasSpecialChar) {
      return 'A senha deve conter pelo menos um caractere especial';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      setError('Por favor, preencha todos os campos');
      return;
    }

    const passwordError = validatePassword(formData.newPassword);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    if (formData.currentPassword === formData.newPassword) {
      setError('A nova senha deve ser diferente da senha atual');
      return;
    }

    try {
      await onChangePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });
      toast.success('Senha alterada com sucesso!');
    } catch (error) {
      console.error('Change password error:', error);
      setError('Erro ao alterar senha. Verifique a senha atual.');
      toast.error('Erro ao alterar senha');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-primary rounded-full flex items-center justify-center">
            <Key className="w-8 h-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl">
            {isFirstLogin ? 'Primeiro Acesso' : 'Alterar Senha'}
          </CardTitle>
          <CardDescription>
            {isFirstLogin 
              ? 'Por segurança, altere sua senha temporária para uma senha pessoal'
              : 'Digite sua senha atual e escolha uma nova senha'
            }
          </CardDescription>
          <div className="text-sm text-muted-foreground">
            Usuário: {userEmail}
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="currentPassword">
                {isFirstLogin ? 'Senha Temporária' : 'Senha Atual'}
              </Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showPasswords.current ? 'text' : 'password'}
                  placeholder={isFirstLogin ? 'Digite a senha temporária' : 'Digite sua senha atual'}
                  value={formData.currentPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, currentPassword: e.target.value }))}
                  disabled={isLoading}
                  autoComplete="current-password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-auto p-1"
                  onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                  disabled={isLoading}
                >
                  {showPasswords.current ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">Nova Senha</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showPasswords.new ? 'text' : 'password'}
                  placeholder="Digite sua nova senha"
                  value={formData.newPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, newPassword: e.target.value }))}
                  disabled={isLoading}
                  autoComplete="new-password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-auto p-1"
                  onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                  disabled={isLoading}
                >
                  {showPasswords.new ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showPasswords.confirm ? 'text' : 'password'}
                  placeholder="Digite novamente sua nova senha"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  disabled={isLoading}
                  autoComplete="new-password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-auto p-1"
                  onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                  disabled={isLoading}
                >
                  {showPasswords.confirm ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="text-sm font-medium text-blue-800 mb-2">Requisitos da senha:</h4>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>• Pelo menos 8 caracteres</li>
                <li>• Uma letra maiúscula</li>
                <li>• Uma letra minúscula</li>
                <li>• Um número</li>
                <li>• Um caractere especial (!@#$%^&*)</li>
              </ul>
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? 'Alterando...' : 'Alterar Senha'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}