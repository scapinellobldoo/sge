import { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, MapPin, Users, Calendar } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { apiClient } from '../utils/api';
import { toast } from 'sonner@2.0.3';
import type { User } from '../App';

interface Municipality {
  id: string;
  name: string;
  state: string;
  region: string;
  population: number;
  area: number;
  mayor: string;
  sportsSecretary: string;
  phone: string;
  email: string;
  status: 'active' | 'inactive';
  delegations: number;
  athletes: number;
  events: number;
  createdAt: string;
  updatedAt: string;
}

interface MunicipalitiesProps {
  currentUser: User;
}

const mockMunicipalities: Municipality[] = [
  {
    id: '1',
    name: 'São Paulo',
    state: 'SP',
    region: 'Sudeste',
    population: 12300000,
    area: 1521.11,
    mayor: 'Ricardo Nunes',
    sportsSecretary: 'Carlos Bezerra Jr.',
    phone: '(11) 3113-9000',
    email: 'esportes@prefeitura.sp.gov.br',
    status: 'active',
    delegations: 8,
    athletes: 1247,
    events: 45,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-10'
  },
  {
    id: '2',
    name: 'Rio de Janeiro',
    state: 'RJ',
    region: 'Sudeste',
    population: 6748000,
    area: 1200.27,
    mayor: 'Eduardo Paes',
    sportsSecretary: 'Guilherme Schleder',
    phone: '(21) 2976-1000',
    email: 'esportes@rio.rj.gov.br',
    status: 'active',
    delegations: 6,
    athletes: 892,
    events: 32,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-09'
  },
  {
    id: '3',
    name: 'Brasília',
    state: 'DF',
    region: 'Centro-Oeste',
    population: 3094000,
    area: 5760.78,
    mayor: 'Ibaneis Rocha',
    sportsSecretary: 'Celso Barros',
    phone: '(61) 2142-7000',
    email: 'esporte@df.gov.br',
    status: 'active',
    delegations: 4,
    athletes: 456,
    events: 18,
    createdAt: '2024-01-02',
    updatedAt: '2024-01-08'
  },
  {
    id: '4',
    name: 'Salvador',
    state: 'BA',
    region: 'Nordeste',
    population: 2872000,
    area: 692.82,
    mayor: 'Bruno Reis',
    sportsSecretary: 'Prediliano Bandeira',
    phone: '(71) 3202-3000',
    email: 'esportes@salvador.ba.gov.br',
    status: 'active',
    delegations: 5,
    athletes: 623,
    events: 25,
    createdAt: '2024-01-03',
    updatedAt: '2024-01-07'
  }
];

export function Municipalities({ currentUser }: MunicipalitiesProps) {
  const [municipalities, setMunicipalities] = useState<Municipality[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMunicipality, setEditingMunicipality] = useState<Municipality | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    state: '',
    region: '',
    population: '',
    area: '',
    mayor: '',
    sportsSecretary: '',
    phone: '',
    email: '',
    status: 'active' as const
  });

  useEffect(() => {
    const fetchMunicipalities = async () => {
      try {
        const data = await apiClient.getMunicipalities();
        setMunicipalities(data || []);
      } catch (error) {
        console.error('Error fetching municipalities:', error);
        toast.error('Erro ao carregar municípios');
      } finally {
        setLoading(false);
      }
    };

    fetchMunicipalities();
  }, []);

  const filteredMunicipalities = municipalities.filter(municipality =>
    municipality.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    municipality.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
    municipality.region.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetForm = () => {
    setFormData({
      name: '',
      state: '',
      region: '',
      population: '',
      area: '',
      mayor: '',
      sportsSecretary: '',
      phone: '',
      email: '',
      status: 'active'
    });
    setEditingMunicipality(null);
  };

  const handleSubmit = async () => {
    try {
      const municipalityData = {
        ...formData,
        population: parseInt(formData.population) || 0,
        area: parseFloat(formData.area) || 0,
        delegations: 0,
        athletes: 0,
        events: 0
      };

      if (editingMunicipality) {
        // Update existing municipality
        const updated = await apiClient.updateMunicipality(editingMunicipality.id, municipalityData);
        setMunicipalities(prev => prev.map(municipality =>
          municipality.id === editingMunicipality.id ? updated : municipality
        ));
        toast.success('Município atualizado com sucesso!');
      } else {
        // Create new municipality
        const created = await apiClient.createMunicipality(municipalityData);
        setMunicipalities(prev => [...prev, created]);
        toast.success('Município criado com sucesso!');
      }
      
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error saving municipality:', error);
      toast.error('Erro ao salvar município');
    }
  };

  const handleEdit = (municipality: Municipality) => {
    setEditingMunicipality(municipality);
    setFormData({
      name: municipality.name || '',
      state: municipality.state || '',
      region: municipality.region || '',
      population: municipality.population ? municipality.population.toString() : '0',
      area: municipality.area ? municipality.area.toString() : '0',
      mayor: municipality.mayor || '',
      sportsSecretary: municipality.sportsSecretary || '',
      phone: municipality.phone || '',
      email: municipality.email || '',
      status: municipality.status || 'active'
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await apiClient.deleteMunicipality(id);
      setMunicipalities(prev => prev.filter(municipality => municipality.id !== id));
      toast.success('Município excluído com sucesso!');
    } catch (error) {
      console.error('Error deleting municipality:', error);
      toast.error('Erro ao excluir município');
    }
  };

  const canEdit = ['gestor', 'operador'].includes(currentUser.role);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1>Municípios</h1>
          <p className="text-muted-foreground">
            Gerenciar municípios participantes dos eventos esportivos
          </p>
        </div>
        {canEdit && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Novo Município
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingMunicipality ? 'Editar Município' : 'Novo Município'}
                </DialogTitle>
                <DialogDescription>
                  {editingMunicipality 
                    ? 'Atualize as informações do município.' 
                    : 'Adicione um novo município ao sistema.'
                  }
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="state">Estado</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="region">Região</Label>
                  <Select value={formData.region} onValueChange={(value) => setFormData(prev => ({ ...prev, region: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a região" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Norte">Norte</SelectItem>
                      <SelectItem value="Nordeste">Nordeste</SelectItem>
                      <SelectItem value="Centro-Oeste">Centro-Oeste</SelectItem>
                      <SelectItem value="Sudeste">Sudeste</SelectItem>
                      <SelectItem value="Sul">Sul</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="population">População</Label>
                  <Input
                    id="population"
                    type="number"
                    value={formData.population}
                    onChange={(e) => setFormData(prev => ({ ...prev, population: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="area">Área (km²)</Label>
                  <Input
                    id="area"
                    type="number"
                    step="0.01"
                    value={formData.area}
                    onChange={(e) => setFormData(prev => ({ ...prev, area: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="mayor">Prefeito</Label>
                  <Input
                    id="mayor"
                    value={formData.mayor}
                    onChange={(e) => setFormData(prev => ({ ...prev, mayor: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="sportsSecretary">Secretário de Esportes</Label>
                  <Input
                    id="sportsSecretary"
                    value={formData.sportsSecretary}
                    onChange={(e) => setFormData(prev => ({ ...prev, sportsSecretary: e.target.value }))}
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
                
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
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
                  {editingMunicipality ? 'Atualizar' : 'Cadastrar'}
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
            <CardTitle className="text-sm font-medium">Total de Municípios</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{municipalities.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delegações</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {municipalities.reduce((acc, m) => acc + m.delegations, 0)}
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
              {municipalities.reduce((acc, m) => acc + m.athletes, 0)}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Eventos</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {municipalities.reduce((acc, m) => acc + m.events, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar municípios..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Municípios</CardTitle>
          <CardDescription>
            Gerencie os municípios cadastrados no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Estado/Região</TableHead>
                <TableHead>População</TableHead>
                <TableHead>Secretário de Esportes</TableHead>
                <TableHead>Delegações</TableHead>
                <TableHead>Status</TableHead>
                {canEdit && <TableHead>Ações</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMunicipalities.map((municipality) => (
                <TableRow key={municipality.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{municipality.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {municipality.area ? municipality.area.toLocaleString('pt-BR') : '0'} km²
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div>{municipality.state || 'N/A'}</div>
                      <div className="text-sm text-muted-foreground">{municipality.region || 'N/A'}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {municipality.population ? municipality.population.toLocaleString('pt-BR') : '0'}
                  </TableCell>
                  <TableCell>
                    <div>
                      <div>{municipality.sportsSecretary || 'Não informado'}</div>
                      <div className="text-sm text-muted-foreground">{municipality.phone || 'N/A'}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <span>{municipality.delegations || 0}</span>
                      <Badge variant="secondary">
                        {municipality.athletes || 0} atletas
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={(municipality.status === 'active' || municipality.status === 'Ativo') ? 'default' : 'secondary'}>
                      {(municipality.status === 'active' || municipality.status === 'Ativo') ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </TableCell>
                  {canEdit && (
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(municipality)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(municipality.id)}
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