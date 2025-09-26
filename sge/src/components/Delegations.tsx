import { useState } from 'react';
import { Plus, Search, Edit, Trash2, Building2, Users, Trophy } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import type { User } from '../App';

interface Delegation {
  id: string;
  name: string;
  municipality: string;
  responsible: string;
  email: string;
  phone: string;
  address: string;
  description: string;
  sports: string[];
  teams: number;
  athletes: number;
  status: 'active' | 'inactive';
  budget: number;
  createdAt: string;
  updatedAt: string;
}

interface DelegationsProps {
  currentUser: User;
}

const mockDelegations: Delegation[] = [
  {
    id: '1',
    name: 'Delegação SP Centro',
    municipality: 'São Paulo',
    responsible: 'Carlos Silva',
    email: 'carlos@delegacao-sp.gov.br',
    phone: '(11) 3333-4444',
    address: 'Rua das Palmeiras, 123 - Centro, São Paulo - SP',
    description: 'Delegação responsável pela região central de São Paulo',
    sports: ['Futebol', 'Vôlei', 'Basquete', 'Natação'],
    teams: 8,
    athletes: 156,
    status: 'active',
    budget: 250000,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-10'
  },
  {
    id: '2',
    name: 'Delegação RJ Zona Sul',
    municipality: 'Rio de Janeiro',
    responsible: 'Ana Costa',
    email: 'ana@delegacao-rj.gov.br',
    phone: '(21) 2222-3333',
    address: 'Av. Atlântica, 456 - Copacabana, Rio de Janeiro - RJ',
    description: 'Delegação da Zona Sul do Rio de Janeiro',
    sports: ['Vôlei de Praia', 'Surf', 'Natação', 'Futebol'],
    teams: 6,
    athletes: 98,
    status: 'active',
    budget: 180000,
    createdAt: '2024-01-02',
    updatedAt: '2024-01-09'
  },
  {
    id: '3',
    name: 'Delegação DF',
    municipality: 'Brasília',
    responsible: 'Pedro Oliveira',
    email: 'pedro@delegacao-df.gov.br',
    phone: '(61) 3333-2222',
    address: 'SCS Quadra 1, Bloco A - Asa Sul, Brasília - DF',
    description: 'Delegação oficial do Distrito Federal',
    sports: ['Atletismo', 'Natação', 'Ginástica', 'Judô'],
    teams: 5,
    athletes: 87,
    status: 'active',
    budget: 200000,
    createdAt: '2024-01-03',
    updatedAt: '2024-01-08'
  },
  {
    id: '4',
    name: 'Delegação BA Salvador',
    municipality: 'Salvador',
    responsible: 'Mariana Santos',
    email: 'mariana@delegacao-ba.gov.br',
    phone: '(71) 4444-1111',
    address: 'Rua Chile, 789 - Pelourinho, Salvador - BA',
    description: 'Delegação de Salvador e região metropolitana',
    sports: ['Capoeira', 'Futebol', 'Vôlei', 'Atletismo'],
    teams: 7,
    athletes: 124,
    status: 'active',
    budget: 160000,
    createdAt: '2024-01-04',
    updatedAt: '2024-01-07'
  }
];

export function Delegations({ currentUser }: DelegationsProps) {
  const [delegations, setDelegations] = useState(mockDelegations);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDelegation, setEditingDelegation] = useState<Delegation | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    municipality: '',
    responsible: '',
    email: '',
    phone: '',
    address: '',
    description: '',
    sports: [] as string[],
    budget: '',
    status: 'active' as const
  });

  const filteredDelegations = delegations.filter(delegation =>
    delegation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    delegation.municipality.toLowerCase().includes(searchTerm.toLowerCase()) ||
    delegation.responsible.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetForm = () => {
    setFormData({
      name: '',
      municipality: '',
      responsible: '',
      email: '',
      phone: '',
      address: '',
      description: '',
      sports: [],
      budget: '',
      status: 'active'
    });
    setEditingDelegation(null);
  };

  const handleSubmit = () => {
    if (editingDelegation) {
      setDelegations(prev => prev.map(delegation =>
        delegation.id === editingDelegation.id
          ? {
              ...delegation,
              ...formData,
              budget: parseFloat(formData.budget),
              updatedAt: new Date().toISOString().split('T')[0]
            }
          : delegation
      ));
    } else {
      const newDelegation: Delegation = {
        id: Date.now().toString(),
        ...formData,
        budget: parseFloat(formData.budget),
        teams: 0,
        athletes: 0,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0]
      };
      setDelegations(prev => [...prev, newDelegation]);
    }
    
    setIsDialogOpen(false);
    resetForm();
  };

  const handleEdit = (delegation: Delegation) => {
    setEditingDelegation(delegation);
    setFormData({
      name: delegation.name,
      municipality: delegation.municipality,
      responsible: delegation.responsible,
      email: delegation.email,
      phone: delegation.phone,
      address: delegation.address,
      description: delegation.description,
      sports: delegation.sports,
      budget: delegation.budget.toString(),
      status: delegation.status
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setDelegations(prev => prev.filter(delegation => delegation.id !== id));
  };

  const canEdit = ['gestor', 'dirigente', 'operador'].includes(currentUser.role);

  const sportsOptions = ['Futebol', 'Vôlei', 'Basquete', 'Natação', 'Atletismo', 'Judô', 'Ginástica', 'Tênis', 'Vôlei de Praia', 'Surf', 'Capoeira'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1>Delegações</h1>
          <p className="text-muted-foreground">
            Gerenciar delegações esportivas dos municípios
          </p>
        </div>
        {canEdit && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Nova Delegação
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingDelegation ? 'Editar Delegação' : 'Nova Delegação'}
                </DialogTitle>
                <DialogDescription>
                  {editingDelegation 
                    ? 'Atualize as informações da delegação.' 
                    : 'Adicione uma nova delegação ao sistema.'
                  }
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome da Delegação</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="municipality">Município</Label>
                  <Input
                    id="municipality"
                    value={formData.municipality}
                    onChange={(e) => setFormData(prev => ({ ...prev, municipality: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="responsible">Responsável</Label>
                  <Input
                    id="responsible"
                    value={formData.responsible}
                    onChange={(e) => setFormData(prev => ({ ...prev, responsible: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="budget">Orçamento (R$)</Label>
                  <Input
                    id="budget"
                    type="number"
                    value={formData.budget}
                    onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="address">Endereço</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value: 'active' | 'inactive') => setFormData(prev => ({ ...prev, status: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Ativo</SelectItem>
                      <SelectItem value="inactive">Inativo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSubmit}>
                  {editingDelegation ? 'Atualizar' : 'Cadastrar'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Delegações</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{delegations.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Equipes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {delegations.reduce((acc, d) => acc + d.teams, 0)}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Atletas</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {delegations.reduce((acc, d) => acc + d.athletes, 0)}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orçamento Total</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {delegations.reduce((acc, d) => acc + d.budget, 0).toLocaleString('pt-BR')}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar delegações..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Delegações</CardTitle>
          <CardDescription>
            Gerencie as delegações cadastradas no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Responsável</TableHead>
                <TableHead>Município</TableHead>
                <TableHead>Modalidades</TableHead>
                <TableHead>Equipes/Atletas</TableHead>
                <TableHead>Orçamento</TableHead>
                <TableHead>Status</TableHead>
                {canEdit && <TableHead>Ações</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDelegations.map((delegation) => (
                <TableRow key={delegation.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{delegation.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {delegation.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div>{delegation.responsible}</div>
                      <div className="text-sm text-muted-foreground">{delegation.phone}</div>
                    </div>
                  </TableCell>
                  <TableCell>{delegation.municipality}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {delegation.sports.slice(0, 2).map(sport => (
                        <Badge key={sport} variant="secondary" className="text-xs">
                          {sport}
                        </Badge>
                      ))}
                      {delegation.sports.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{delegation.sports.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{delegation.teams} equipes</div>
                      <div className="text-muted-foreground">{delegation.athletes} atletas</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    R$ {delegation.budget.toLocaleString('pt-BR')}
                  </TableCell>
                  <TableCell>
                    <Badge variant={delegation.status === 'active' ? 'default' : 'secondary'}>
                      {delegation.status === 'active' ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </TableCell>
                  {canEdit && (
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(delegation)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(delegation.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}