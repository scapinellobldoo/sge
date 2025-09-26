import { useState } from 'react';
import { Plus, Search, Edit, Trash2, Calendar, MapPin, Users, Clock } from 'lucide-react';
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

interface Event {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  venue: string;
  address: string;
  municipality: string;
  organizer: string;
  contact: string;
  email: string;
  phone: string;
  sports: string[];
  categories: string[];
  maxParticipants: number;
  registeredParticipants: number;
  registrationStart: string;
  registrationEnd: string;
  status: 'draft' | 'published' | 'registration_open' | 'registration_closed' | 'ongoing' | 'finished' | 'cancelled';
  budget: number;
  createdAt: string;
  updatedAt: string;
}

interface EventsProps {
  currentUser: User;
}

const mockEvents: Event[] = [
  {
    id: '1',
    name: 'Campeonato Municipal de Futebol',
    description: 'Campeonato anual de futebol entre as equipes municipais',
    startDate: '2024-02-15',
    endDate: '2024-03-30',
    venue: 'Estádio Municipal',
    address: 'Av. dos Esportes, 123 - Centro',
    municipality: 'São Paulo',
    organizer: 'Secretaria de Esportes SP',
    contact: 'João Organizador',
    email: 'joao@esportes.sp.gov.br',
    phone: '(11) 3333-4444',
    sports: ['Futebol - Masculino'],
    categories: ['Master 60+ (60 anos ou mais)'],
    maxParticipants: 32,
    registeredParticipants: 24,
    registrationStart: '2024-01-01',
    registrationEnd: '2024-02-01',
    status: 'registration_open',
    budget: 150000,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-10'
  },
  {
    id: '2',
    name: 'Torneio de Vôlei Feminino',
    description: 'Competição de vôlei exclusiva para equipes femininas',
    startDate: '2024-01-20',
    endDate: '2024-01-25',
    venue: 'Ginásio Poliesportivo',
    address: 'Rua do Esporte, 456 - Vila Olimpia',
    municipality: 'Rio de Janeiro',
    organizer: 'Liga RJ de Vôlei',
    contact: 'Maria Organizadora',
    email: 'maria@ligavolei.rj.gov.br',
    phone: '(21) 2222-3333',
    sports: ['Voleibol - Feminino'],
    categories: ['Master 60+ (60 anos ou mais)'],
    maxParticipants: 16,
    registeredParticipants: 12,
    registrationStart: '2023-12-01',
    registrationEnd: '2024-01-10',
    status: 'ongoing',
    budget: 75000,
    createdAt: '2023-12-01',
    updatedAt: '2024-01-09'
  },
  {
    id: '3',
    name: 'Copa de Natação Master',
    description: 'Competição de natação para atletas master 60+',
    startDate: '2024-02-01',
    endDate: '2024-02-03',
    venue: 'Centro Aquático',
    address: 'Av. das Águas, 789 - Asa Norte',
    municipality: 'Brasília',
    organizer: 'Federação DF de Natação',
    contact: 'Pedro Aquático',
    email: 'pedro@natacao.df.gov.br',
    phone: '(61) 3333-2222',
    sports: ['Natação - 50m Livre', 'Natação - 100m Livre'],
    categories: ['Master 60+ (60 anos ou mais)'],
    maxParticipants: 100,
    registeredParticipants: 78,
    registrationStart: '2024-01-01',
    registrationEnd: '2024-01-25',
    status: 'registration_open',
    budget: 95000,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-08'
  }
];

export function Events({ currentUser }: EventsProps) {
  const [events, setEvents] = useState(mockEvents);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    venue: '',
    address: '',
    municipality: '',
    organizer: '',
    contact: '',
    email: '',
    phone: '',
    maxParticipants: '',
    registrationStart: '',
    registrationEnd: '',
    budget: '',
    status: 'draft' as const
  });

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.municipality.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.organizer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || event.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      startDate: '',
      endDate: '',
      venue: '',
      address: '',
      municipality: '',
      organizer: '',
      contact: '',
      email: '',
      phone: '',
      maxParticipants: '',
      registrationStart: '',
      registrationEnd: '',
      budget: '',
      status: 'draft'
    });
    setEditingEvent(null);
  };

  const handleSubmit = () => {
    if (editingEvent) {
      setEvents(prev => prev.map(event =>
        event.id === editingEvent.id
          ? {
              ...event,
              ...formData,
              maxParticipants: parseInt(formData.maxParticipants),
              budget: parseFloat(formData.budget),
              updatedAt: new Date().toISOString().split('T')[0]
            }
          : event
      ));
    } else {
      const newEvent: Event = {
        id: Date.now().toString(),
        ...formData,
        sports: [],
        categories: [],
        maxParticipants: parseInt(formData.maxParticipants),
        registeredParticipants: 0,
        budget: parseFloat(formData.budget),
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0]
      };
      setEvents(prev => [...prev, newEvent]);
    }
    
    setIsDialogOpen(false);
    resetForm();
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setFormData({
      name: event.name,
      description: event.description,
      startDate: event.startDate,
      endDate: event.endDate,
      venue: event.venue,
      address: event.address,
      municipality: event.municipality,
      organizer: event.organizer,
      contact: event.contact,
      email: event.email,
      phone: event.phone,
      maxParticipants: event.maxParticipants.toString(),
      registrationStart: event.registrationStart,
      registrationEnd: event.registrationEnd,
      budget: event.budget.toString(),
      status: event.status
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setEvents(prev => prev.filter(event => event.id !== id));
  };

  const canEdit = ['gestor', 'dirigente', 'operador'].includes(currentUser.role);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return <Badge variant="outline">Rascunho</Badge>;
      case 'published':
        return <Badge variant="secondary">Publicado</Badge>;
      case 'registration_open':
        return <Badge className="bg-green-500">Inscrições Abertas</Badge>;
      case 'registration_closed':
        return <Badge variant="secondary">Inscrições Fechadas</Badge>;
      case 'ongoing':
        return <Badge className="bg-blue-500">Em Andamento</Badge>;
      case 'finished':
        return <Badge variant="default">Finalizado</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1>Eventos</h1>
          <p className="text-muted-foreground">
            Gerenciar eventos esportivos e competições
          </p>
        </div>
        {canEdit && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Novo Evento
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingEvent ? 'Editar Evento' : 'Novo Evento'}
                </DialogTitle>
                <DialogDescription>
                  {editingEvent 
                    ? 'Atualize as informações do evento.' 
                    : 'Crie um novo evento esportivo.'
                  }
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="name">Nome do Evento</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
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
                  <Label htmlFor="startDate">Data de Início</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="endDate">Data de Fim</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="venue">Local</Label>
                  <Input
                    id="venue"
                    value={formData.venue}
                    onChange={(e) => setFormData(prev => ({ ...prev, venue: e.target.value }))}
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
                
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="address">Endereço</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="organizer">Organizador</Label>
                  <Input
                    id="organizer"
                    value={formData.organizer}
                    onChange={(e) => setFormData(prev => ({ ...prev, organizer: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contact">Contato</Label>
                  <Input
                    id="contact"
                    value={formData.contact}
                    onChange={(e) => setFormData(prev => ({ ...prev, contact: e.target.value }))}
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
                  <Label htmlFor="maxParticipants">Máximo Participantes</Label>
                  <Input
                    id="maxParticipants"
                    type="number"
                    value={formData.maxParticipants}
                    onChange={(e) => setFormData(prev => ({ ...prev, maxParticipants: e.target.value }))}
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
                
                <div className="space-y-2">
                  <Label htmlFor="registrationStart">Início Inscrições</Label>
                  <Input
                    id="registrationStart"
                    type="date"
                    value={formData.registrationStart}
                    onChange={(e) => setFormData(prev => ({ ...prev, registrationStart: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="registrationEnd">Fim Inscrições</Label>
                  <Input
                    id="registrationEnd"
                    type="date"
                    value={formData.registrationEnd}
                    onChange={(e) => setFormData(prev => ({ ...prev, registrationEnd: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value: typeof formData.status) => setFormData(prev => ({ ...prev, status: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Rascunho</SelectItem>
                      <SelectItem value="published">Publicado</SelectItem>
                      <SelectItem value="registration_open">Inscrições Abertas</SelectItem>
                      <SelectItem value="registration_closed">Inscrições Fechadas</SelectItem>
                      <SelectItem value="ongoing">Em Andamento</SelectItem>
                      <SelectItem value="finished">Finalizado</SelectItem>
                      <SelectItem value="cancelled">Cancelado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSubmit}>
                  {editingEvent ? 'Atualizar' : 'Criar'}
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
            <CardTitle className="text-sm font-medium">Total de Eventos</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{events.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Andamento</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {events.filter(e => e.status === 'ongoing').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inscrições Abertas</CardTitle>
            <Users className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {events.filter(e => e.status === 'registration_open').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Participantes Total</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {events.reduce((acc, e) => acc + e.registeredParticipants, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar eventos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="draft">Rascunho</SelectItem>
            <SelectItem value="published">Publicado</SelectItem>
            <SelectItem value="registration_open">Inscrições Abertas</SelectItem>
            <SelectItem value="registration_closed">Inscrições Fechadas</SelectItem>
            <SelectItem value="ongoing">Em Andamento</SelectItem>
            <SelectItem value="finished">Finalizado</SelectItem>
            <SelectItem value="cancelled">Cancelado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Eventos</CardTitle>
          <CardDescription>
            Gerencie os eventos cadastrados no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Evento</TableHead>
                <TableHead>Data/Local</TableHead>
                <TableHead>Organizador</TableHead>
                <TableHead>Participantes</TableHead>
                <TableHead>Status</TableHead>
                {canEdit && <TableHead>Ações</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEvents.map((event) => (
                <TableRow key={event.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{event.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {event.municipality}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="text-sm">
                        {new Date(event.startDate).toLocaleDateString('pt-BR')} - {new Date(event.endDate).toLocaleDateString('pt-BR')}
                      </div>
                      <div className="text-sm text-muted-foreground">{event.venue}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="text-sm">{event.organizer}</div>
                      <div className="text-sm text-muted-foreground">{event.contact}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{event.registeredParticipants}/{event.maxParticipants}</div>
                      <div className="text-muted-foreground">
                        {Math.round((event.registeredParticipants / event.maxParticipants) * 100)}% ocupado
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(event.status)}
                  </TableCell>
                  {canEdit && (
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(event)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(event.id)}
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