import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Alert, AlertDescription } from '../ui/alert';
import { UserPlus, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface RegisterFormProps {
  onRegister: (userData: {
    name: string;
    email: string;
    document: string;
    documentType: 'cpf' | 'rg';
    role: string;
  }) => Promise<void>;
  onShowLogin: () => void;
  isLoading?: boolean;
}

const roles = [
  { value: 'dirigente', label: 'Dirigente Esportivo' },
  { value: 'arbitro', label: 'Árbitro/Oficial' },
  { value: 'atleta', label: 'Atleta Master 60+' },
  { value: 'operador', label: 'Operador de Sistema' },
  { value: 'leitor', label: 'Consulta/Relatórios' }
];

export function RegisterForm({ onRegister, onShowLogin, isLoading = false }: RegisterFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    document: '',
    documentType: 'cpf' as 'cpf' | 'rg',
    role: ''
  });
  const [error, setError] = useState('');

  const validateCPF = (cpf: string) => {
    const cleanCPF = cpf.replace(/\D/g, '');
    if (cleanCPF.length !== 11) return false;
    
    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1+$/.test(cleanCPF)) return false;
    
    // Validação dos dígitos verificadores
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cleanCPF.charAt(i)) * (10 - i);
    }
    let checkDigit = 11 - (sum % 11);
    if (checkDigit === 10 || checkDigit === 11) checkDigit = 0;
    if (checkDigit !== parseInt(cleanCPF.charAt(9))) return false;

    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cleanCPF.charAt(i)) * (11 - i);
    }
    checkDigit = 11 - (sum % 11);
    if (checkDigit === 10 || checkDigit === 11) checkDigit = 0;
    if (checkDigit !== parseInt(cleanCPF.charAt(10))) return false;

    return true;
  };

  const formatDocument = (value: string, type: 'cpf' | 'rg') => {
    const numbers = value.replace(/\D/g, '');
    
    if (type === 'cpf') {
      return numbers
        .slice(0, 11)
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})/, '$1-$2');
    } else {
      return numbers.slice(0, 12); // RG pode ter até 12 dígitos
    }
  };

  const handleDocumentChange = (value: string) => {
    const formatted = formatDocument(value, formData.documentType);
    setFormData(prev => ({ ...prev, document: formatted }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Nome completo é obrigatório');
      return false;
    }

    if (!formData.email.trim()) {
      setError('Email é obrigatório');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Email deve ter um formato válido');
      return false;
    }

    if (!formData.document.trim()) {
      setError('Documento é obrigatório');
      return false;
    }

    if (formData.documentType === 'cpf' && !validateCPF(formData.document)) {
      setError('CPF inválido');
      return false;
    }

    if (!formData.role) {
      setError('Cargo é obrigatório');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    try {
      await onRegister(formData);
      toast.success('Cadastro realizado com sucesso! Aguarde a aprovação do administrador.');
    } catch (error) {
      console.error('Registration error:', error);
      setError('Erro ao realizar cadastro. Tente novamente.');
      toast.error('Erro ao realizar cadastro');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-primary rounded-full flex items-center justify-center">
            <UserPlus className="w-8 h-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl">Cadastro no SGE</CardTitle>
          <CardDescription>
            Preencha os dados para solicitar acesso ao sistema
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
              <Label htmlFor="name">Nome Completo</Label>
              <Input
                id="name"
                type="text"
                placeholder="Digite seu nome completo"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                disabled={isLoading}
                autoComplete="name"
              />
            </div>

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
              <Label htmlFor="documentType">Tipo de Documento</Label>
              <Select
                value={formData.documentType}
                onValueChange={(value: 'cpf' | 'rg') => {
                  setFormData(prev => ({ ...prev, documentType: value, document: '' }));
                }}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo de documento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cpf">CPF</SelectItem>
                  <SelectItem value="rg">RG</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="document">
                {formData.documentType === 'cpf' ? 'CPF' : 'RG'}
              </Label>
              <Input
                id="document"
                type="text"
                placeholder={formData.documentType === 'cpf' ? '000.000.000-00' : 'Digite seu RG'}
                value={formData.document}
                onChange={(e) => handleDocumentChange(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Cargo/Função</Label>
              <Select
                value={formData.role}
                onValueChange={(value) => setFormData(prev => ({ ...prev, role: value }))}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione seu cargo" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? 'Cadastrando...' : 'Solicitar Cadastro'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Button 
              variant="ghost" 
              className="p-0 h-auto"
              onClick={onShowLogin}
              disabled={isLoading}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar para o login
            </Button>
          </div>

          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Importante:</strong> Após o cadastro, um administrador irá revisar e aprovar sua solicitação. 
              Você receberá um email com as credenciais de acesso quando aprovado.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}