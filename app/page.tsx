"use client"

import Link from "next/link"
import React, { useState } from 'react';

import { cn } from "@/lib/utils"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { FaSignInAlt } from 'react-icons/fa'
import api from './axiosConfig';
import { useAuth } from './AuthContext';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { AnimatePresence, motion } from "framer-motion";
export default function Home() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [bloodtype, setBloodtype] = useState('');
  const [gender, setGender] = useState('');
  const [error, setError] = useState('');
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  
  useAuth();

  React.useEffect(() => {

  }, []);

  const handleLogin = async () => {
    try {
      const response = await api.post('/auth/login', { email, password });
      // Supondo que o token JWT seja retornado no campo 'token'
      const { access_token } = response.data;
      const { userId } = response.data;
      const { isAdmin } = response.data;
      console.log(response.data);
      // Armazene o token no localStorage ou em um contexto global
      console.log(response.data);
      //se o login tiver erro, retornar alerta de login inválido
      if (!access_token) {
        setError('Erro ao fazer login. Verifique seu email e senha.');
        return;
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem('token', access_token);
        localStorage.setItem('userId', userId);
        localStorage.setItem('isAdmin', isAdmin);
      }
      console.log(response.data);
      // Redirecione o usuário ou faça outra ação necessária
      if (isAdmin === true) {
        window.location.href = '/campanhas/admin';
      } else {
        handleCampanhas();
      }
      // Redirecionar para a página de campanhas
    } catch (error) {
      setError('Erro ao fazer login. Verifique seu email e senha.');
    }
  };

  const handleCadastro = async () => {
    const newUser = {
      email: email,
      name: name,
      password: password,
      bloodType: bloodtype,
      gender: gender,
    };

    try {
      const response = await api.post('/users', newUser);
      const { userId } = response.data.id;
      // Armazene o token no localStorage ou em um contexto global
      if (typeof window !== 'undefined') {
        localStorage.setItem('userId', userId);
      }
      // avisar que o cadastro foi feito com sucesso e que o usuário pode logar
      window.location.reload();
      window.alert('Cadastro feito com sucesso! Faça login para continuar.');
    } catch (error) {
      const message = error.response.data.message[0];
      if (message) {
        setError(message);
      } else {
        setError('Erro ao realizar cadastro. Verifique os campos e tente novamente.');
      }
    }
  };
  const handleCampanhas = () => {
    window.location.href = '/campanhas';
  };

  return (
    < div className="min-h-screen flex flex-col justify-between bg-red-900" >
      <header className="bg-red-900 text-white p-4 flex justify-between items-center">
        <div className="text-xl font-bold">Sangue Solidário</div>
        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
            </svg>
          </button>
        </div>
        <AnimatePresence>
          {isMenuOpen && (
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:flex w-full md:w-auto"
            >
              <NavigationMenu className="flex flex-col md:flex-row md:items-center w-full md:w-auto">
                <NavigationMenuList className="flex flex-col md:flex-row items-center w-full md:w-auto">
                  <NavigationMenuItem>
                    <Link href="/agendamento" legacyBehavior passHref>
                      <NavigationMenuLink className={`${navigationMenuTriggerStyle()} py-2 px-4 md:py-0 md:px-4`}>
                        Agendamento
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Link href="/campanhas" legacyBehavior passHref>
                      <NavigationMenuLink className={`${navigationMenuTriggerStyle()} py-2 px-4 md:py-0 md:px-4`}>
                        Campanhas
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Link href="/localizacao" legacyBehavior passHref>
                      <NavigationMenuLink className={`${navigationMenuTriggerStyle()} py-2 px-4 md:py-0 md:px-4`}>
                        Localização da UCT
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Link href="/doacoes" legacyBehavior passHref>
                      <NavigationMenuLink className={`${navigationMenuTriggerStyle()} py-2 px-4 md:py-0 md:px-4`}>
                        Suas Doações
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Link href="/questionario" legacyBehavior passHref>
                      <NavigationMenuLink className={`${navigationMenuTriggerStyle()} py-2 px-4 md:py-0 md:px-4`}>
                        Questionário
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Link href="/" legacyBehavior passHref>
                      <NavigationMenuLink className={`${navigationMenuTriggerStyle()} py-2 px-4 md:py-0 md:px-4`} onClick={handleLogout}>
                        Sair
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>
      <div className="flex justify-center items-center h-screen">
        <Tabs defaultValue="Logar" className="w-[400px]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="Logar">Logar</TabsTrigger>
            <TabsTrigger value="Cadastrar">Cadastrar</TabsTrigger>
          </TabsList>
          <TabsContent value="Logar">
            {error && (
              <div className="bg-red-600 text-white p-4 mb-4 rounded">
                {error}
              </div>
            )}
            <Card>
              <CardHeader>
                <CardTitle>Entre</CardTitle>
                <CardDescription>
                  Entre na sua conta e veja suas doações.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Seu email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input"
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input"
                  />
                  <div className="flex justify-end">
                    <Link href="/senha" legacyBehavior passHref>
                      <a className="text-sm text-blue-600">Esqueci minha senha</a>
                    </Link>
                  </div>
                </div>
                <div>
                  <div className="flex items-center space-x-2 mt-2">
                    {/* <Checkbox id="terms" /> */}
                    {/* <label
                      htmlFor="terms"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Lembre-se de mim
                    </label> */}
                    <br />
                  </div>
                  <Button className="bg-red-900 btn btn-primary ml-auto flex items-center" onClick={handleLogin}>
                    <FaSignInAlt className="mr-2" />
                    Entrar
                  </Button>

                  {/* <div className="">
                    <div className="flex items-center space-x-2 mt-2">
                      <Label htmlFor="" className="text-sm font-medium "> Ou entre com: </Label>
                    </div>
                    <div className="flex items-center space-between">
                      <Button
                        className={cn(
                          "bg-white text-black text-opacity-90 mt-2",
                          "hover:bg-red-900 hover:text-white hover:text-opacity-100"
                        )}
                      >
                        <img src="/google.jpg" alt="Google logo" className="mr-2 w-6 h-6" /> Google
                      </Button>
                      <Button
                        className={cn(
                          "bg-white text-black text-opacity-90 mt-2",
                          "hover:bg-blue-900 hover:text-white hover:text-opacity-100"
                        )}
                      >
                        <img src="/facebook.png" alt="Facebook logo" className="mr-2 w-6 h-6" />Facebook
                      </Button>
                    </div>
                  </div> */}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="Cadastrar">
            {error && (
              <div className="bg-red-600 text-white p-4 mb-4 rounded">
                {error}
              </div>
            )}
            <Card className="max-w-md mx-auto">
              <CardHeader>
                <CardTitle>Crie sua conta</CardTitle>
                <CardDescription>Cadastre suas doações e ajude quem precisa.</CardDescription>
              </CardHeader>
              <CardContent>
                <form>
                  <div className="grid w-full items-center gap-4">
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="name">Nome</Label>
                      <Input id="name" placeholder="Seu nome" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="sexo">Sexo Biológico</Label>
                      <Select onValueChange={(value) => setGender(value)}>
                        <SelectTrigger id="sexo">
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Feminino">Feminino</SelectItem>
                          <SelectItem value="Masculino">Masculino</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="blood">Tipo Sanguíneo</Label>
                      <Select onValueChange={(value) => setBloodtype(value)}>
                        <SelectTrigger id="blood">
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent position="popper">
                          <SelectItem value="A+">A+</SelectItem>
                          <SelectItem value="A-">A-</SelectItem>
                          <SelectItem value="B+">B+</SelectItem>
                          <SelectItem value="B-">B-</SelectItem>
                          <SelectItem value="AB+">AB+</SelectItem>
                          <SelectItem value="AB-">AB-</SelectItem>
                          <SelectItem value="O+">O+</SelectItem>
                          <SelectItem value="O-">O-</SelectItem>
                          <SelectItem value="Não sei">Não sei</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" placeholder="Seu email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="password">Senha</Label>
                      <Input id="password" placeholder="Sua senha" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                  </div>
                </form>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Cancelar</Button>
                <Button className="bg-red-900" onClick={handleCadastro}
                >Cadastrar</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <footer className="text-white text-center">
        Feito com ❤️ por Tainá
      </footer>
    </div >
  )
}
