import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Clock, Mail, Phone } from 'lucide-react';

interface PendingApprovalProps {
  userEmail: string;
  onBackToLogin: () => void;
}

export function PendingApproval({ userEmail, onBackToLogin }: PendingApprovalProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center">
            <Clock className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl">Aguardando Aprovação</CardTitle>
          <CardDescription>
            Sua solicitação de cadastro foi enviada com sucesso
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="space-y-4">
            <div className="p-4 bg-orange-50 rounded-lg">
              <p className="text-sm text-orange-800">
                <strong>Email cadastrado:</strong> {userEmail}
              </p>
            </div>

            <div className="text-left space-y-3">
              <h4 className="font-medium">Próximos passos:</h4>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                  Um administrador do sistema irá revisar sua solicitação
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                  Você receberá um email com suas credenciais de acesso quando aprovado
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                  No primeiro acesso, você poderá alterar sua senha
                </li>
              </ul>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">Tempo de aprovação:</h4>
              <p className="text-sm text-blue-700">
                Normalmente processamos solicitações em até 2 dias úteis
              </p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">Precisa de ajuda?</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>suporte@sge.gov.br</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>(11) 3000-0000</span>
                </div>
              </div>
            </div>
          </div>

          <Button 
            onClick={onBackToLogin}
            variant="outline"
            className="w-full"
          >
            Voltar para o Login
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}