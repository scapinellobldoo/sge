import { useState } from 'react';
import { Plus, Search, Edit, Trash2, Badge, User, Calendar, Award } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge as UIBadge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import type { User } from '../App';

interface Official {
  id: string;
  name: string;
  role: 'referee' | 'judge' | 'timekeeper' | 'coordinator';
  sport: string;
  level: 'municipal' | 'estadual' | 'nacional' | 'internacional';
  license: string;
  licenseExpiry: string;
  email: string;
  phone: string;
  municipality: string;
  birthDate: string;
  experience: number; // years
  eventsManaged: number;
  rating: number;
  specializations: string[];
  status: 'active' | 'inactive' | 'suspended';
  availability: 'available' | 'busy' | 'unavailable';
  photo?: string;
  createdAt: string;
  updatedAt: string;
}

interface OfficialsProps {
  currentUser: User;
}

const mockOfficials: Official[] = [
  {
    id: '1',
    name: 'João Arbitro Silva',
    role: 'referee',
    sport: 'Futebol',
    level: 'estadual',
    license: 'CBF-SP-001234',
    licenseExpiry: '2025-12-31',
    email: 'joao.arbitro@cbf.com.br',
    phone: '(11) 99999-0001',
    municipality: 'São Paulo',
    birthDate: '1980-05-15',
    experience: 12,
    eventsManaged: 45,
    rating: 4.8,
    specializations: ['Futebol de Campo', 'Futsal'],
    status: 'active',
    availability: 'available',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-10'
  },
  {
    id: '2',
    name: 'Maria Juiza Santos',
    role: 'judge',
    sport: 'Natação',
    level: 'nacional',
    license: 'CBDA-001567',
    licenseExpiry: '2026-06-30',
    email: 'maria.juiza@cbda.org.br',
    phone: '(21) 88888-0002',
    municipality: 'Rio de Janeiro',
    birthDate: '1975-08-22',
    experience: 18,
    eventsManaged: 78,
    rating: 4.9,
    specializations: ['Natação', 'Polo Aquático'],
    status: 'active',
    availability: 'busy',
    createdAt: '2024-01-02',
    updatedAt: '2024-01-09'
  },
  {
    id: '3',
    name: 'Ana Arbitro Costa',
    role: 'referee',
    sport: 'Vôlei',
    level: 'estadual',
    license: 'CBV-RJ-002345',
    licenseExpiry: '2025-03-15',
    email: 'ana.arbitro@cbv.com.br',
    phone: '(21) 77777-0003',
    municipality: 'Rio de Janeiro',
    birthDate: '1985-11-10',
    experience: 8,
    eventsManaged: 32,
    rating: 4.6,
    specializations: ['Vôlei Indoor', 'Vôlei de Praia'],
    status: 'active',
    availability: 'available',
    createdAt: '2024-01-03',
    updatedAt: '2024-01-08'
  },
  {
    id: '4',
    name: 'Roberto Cronometrista',
    role: 'timekeeper',
    sport: 'Basquete',
    level: 'municipal',
    license: 'CBB-DF-003456',
    licenseExpiry: '2024-12-31',
    email: 'roberto.tempo@cbb.com.br',
    phone: '(61) 66666-0004',
    municipality: 'Brasília',
    birthDate: '1990-02-28',
    experience: 5,
    eventsManaged: 28,
    rating: 4.4,
    specializations: ['Basquete', 'Streetball'],
    status: 'active',
    availability: 'available',
    createdAt: '2024-01-04',
    updatedAt: '2024-01-07'
  }
];

export function Officials({ currentUser }: OfficialsProps) {
  const [officials, setOfficials] = useState(mockOfficials);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSport, setFilterSport] = useState('all');
  const [filterRole, setFilterRole] = useState('all');
  const [filterLevel, setFilterLevel] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingOfficial, setEditingOfficial] = useState<Official | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    role: 'referee' as const,
    sport: '',
    level: 'municipal' as const,
    license: '',
    licenseExpiry: '',
    email: '',
    phone: '',
    municipality: '',
    birthDate: '',
    experience: '',
    specializations: [] as string[],
    status: 'active' as const,
    availability: 'available' as const
  });

  const filteredOfficials = officials.filter(official => {
    const matchesSearch = official.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         official.license.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         official.municipality.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSport = filterSport === 'all' || official.sport === filterSport;
    const matchesRole = filterRole === 'all' || official.role === filterRole;
    const matchesLevel = filterLevel === 'all' || official.level === filterLevel;
    
    return matchesSearch && matchesSport && matchesRole && matchesLevel;
  });

  const allSports = Array.from(new Set(officials.map(official => official.sport)));

  const resetForm = () => {
    setFormData({
      name: '',
      role: 'referee',
      sport: '',
      level: 'municipal',
      license: '',
      licenseExpiry: '',
      email: '',
      phone: '',
      municipality: '',
      birthDate: '',
      experience: '',
      specializations: [],
      status: 'active',
      availability: 'available'
    });
    setEditingOfficial(null);
  };

  const handleSubmit = () => {
    if (editingOfficial) {
      setOfficials(prev => prev.map(official =>
        official.id === editingOfficial.id
          ? {
              ...official,
              ...formData,
              experience: parseInt(formData.experience),
              updatedAt: new Date().toISOString().split('T')[0]
            }
          : official
      ));
    } else {
      const newOfficial: Official = {
        id: Date.now().toString(),
        ...formData,
        experience: parseInt(formData.experience),
        eventsManaged: 0,
        rating: 4.0,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0]
      };
      setOfficials(prev => [...prev, newOfficial]);
    }
    
    setIsDialogOpen(false);
    resetForm();
  };

  const handleEdit = (official: Official) => {
    setEditingOfficial(official);
    setFormData({
      name: official.name,
      role: official.role,
      sport: official.sport,
      level: official.level,
      license: official.license,
      licenseExpiry: official.licenseExpiry,
      email: official.email,
      phone: official.phone,
      municipality: official.municipality,
      birthDate: official.birthDate,
      experience: official.experience.toString(),
      specializations: official.specializations,
      status: official.status,
      availability: official.availability
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setOfficials(prev => prev.filter(official => official.id !== id));
  };

  const canEdit = ['gestor', 'arbitro', 'operador'].includes(currentUser.role);

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'referee':
        return 'Árbitro';
      case 'judge':
        return 'Juiz';
      case 'timekeeper':
        return 'Cronometrista';
      case 'coordinator':
        return 'Coordenador';
      default:
        return role;
    }
  };

  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'municipal':
        return 'Municipal';
      case 'estadual':
        return 'Estadual';
      case 'nacional':
        return 'Nacional';
      case 'internacional':
        return 'Internacional';
      default:
        return level;
    }
  };

  const getAvailabilityBadge = (availability: string) => {
    switch (availability) {
      case 'available':
        return <UIBadge className="bg-green-500">Disponível</UIBadge>;
      case 'busy':
        return <UIBadge className="bg-yellow-500">Ocupado</UIBadge>;
      case 'unavailable':
        return <UIBadge variant="destructive">Indisponível</UIBadge>;
      default:
        return <UIBadge variant="outline">{availability}</UIBadge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1>Oficiais</h1>
          <p className="text-muted-foreground">
            Gerenciar árbitros, juízes e oficiais de competições
          </p>
        </div>
        {canEdit && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Novo Oficial
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingOfficial ? 'Editar Oficial' : 'Novo Oficial'}
                </DialogTitle>
                <DialogDescription>
                  {editingOfficial 
                    ? 'Atualize as informações do oficial.' 
                    : 'Adicione um novo oficial ao sistema.'
                  }
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="role">Função</Label>
                  <Select value={formData.role} onValueChange={(value: typeof formData.role) => setFormData(prev => ({ ...prev, role: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="referee">Árbitro</SelectItem>
                      <SelectItem value="judge">Juiz</SelectItem>
                      <SelectItem value="timekeeper">Cronometrista</SelectItem>
                      <SelectItem value="coordinator">Coordenador</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="sport">Modalidade</Label>
                  <Select value={formData.sport} onValueChange={(value) => setFormData(prev => ({ ...prev, sport: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a modalidade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Futebol">Futebol</SelectItem>
                      <SelectItem value="Vôlei">Vôlei</SelectItem>
                      <SelectItem value="Basquete">Basquete</SelectItem>
                      <SelectItem value="Natação">Natação</SelectItem>
                      <SelectItem value="Atletismo">Atletismo</SelectItem>
                      <SelectItem value="Tênis">Tênis</SelectItem>
                      <SelectItem value="Judô">Judô</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="level">Nível</Label>
                  <Select value={formData.level} onValueChange={(value: typeof formData.level) => setFormData(prev => ({ ...prev, level: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="municipal">Municipal</SelectItem>
                      <SelectItem value="estadual">Estadual</SelectItem>
                      <SelectItem value="nacional">Nacional</SelectItem>
                      <SelectItem value="internacional">Internacional</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="license">Licença</Label>
                  <Input
                    id="license"
                    value={formData.license}
                    onChange={(e) => setFormData(prev => ({ ...prev, license: e.target.value }))}
                    placeholder="Ex: CBF-SP-001234"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="licenseExpiry">Validade da Licença</Label>
                  <Input
                    id="licenseExpiry"
                    type="date"
                    value={formData.licenseExpiry}
                    onChange={(e) => setFormData(prev => ({ ...prev, licenseExpiry: e.target.value }))}
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
                  <Label htmlFor="municipality">Município</Label>
                  <Input
                    id="municipality"
                    value={formData.municipality}
                    onChange={(e) => setFormData(prev => ({ ...prev, municipality: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="birthDate">Data de Nascimento</Label>
                  <Input
                    id="birthDate"
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, birthDate: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="experience">Experiência (anos)</Label>
                  <Input
                    id="experience"
                    type="number"
                    value={formData.experience}
                    onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value: typeof formData.status) => setFormData(prev => ({ ...prev, status: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Ativo</SelectItem>
                      <SelectItem value="inactive">Inativo</SelectItem>
                      <SelectItem value="suspended">Suspenso</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="availability">Disponibilidade</Label>
                  <Select value={formData.availability} onValueChange={(value: typeof formData.availability) => setFormData(prev => ({ ...prev, availability: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Disponível</SelectItem>
                      <SelectItem value="busy">Ocupado</SelectItem>
                      <SelectItem value="unavailable">Indisponível</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSubmit}>
                  {editingOfficial ? 'Atualizar' : 'Cadastrar'}
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
            <CardTitle className="text-sm font-medium">Total de Oficiais</CardTitle>
            <Badge className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{officials.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disponíveis</CardTitle>
            <User className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {officials.filter(o => o.availability === 'available').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Eventos Gerenciados</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {officials.reduce((acc, o) => acc + o.eventsManaged, 0)}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avaliação Média</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(officials.reduce((acc, o) => acc + o.rating, 0) / officials.length).toFixed(1)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar oficiais..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={filterSport} onValueChange={setFilterSport}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Modalidade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            {allSports.map(sport => (
              <SelectItem key={sport} value={sport}>{sport}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={filterRole} onValueChange={setFilterRole}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Função" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            <SelectItem value="referee">Árbitro</SelectItem>
            <SelectItem value="judge">Juiz</SelectItem>
            <SelectItem value="timekeeper">Cronometrista</SelectItem>
            <SelectItem value="coordinator">Coordenador</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={filterLevel} onValueChange={setFilterLevel}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Nível" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="municipal">Municipal</SelectItem>
            <SelectItem value="estadual">Estadual</SelectItem>
            <SelectItem value="nacional">Nacional</SelectItem>
            <SelectItem value="internacional">Internacional</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Oficiais</CardTitle>
          <CardDescription>
            Gerencie os oficiais cadastrados no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Oficial</TableHead>
                <TableHead>Função/Modalidade</TableHead>
                <TableHead>Licença/Nível</TableHead>
                <TableHead>Experiência</TableHead>
                <TableHead>Disponibilidade</TableHead>
                <TableHead>Avaliação</TableHead>
                {canEdit && <TableHead>Ações</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOfficials.map((official) => (
                <TableRow key={official.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={official.photo} />
                        <AvatarFallback>
                          {official.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{official.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {official.municipality}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <UIBadge variant="outline">{getRoleBadge(official.role)}</UIBadge>
                      <div className="text-sm text-muted-foreground mt-1">{official.sport}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="text-sm font-medium">{official.license}</div>
                      <UIBadge variant="secondary" className="text-xs">
                        {getLevelBadge(official.level)}
                      </UIBadge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{official.experience} anos</div>
                      <div className="text-muted-foreground">
                        {official.eventsManaged} eventos
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getAvailabilityBadge(official.availability)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Award className="h-4 w-4 text-yellow-500" />
                      <span>{official.rating}</span>
                    </div>
                  </TableCell>
                  {canEdit && (
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(official)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(official.id)}
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