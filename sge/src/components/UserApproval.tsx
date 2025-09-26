import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { CheckCircle, XCircle, Eye, Copy, Users, Clock, UserCheck } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { User } from '../App';

interface PendingUser {
  id: string;
  name: string;
  email: string;
  document: string;
  documentType: 'cpf' | 'rg';
  role: string;
  createdAt: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
  temporaryPassword?: string;
}

interface UserApprovalProps {
  currentUser: User;
}

export function UserApproval({ currentUser }: UserApprovalProps) {
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<PendingUser | null>(null);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  // Função para gerar senha aleatória
  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%^&*';
    let password = '';
    password += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)]; // Uma maiúscula
    password += 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)]; // Uma minúscula
    password += '0123456789'[Math.floor(Math.random() * 10)]; // Um número
    password += '!@#$%^&*'[Math.floor(Math.random() * 8)]; // Um especial
    
    // Completa com caracteres aleatórios até 12 caracteres
    for (let i = 4; i < 12; i++) {
      password += chars[Math.floor(Math.random() * chars.length)];
    }
    
    // Embaralha a senha
    return password.split('').sort(() => Math.random() - 0.5).join('');
  };

  const loadPendingUsers = async () => {
    try {
      setLoading(true);
      // Simular carregamento de usuários pendentes
      const mockUsers: PendingUser[] = [
        {
          id: '1',
          name: 'João Silva dos Santos',
          email: 'joao.silva@email.com',
          document: '123.456.789-01',
          documentType: 'cpf',
          role: 'dirigente',
          createdAt: '2024-09-26T10:30:00Z',
          status: 'pending'
        },
        {
          id: '2',
          name: 'Maria Oliveira Costa',
          email: 'maria.oliveira@email.com',
          document: '987.654.321-00',
          documentType: 'cpf',
          role: 'arbitro',
          createdAt: '2024-09-25T14:15:00Z',
          status: 'pending'
        },
        {
          id: '3',
          name: 'Carlos Eduardo Lima',
          email: 'carlos.lima@email.com',
          document: '45.678.901-X',
          documentType: 'rg',
          role: 'atleta',
          createdAt: '2024-09-24T09:45:00Z',
          status: 'approved',
          approvedBy: 'admin@sge.gov.br',
          approvedAt: '2024-09-25T11:20:00Z',
          temporaryPassword: 'TempPass123!'
        }
      ];
      
      setPendingUsers(mockUsers);
    } catch (error) {
      console.error('Error loading pending users:', error);
      toast.error('Erro ao carregar usuários pendentes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPendingUsers();
  }, []);

  const handleApproveUser = async (user: PendingUser) => {
    setActionLoading(user.id);
    try {
      const temporaryPassword = generateRandomPassword();
      
      // Aqui seria feita a chamada para o backend para:
      // 1. Criar o usuário no Supabase Auth
      // 2. Atualizar o status no banco de dados
      // 3. Enviar email com as credenciais
      
      // Simular aprovação
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const updatedUser: PendingUser = {
        ...user,
        status: 'approved',
        approvedBy: currentUser.email,
        approvedAt: new Date().toISOString(),
        temporaryPassword
      };

      setPendingUsers(prev => 
        prev.map(u => u.id === user.id ? updatedUser : u)
      );

      toast.success(`Usuário ${user.name} aprovado com sucesso!`);
      
      // Mostrar a senha temporária gerada
      setSelectedUser(updatedUser);
      setShowDetailsDialog(true);
      
    } catch (error) {
      console.error('Error approving user:', error);
      toast.error('Erro ao aprovar usuário');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectUser = async () => {
    if (!selectedUser || !rejectionReason.trim()) {
      toast.error('Motivo da rejeição é obrigatório');
      return;
    }

    setActionLoading(selectedUser.id);
    try {
      // Aqui seria feita a chamada para o backend para rejeitar o usuário
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedUser: PendingUser = {
        ...selectedUser,
        status: 'rejected',
        rejectionReason
      };

      setPendingUsers(prev => 
        prev.map(u => u.id === selectedUser.id ? updatedUser : u)
      );

      toast.success(`Usuário ${selectedUser.name} rejeitado`);
      setShowRejectDialog(false);
      setSelectedUser(null);
      setRejectionReason('');
      
    } catch (error) {
      console.error('Error rejecting user:', error);
      toast.error('Erro ao rejeitar usuário');
    } finally {
      setActionLoading(null);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copiado para a área de transferência');
  };

  const getRoleLabel = (role: string) => {
    const roleLabels: { [key: string]: string } = {
      'dirigente': 'Dirigente Esportivo',
      'arbitro': 'Árbitro/Oficial',
      'atleta': 'Atleta Master 60+',
      'operador': 'Operador de Sistema',
      'leitor': 'Consulta/Relatórios'
    };
    return roleLabels[role] || role;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />Pendente</Badge>;
      case 'approved':
        return <Badge className="bg-green-500"><UserCheck className="w-3 h-3 mr-1" />Aprovado</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Rejeitado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (currentUser.role !== 'gestor') {
    return (
      <div className="p-6">
        <Alert>
          <AlertDescription>
            Apenas administradores podem acessar esta funcionalidade.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Aprovação de Usuários</h1>
          <p className="text-muted-foreground">
            Gerencie solicitações de cadastro de novos usuários
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {pendingUsers.filter(u => u.status === 'pending').length} pendentes
          </span>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Solicitações de Cadastro</CardTitle>
          <CardDescription>
            Revise e aprove ou rejeite solicitações de novos usuários
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
              <p className="text-muted-foreground mt-2">Carregando solicitações...</p>
            </div>
          ) : pendingUsers.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">Nenhuma solicitação encontrada</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Documento</TableHead>
                  <TableHead>Cargo</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      {user.document} ({user.documentType.toUpperCase()})
                    </TableCell>
                    <TableCell>{getRoleLabel(user.role)}</TableCell>
                    <TableCell>{formatDate(user.createdAt)}</TableCell>
                    <TableCell>{getStatusBadge(user.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedUser(user);
                            setShowDetailsDialog(true);
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        
                        {user.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleApproveUser(user)}
                              disabled={actionLoading === user.id}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              {actionLoading === user.id ? (
                                <div className="w-4 h-4 animate-spin border-2 border-white border-t-transparent rounded-full" />
                              ) : (
                                <CheckCircle className="w-4 h-4" />
                              )}
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => {
                                setSelectedUser(user);
                                setShowRejectDialog(true);
                              }}
                              disabled={actionLoading === user.id}
                            >
                              <XCircle className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Dialog de Detalhes do Usuário */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Detalhes do Usuário</DialogTitle>
            <DialogDescription>
              Informações completas da solicitação
            </DialogDescription>
          </DialogHeader>
          
          {selectedUser && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <Label className="text-muted-foreground">Nome</Label>
                  <p>{selectedUser.name}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Email</Label>
                  <p>{selectedUser.email}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Documento</Label>
                  <p>{selectedUser.document} ({selectedUser.documentType.toUpperCase()})</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Cargo</Label>
                  <p>{getRoleLabel(selectedUser.role)}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Data da Solicitação</Label>
                  <p>{formatDate(selectedUser.createdAt)}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <div className="mt-1">{getStatusBadge(selectedUser.status)}</div>
                </div>
              </div>

              {selectedUser.status === 'approved' && selectedUser.temporaryPassword && (
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <Label className="text-green-800 font-medium">Senha Temporária Gerada</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="bg-white px-2 py-1 rounded border text-sm font-mono">
                      {selectedUser.temporaryPassword}
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(selectedUser.temporaryPassword!)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-green-700 mt-2">
                    Esta senha foi enviada por email para o usuário
                  </p>
                </div>
              )}

              {selectedUser.status === 'rejected' && selectedUser.rejectionReason && (
                <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                  <Label className="text-red-800 font-medium">Motivo da Rejeição</Label>
                  <p className="text-sm text-red-700 mt-1">{selectedUser.rejectionReason}</p>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetailsDialog(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de Rejeição */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rejeitar Solicitação</DialogTitle>
            <DialogDescription>
              Informe o motivo da rejeição para {selectedUser?.name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="rejectionReason">Motivo da Rejeição</Label>
              <Textarea
                id="rejectionReason"
                placeholder="Descreva o motivo da rejeição..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setShowRejectDialog(false);
                setRejectionReason('');
              }}
            >
              Cancelar
            </Button>
            <Button 
              variant="destructive"
              onClick={handleRejectUser}
              disabled={!rejectionReason.trim() || actionLoading === selectedUser?.id}
            >
              {actionLoading === selectedUser?.id ? 'Rejeitando...' : 'Rejeitar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}