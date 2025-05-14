
import React, { useState } from 'react';
import { 
  Card, 
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { loginUser, registerUser } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';

const AuthForm: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { toast } = useToast();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const data = await loginUser(username, password);
      login(data.username, data.token);
      
      toast({
        title: "Login realizado com sucesso",
        description: `Bem-vindo de volta, ${data.username}!`,
      });
    } catch (error) {
      toast({
        title: "Erro ao fazer login",
        description: "Verifique suas credenciais e tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const data = await registerUser(username, password);
      login(data.username, data.token);
      
      toast({
        title: "Registro realizado com sucesso",
        description: "Sua conta foi criada e você foi conectado automaticamente.",
      });
    } catch (error) {
      toast({
        title: "Erro ao registrar",
        description: "Não foi possível criar sua conta. Tente com outro nome de usuário.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-[350px] card-glass animate-pulse-glow">
      <Tabs defaultValue="login">
        <TabsList className="grid w-full grid-cols-2 bg-gray-800/50">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="register">Registrar</TabsTrigger>
        </TabsList>
        
        <TabsContent value="login">
          <form onSubmit={handleLogin}>
            <CardHeader>
              <CardTitle>Entrar</CardTitle>
              <CardDescription>
                Entre com seu nome de usuário e senha.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm">Nome de usuário</label>
                <Input 
                  id="username"
                  type="text"
                  placeholder="Digite seu nome de usuário"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-gray-800/70 border-gray-700"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm">Senha</label>
                <Input 
                  id="password"
                  type="password"
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-gray-800/70 border-gray-700"
                  required
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                type="submit"
                className="w-full bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-600 hover:to-indigo-600"
                disabled={isLoading}
              >
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
            </CardFooter>
          </form>
        </TabsContent>
        
        <TabsContent value="register">
          <form onSubmit={handleRegister}>
            <CardHeader>
              <CardTitle>Criar Conta</CardTitle>
              <CardDescription>
                Crie uma nova conta para começar.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="new-username" className="text-sm">Nome de usuário</label>
                <Input 
                  id="new-username"
                  type="text"
                  placeholder="Escolha um nome de usuário"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-gray-800/70 border-gray-700"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="new-password" className="text-sm">Senha</label>
                <Input 
                  id="new-password"
                  type="password"
                  placeholder="Escolha uma senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-gray-800/70 border-gray-700"
                  required
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                type="submit"
                className="w-full bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-600 hover:to-indigo-600"
                disabled={isLoading}
              >
                {isLoading ? "Registrando..." : "Registrar"}
              </Button>
            </CardFooter>
          </form>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default AuthForm;
