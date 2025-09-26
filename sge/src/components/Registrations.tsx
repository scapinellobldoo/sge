import { useState } from "react";
import {
  Plus,
  Search,
  Check,
  X,
  Clock,
  FileText,
  User,
  Calendar,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./ui/tabs";
import type { User } from "../App";

interface Registration {
  id: string;
  athlete: string;
  team: string;
  event: string;
  competition: string;
  category: string;
  registrationDate: string;
  status: "pending" | "approved" | "rejected" | "homologated";
  documents: {
    identity: boolean;
    medical: boolean;
    authorization: boolean;
    photo: boolean;
  };
  notes: string;
  approvedBy?: string;
  approvedDate?: string;
  rejectionReason?: string;
  homologatedBy?: string;
  homologatedDate?: string;
  municipality: string;
  delegation: string;
  createdAt: string;
  updatedAt: string;
}

interface RegistrationsProps {
  currentUser: User;
}

const mockRegistrations: Registration[] = [
  {
    id: "1",
    athlete: "João Silva Santos",
    team: "São Paulo FC",
    event: "Campeonato Municipal de Futebol",
    competition: "Final Masculino Sub-20",
    category: "Sub-20",
    registrationDate: "2024-01-05",
    status: "approved",
    documents: {
      identity: true,
      medical: true,
      authorization: true,
      photo: true,
    },
    notes: "Documentação completa",
    approvedBy: "Carlos Silva",
    approvedDate: "2024-01-10",
    municipality: "São Paulo",
    delegation: "Delegação SP Centro",
    createdAt: "2024-01-05",
    updatedAt: "2024-01-10",
  },
  {
    id: "2",
    athlete: "Ana Paula Costa",
    team: "Flamengo Vôlei Master",
    event: "Torneio de Vôlei Feminino Master",
    competition: "Torneio Feminino Master - Chave A",
    category: "Master 60+ (60 anos ou mais)",
    registrationDate: "2024-01-03",
    status: "pending",
    documents: {
      identity: true,
      medical: true,
      authorization: false,
      photo: true,
    },
    notes: "Aguardando autorização médica",
    municipality: "Rio de Janeiro",
    delegation: "Delegação RJ Zona Sul",
    createdAt: "2024-01-03",
    updatedAt: "2024-01-09",
  },
  {
    id: "3",
    athlete: "Pedro Oliveira Lima",
    team: "Natação Brasília Master",
    event: "Copa de Natação Master",
    competition: "100m Livre Masculino Master",
    category: "Master 60+ (60 anos ou mais)",
    registrationDate: "2024-01-08",
    status: "homologated",
    documents: {
      identity: true,
      medical: true,
      authorization: true,
      photo: true,
    },
    notes: "Atleta aprovado e homologado",
    approvedBy: "Pedro Oliveira",
    approvedDate: "2024-01-09",
    homologatedBy: "Maria Juiza Santos",
    homologatedDate: "2024-01-10",
    municipality: "Brasília",
    delegation: "Delegação DF",
    createdAt: "2024-01-08",
    updatedAt: "2024-01-10",
  },
  {
    id: "4",
    athlete: "Mariana Santos Ferreira",
    team: "Basquete Salvador Master",
    event: "Liga Regional de Basquete Master",
    competition: "Feminino Master 60+",
    category: "Master 60+ (60 anos ou mais)",
    registrationDate: "2024-01-07",
    status: "rejected",
    documents: {
      identity: true,
      medical: false,
      authorization: true,
      photo: true,
    },
    notes: "Exame médico vencido",
    rejectionReason:
      "Documentação médica não atende aos requisitos",
    municipality: "Salvador",
    delegation: "Delegação BA Salvador",
    createdAt: "2024-01-07",
    updatedAt: "2024-01-08",
  },
];

export function Registrations({
  currentUser,
}: RegistrationsProps) {
  const [registrations, setRegistrations] = useState(
    mockRegistrations,
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterEvent, setFilterEvent] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRegistration, setSelectedRegistration] =
    useState<Registration | null>(null);
  const [actionType, setActionType] = useState<
    "approve" | "reject" | "homologate" | null
  >(null);
  const [actionNotes, setActionNotes] = useState("");

  const filteredRegistrations = registrations.filter(
    (registration) => {
      const matchesSearch =
        registration.athlete
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        registration.team
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        registration.municipality
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      const matchesStatus =
        filterStatus === "all" ||
        registration.status === filterStatus;
      const matchesEvent =
        filterEvent === "all" ||
        registration.event === filterEvent;

      return matchesSearch && matchesStatus && matchesEvent;
    },
  );

  const pendingRegistrations = registrations.filter(
    (r) => r.status === "pending",
  );
  const approvedRegistrations = registrations.filter(
    (r) => r.status === "approved",
  );
  const homologatedRegistrations = registrations.filter(
    (r) => r.status === "homologated",
  );
  const rejectedRegistrations = registrations.filter(
    (r) => r.status === "rejected",
  );

  const allEvents = Array.from(
    new Set(
      registrations.map((registration) => registration.event),
    ),
  );

  const canApprove = ["gestor", "dirigente"].includes(
    currentUser.role,
  );
  const canHomologate = ["gestor", "arbitro"].includes(
    currentUser.role,
  );
  const canView =
    currentUser.role === "atleta"
      ? registrations.filter(
          (r) => r.athlete === currentUser.name,
        )
      : registrations;

  const handleAction = (
    registration: Registration,
    action: "approve" | "reject" | "homologate",
  ) => {
    setSelectedRegistration(registration);
    setActionType(action);
    setActionNotes("");
    setIsDialogOpen(true);
  };

  const confirmAction = () => {
    if (!selectedRegistration || !actionType) return;

    setRegistrations((prev) =>
      prev.map((registration) =>
        registration.id === selectedRegistration.id
          ? {
              ...registration,
              status:
                actionType === "approve"
                  ? "approved"
                  : actionType === "reject"
                    ? "rejected"
                    : "homologated",
              notes: actionNotes || registration.notes,
              approvedBy:
                actionType === "approve"
                  ? currentUser.name
                  : registration.approvedBy,
              approvedDate:
                actionType === "approve"
                  ? new Date().toISOString().split("T")[0]
                  : registration.approvedDate,
              rejectionReason:
                actionType === "reject"
                  ? actionNotes
                  : registration.rejectionReason,
              homologatedBy:
                actionType === "homologate"
                  ? currentUser.name
                  : registration.homologatedBy,
              homologatedDate:
                actionType === "homologate"
                  ? new Date().toISOString().split("T")[0]
                  : registration.homologatedDate,
              updatedAt: new Date().toISOString().split("T")[0],
            }
          : registration,
      ),
    );

    setIsDialogOpen(false);
    setSelectedRegistration(null);
    setActionType(null);
    setActionNotes("");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge className="bg-yellow-500">Pendente</Badge>
        );
      case "approved":
        return <Badge className="bg-green-500">Aprovada</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejeitada</Badge>;
      case "homologated":
        return (
          <Badge className="bg-blue-500">Homologada</Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getDocumentStatus = (
    documents: Registration["documents"],
  ) => {
    const total = Object.keys(documents).length;
    const completed =
      Object.values(documents).filter(Boolean).length;
    const percentage = (completed / total) * 100;

    return {
      completed,
      total,
      percentage,
      color:
        percentage === 100
          ? "text-green-600"
          : percentage >= 75
            ? "text-yellow-600"
            : "text-red-600",
    };
  };

  const getActionTitle = () => {
    switch (actionType) {
      case "approve":
        return "Aprovar Inscrição";
      case "reject":
        return "Rejeitar Inscrição";
      case "homologate":
        return "Homologar Inscrição";
      default:
        return "";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1>Inscrições</h1>
          <p className="text-muted-foreground">
            Gerenciar inscrições de atletas em eventos e
            competições
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Inscrições
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {registrations.length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pendentes
            </CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {pendingRegistrations.length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Aprovadas
            </CardTitle>
            <Check className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {approvedRegistrations.length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Homologadas
            </CardTitle>
            <User className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {homologatedRegistrations.length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">Todas</TabsTrigger>
          <TabsTrigger value="pending">
            Pendentes ({pendingRegistrations.length})
          </TabsTrigger>
          <TabsTrigger value="approved">Aprovadas</TabsTrigger>
          <TabsTrigger value="homologated">
            Homologadas
          </TabsTrigger>
          <TabsTrigger value="rejected">Rejeitadas</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {/* Filters */}
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar inscrições..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select
              value={filterStatus}
              onValueChange={setFilterStatus}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="pending">
                  Pendente
                </SelectItem>
                <SelectItem value="approved">
                  Aprovada
                </SelectItem>
                <SelectItem value="rejected">
                  Rejeitada
                </SelectItem>
                <SelectItem value="homologated">
                  Homologada
                </SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filterEvent}
              onValueChange={setFilterEvent}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Evento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {allEvents.map((event) => (
                  <SelectItem key={event} value={event}>
                    {event}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <Card>
            <CardHeader>
              <CardTitle>Todas as Inscrições</CardTitle>
              <CardDescription>
                Lista completa de inscrições cadastradas no
                sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Atleta/Equipe</TableHead>
                    <TableHead>Evento/Competição</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Documentos</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRegistrations.map((registration) => {
                    const docStatus = getDocumentStatus(
                      registration.documents,
                    );
                    return (
                      <TableRow key={registration.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {registration.athlete}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {registration.team} •{" "}
                              {registration.municipality}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="text-sm font-medium">
                              {registration.event}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {registration.competition}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {new Date(
                              registration.registrationDate,
                            ).toLocaleDateString("pt-BR")}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div
                            className={`text-sm ${docStatus.color}`}
                          >
                            {docStatus.completed}/
                            {docStatus.total} completos
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {docStatus.percentage.toFixed(0)}%
                          </div>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(registration.status)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            {canApprove &&
                              registration.status ===
                                "pending" && (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      handleAction(
                                        registration,
                                        "approve",
                                      )
                                    }
                                  >
                                    <Check className="h-4 w-4 text-green-600" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      handleAction(
                                        registration,
                                        "reject",
                                      )
                                    }
                                  >
                                    <X className="h-4 w-4 text-red-600" />
                                  </Button>
                                </>
                              )}
                            {canHomologate &&
                              registration.status ===
                                "approved" && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    handleAction(
                                      registration,
                                      "homologate",
                                    )
                                  }
                                >
                                  <User className="h-4 w-4 text-blue-600" />
                                </Button>
                              )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pending Tab */}
        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Inscrições Pendentes</CardTitle>
              <CardDescription>
                Inscrições aguardando aprovação
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingRegistrations.map((registration) => {
                  const docStatus = getDocumentStatus(
                    registration.documents,
                  );
                  return (
                    <div
                      key={registration.id}
                      className="p-4 border rounded-lg"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium">
                            {registration.athlete}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {registration.team} •{" "}
                            {registration.event}
                          </p>
                        </div>
                        {canApprove && (
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              onClick={() =>
                                handleAction(
                                  registration,
                                  "approve",
                                )
                              }
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Aprovar
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() =>
                                handleAction(
                                  registration,
                                  "reject",
                                )
                              }
                            >
                              <X className="h-4 w-4 mr-1" />
                              Rejeitar
                            </Button>
                          </div>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Documentos: {docStatus.completed}/
                        {docStatus.total} • {registration.notes}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Other status tabs would follow similar pattern */}
        <TabsContent value="approved">
          <Card>
            <CardHeader>
              <CardTitle>Inscrições Aprovadas</CardTitle>
              <CardDescription>
                Inscrições aprovadas aguardando homologação
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {approvedRegistrations.map((registration) => (
                  <div
                    key={registration.id}
                    className="p-4 border rounded-lg"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">
                          {registration.athlete}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {registration.team} •{" "}
                          {registration.event}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Aprovada por {registration.approvedBy}{" "}
                          em{" "}
                          {registration.approvedDate &&
                            new Date(
                              registration.approvedDate,
                            ).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                      {canHomologate && (
                        <Button
                          size="sm"
                          onClick={() =>
                            handleAction(
                              registration,
                              "homologate",
                            )
                          }
                        >
                          <User className="h-4 w-4 mr-1" />
                          Homologar
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="homologated">
          <Card>
            <CardHeader>
              <CardTitle>Inscrições Homologadas</CardTitle>
              <CardDescription>
                Inscrições finalizadas e homologadas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {homologatedRegistrations.map(
                  (registration) => (
                    <div
                      key={registration.id}
                      className="p-4 border rounded-lg"
                    >
                      <div>
                        <h4 className="font-medium">
                          {registration.athlete}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {registration.team} •{" "}
                          {registration.event}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Homologada por{" "}
                          {registration.homologatedBy} em{" "}
                          {registration.homologatedDate &&
                            new Date(
                              registration.homologatedDate,
                            ).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                    </div>
                  ),
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rejected">
          <Card>
            <CardHeader>
              <CardTitle>Inscrições Rejeitadas</CardTitle>
              <CardDescription>
                Inscrições que foram rejeitadas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {rejectedRegistrations.map((registration) => (
                  <div
                    key={registration.id}
                    className="p-4 border rounded-lg"
                  >
                    <div>
                      <h4 className="font-medium">
                        {registration.athlete}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {registration.team} •{" "}
                        {registration.event}
                      </p>
                      <p className="text-xs text-red-600">
                        Motivo: {registration.rejectionReason}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Dialog */}
      <Dialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{getActionTitle()}</DialogTitle>
            <DialogDescription>
              {selectedRegistration && (
                <>
                  Atleta: {selectedRegistration.athlete} -{" "}
                  {selectedRegistration.event}
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <Label htmlFor="notes">
              {actionType === "reject"
                ? "Motivo da Rejeição"
                : "Observações"}
            </Label>
            <Textarea
              id="notes"
              value={actionNotes}
              onChange={(e) => setActionNotes(e.target.value)}
              placeholder={
                actionType === "reject"
                  ? "Informe o motivo da rejeição..."
                  : "Observações sobre a inscrição..."
              }
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button onClick={confirmAction}>Confirmar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}