import { useState } from 'react';
import { Plus, Search, Edit, Trash2, Users, Trophy, Calendar, Medal } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import type { User } from '../App';

interface Athlete {
  id: string;
  name: string;
  cpf: string;
  rg: string;
  birthDate: string;
  gender: 'M' | 'F';
  municipality: string;
  delegation: string;
  team: string;
  position: string;
  category: string;
  sports: string[];
  email: string;
  phone: string;
  emergencyContact: string;
  emergencyPhone: string;
  medicalInfo: string;
  status: 'active' | 'inactive' | 'suspended';
  registrations: number;
  competitions: number;
  medals: number;
  photo?: string;
  createdAt: string;
  updatedAt: string;
}

interface AthletesProps {
  currentUser: User;
}

const mockAthletes: Athlete[] = [
  {
    id: '1',
    name: 'João Silva Santos',
    cpf: '123.456.789-01',
    rg: '12.345.678-9',
    birthDate: '1960-03-15',
    gender: 'M',
    municipality: 'São Paulo',
    delegation: 'Delegação SP Centro',
    team: 'Corinthians FC Master',
    position: 'Atacante',
    category: 'Master 60+ (60 anos ou mais)',
    sports: ['Futebol', 'Futsal'],
    email: 'joao.silva@email.com',
    phone: '(11) 99999-1234',
    emergencyContact: 'Maria Silva',
    emergencyPhone: '(11) 99999-5678',
    medicalInfo: 'Controle de pressão arterial',
    status: 'active',
    registrations: 12,
    competitions: 8,
    medals: 3,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-10'
  },
  {
    id: '2',
    name: 'Ana Paula Costa',
    cpf: '987.654.321-02',
    rg: '98.765.432-1',
    birthDate: '1958-07-22',
    gender: 'F',
    municipality: 'Rio de Janeiro',
    delegation: 'Delegação RJ Zona Sul',
    team: 'Flamengo Vôlei Master',
    position: 'Levantadora',
    category: 'Master 60+ (60 anos ou mais)',
    sports: ['Voleibol - Feminino', 'Voleibol de Praia - Feminino'],
    email: 'ana.costa@email.com',
    phone: '(21) 99999-2468',
    emergencyContact: 'Carlos Costa',
    emergencyPhone: '(21) 99999-1357',
    medicalInfo: 'Alergia a ibuprofeno',
    status: 'active',
    registrations: 8,
    competitions: 6,
    medals: 5,
    createdAt: '2024-01-02',
    updatedAt: '2024-01-09'
  },
  {
    id: '3',
    name: 'Pedro Oliveira Lima',
    cpf: '456.789.123-03',
    rg: '45.678.912-3',
    birthDate: '1962-11-08',
    gender: 'M',
    municipality: 'Brasília',
    delegation: 'Delegação DF',
    team: 'Natação Brasília Master',
    position: 'Nadador',
    category: 'Master 60+ (60 anos ou mais)',
    sports: ['Natação - 50m Livre', 'Natação - 100m Livre'],
    email: 'pedro.lima@email.com',
    phone: '(61) 99999-3691',
    emergencyContact: 'Lucia Lima',
    emergencyPhone: '(61) 99999-2580',
    medicalInfo: 'Asma controlada',
    status: 'active',
    registrations: 15,
    competitions: 12,
    medals: 8,
    createdAt: '2024-01-03',
    updatedAt: '2024-01-08'
  },
  {
    id: '4',
    name: 'Mariana Santos Ferreira',
    cpf: '789.123.456-04',
    rg: '78.912.345-6',
    birthDate: '1959-04-30',
    gender: 'F',
    municipality: 'Salvador',
    delegation: 'Delegação BA',
    team: 'Basquete Salvador Master',
    position: 'Armadora',
    category: 'Master 60+ (60 anos ou mais)',
    sports: ['Basquetebol - Feminino'],
    email: 'mariana.ferreira@email.com',
    phone: '(71) 99999-4815',
    emergencyContact: 'Roberto Ferreira',
    emergencyPhone: '(71) 99999-1627',
    medicalInfo: 'Nenhuma restrição médica',
    status: 'active',
    registrations: 10,
    competitions: 7,
    medals: 2,
    createdAt: '2024-01-04',
    updatedAt: '2024-01-07'
  }
];

export function Athletes({ currentUser }: AthletesProps) {
  const [athletes, setAthletes] = useState(mockAthletes);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSport, setFilterSport] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAthlete, setEditingAthlete] = useState<Athlete | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    cpf: '',
    rg: '',
    birthDate: '',
    gender: 'M' as const,
    municipality: '',
    delegation: '',
    team: '',
    position: '',
    category: '',
    sports: [] as string[],
    email: '',
    phone: '',
    emergencyContact: '',
    emergencyPhone: '',
    medicalInfo: '',
    status: 'active' as const
  });

  const filteredAthletes = athletes.filter(athlete => {
    const matchesSearch = athlete.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         athlete.cpf.includes(searchTerm) ||
                         athlete.team.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSport = filterSport === 'all' || athlete.sports.includes(filterSport);
    const matchesCategory = filterCategory === 'all' || athlete.category === filterCategory;
    
    return matchesSearch && matchesSport && matchesCategory;
  });

  const allSports = Array.from(new Set(athletes.flatMap(athlete => athlete.sports)));
  const allCategories = Array.from(new Set(athletes.map(athlete => athlete.category)));

  const resetForm = () => {
    setFormData({
      name: '',
      cpf: '',
      rg: '',
      birthDate: '',
      gender: 'M',
      municipality: '',
      delegation: '',
      team: '',
      position: '',
      category: '',
      sports: [],
      email: '',
      phone: '',
      emergencyContact: '',
      emergencyPhone: '',
      medicalInfo: '',
      status: 'active'
    });
    setEditingAthlete(null);
  };

  const handleSubmit = () => {
    // Validação de idade - deve ter 60 anos ou mais
    const birthDate = new Date(formData.birthDate);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    if (age < 60) {
      alert('Este sistema aceita apenas atletas com 60 anos ou mais (categoria Master 60+).');
      return;
    }

    if (editingAthlete) {
      setAthletes(prev => prev.map(athlete =>
        athlete.id === editingAthlete.id
          ? {
              ...athlete,
              ...formData,
              category: 'Master 60+ (60 anos ou mais)', // Força a categoria correta
              updatedAt: new Date().toISOString().split('T')[0]
            }
          : athlete
      ));
    } else {
      const newAthlete: Athlete = {
        id: Date.now().toString(),
        ...formData,
        category: 'Master 60+ (60 anos ou mais)', // Força a categoria correta
        registrations: 0,
        competitions: 0,
        medals: 0,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0]
      };
      setAthletes(prev => [...prev, newAthlete]);
    }
    
    setIsDialogOpen(false);
    resetForm();
  };

  const handleEdit = (athlete: Athlete) => {
    setEditingAthlete(athlete);
    setFormData({
      name: athlete.name,
      cpf: athlete.cpf,
      rg: athlete.rg,
      birthDate: athlete.birthDate,
      gender: athlete.gender,
      municipality: athlete.municipality,
      delegation: athlete.delegation,
      team: athlete.team,
      position: athlete.position,
      category: athlete.category,
      sports: athlete.sports,
      email: athlete.email,
      phone: athlete.phone,
      emergencyContact: athlete.emergencyContact,
      emergencyPhone: athlete.emergencyPhone,
      medicalInfo: athlete.medicalInfo,
      status: athlete.status
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setAthletes(prev => prev.filter(athlete => athlete.id !== id));
  };

  const canEdit = ['gestor', 'dirigente', 'operador'].includes(currentUser.role);
  const canView = currentUser.role === 'atleta' ? 
    athletes.filter(a => a.email === currentUser.email) : 
    athletes;

  const displayAthletes = currentUser.role === 'atleta' ? canView : filteredAthletes;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1>Atletas</h1>
          <p className="text-muted-foreground">
            Gerenciar atletas cadastrados no sistema
          </p>
        </div>
        {canEdit && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Novo Atleta
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingAthlete ? 'Editar Atleta' : 'Novo Atleta'}
                </DialogTitle>
                <DialogDescription>
                  {editingAthlete 
                    ? 'Atualize as informações do atleta.' 
                    : 'Adicione um novo atleta ao sistema.'
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
                  <Label htmlFor="cpf">CPF</Label>
                  <Input
                    id="cpf"
                    value={formData.cpf}
                    onChange={(e) => setFormData(prev => ({ ...prev, cpf: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="rg">RG</Label>
                  <Input
                    id="rg"
                    value={formData.rg}
                    onChange={(e) => setFormData(prev => ({ ...prev, rg: e.target.value }))}
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
                  <Label htmlFor="gender">Gênero</Label>
                  <Select value={formData.gender} onValueChange={(value: 'M' | 'F') => setFormData(prev => ({ ...prev, gender: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="M">Masculino</SelectItem>
                      <SelectItem value="F">Feminino</SelectItem>
                    </SelectContent>
                  </Select>
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
                  <Label htmlFor="delegation">Delegação</Label>
                  <Input
                    id="delegation"
                    value={formData.delegation}
                    onChange={(e) => setFormData(prev => ({ ...prev, delegation: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="team">Equipe</Label>
                  <Input
                    id="team"
                    value={formData.team}
                    onChange={(e) => setFormData(prev => ({ ...prev, team: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="position">Posição</Label>
                  <Input
                    id="position"
                    value={formData.position}
                    onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Categoria</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Master 60+ (60 anos ou mais)">Master 60+ (60 anos ou mais)</SelectItem>
                    </SelectContent>
                  </Select>
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
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="emergencyContact">Contato de Emergência</Label>
                  <Input
                    id="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={(e) => setFormData(prev => ({ ...prev, emergencyContact: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="emergencyPhone">Telefone de Emergência</Label>
                  <Input
                    id="emergencyPhone"
                    value={formData.emergencyPhone}
                    onChange={(e) => setFormData(prev => ({ ...prev, emergencyPhone: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value: 'active' | 'inactive' | 'suspended') => setFormData(prev => ({ ...prev, status: value }))}>
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
                
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="medicalInfo">Informações Médicas</Label>
                  <Input
                    id="medicalInfo"
                    value={formData.medicalInfo}
                    onChange={(e) => setFormData(prev => ({ ...prev, medicalInfo: e.target.value }))}
                    placeholder="Alergias, restrições médicas, medicamentos..."
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSubmit}>
                  {editingAthlete ? 'Atualizar' : 'Cadastrar'}
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
            <CardTitle className="text-sm font-medium">Total de Atletas</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{athletes.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Competições</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {athletes.reduce((acc, a) => acc + a.competitions, 0)}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inscrições</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {athletes.reduce((acc, a) => acc + a.registrations, 0)}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Medalhas</CardTitle>
            <Medal className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {athletes.reduce((acc, a) => acc + a.medals, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar atletas..."
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
        
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            {allCategories.map(category => (
              <SelectItem key={category} value={category}>{category}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Atletas</CardTitle>
          <CardDescription>
            Gerencie os atletas cadastrados no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Atleta</TableHead>
                <TableHead>Equipe/Posição</TableHead>
                <TableHead>Modalidades</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Performance</TableHead>
                <TableHead>Status</TableHead>
                {canEdit && <TableHead>Ações</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayAthletes.map((athlete) => (
                <TableRow key={athlete.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={athlete.photo} />
                        <AvatarFallback>
                          {athlete.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{athlete.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {athlete.municipality}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{athlete.team}</div>
                      <div className="text-sm text-muted-foreground">{athlete.position}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {athlete.sports.map(sport => (
                        <Badge key={sport} variant="secondary" className="text-xs">
                          {sport}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{athlete.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{athlete.competitions} competições</div>
                      <div className="text-muted-foreground">
                        {athlete.medals} medalhas
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      athlete.status === 'active' ? 'default' :
                      athlete.status === 'inactive' ? 'secondary' :
                      'destructive'
                    }>
                      {athlete.status === 'active' ? 'Ativo' :
                       athlete.status === 'inactive' ? 'Inativo' : 'Suspenso'}
                    </Badge>
                  </TableCell>
                  {canEdit && (
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(athlete)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(athlete.id)}
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