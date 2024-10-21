"use client"
import React, { useState, useEffect } from 'react';
import { useAuth } from "../AuthContext";
import api from "../axiosConfig";
import { format, addDays, formatDate } from 'date-fns'; // Importar a função format e addDays da biblioteca date-fns
import Confetti from 'react-confetti'; // Importar o componente Confetti
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';

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
import { Calendar } from "@/components/ui/calendar"
import { SelectGroup, SelectLabel, SelectViewport } from "@radix-ui/react-select"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import Link from 'next/link';

export default function Agendamento() {

  useAuth();
  const [userId, setUserId] = useState(localStorage.getItem('userId'));
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [userName, setUserName] = React.useState('');
  let genderUser = '';
  const [scheduleDate, setScheduleDate] = React.useState<Date>(new Date());
  const [scheduleTime, setScheduleTime] = React.useState('');
  const [lastDonationDate, setLastDonationDate] = React.useState<Date | null>(null);
  const [countdown, setCountdown] = React.useState<{ months: number, days: number, confetti: boolean } | null>(null);
  const [dataUser, setDataUser] = React.useState<dataUser | null>(null);
  let [nextDonationDate, setNextDonationDate] = React.useState<Date | Date>(new Date());
  let [hasDonation, setHasDonation] = React.useState<boolean>(false);

  interface dataUser {
    id: string,
    email: string,
    name: string,
    password: string,
    bloodType: string,
    gender: string,
    tokenVersion: number,
    profilePicture: string,
    isActive: boolean,
    isAdmin: boolean,
  }

  React.useEffect(() => {
    const fetchData = async () => {

      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/'; // Redirecionar para a página de login se não estiver logado
      } else {
        await Promise.all([fetchUserData(), fetchLastDonation()]);
        setIsDataFetched(true);
      }
    };

    if (userId && !isDataFetched) {
      fetchData();
    }
  }, [userId, isDataFetched]);


  const fetchUserData = async () => {
    try {
      // dataUser é do tipo dataUser

      const dataUser = await api.get(`/users/${userId}`);
      genderUser = dataUser.data.gender;
      setUserName(dataUser.data.name);


    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
    }
  };

  const fetchLastDonation = async () => {
    try {

      const lastDonationUser = await api.get(`/donations/last/${userId}`);
      if (lastDonationUser.data.length === 0) {
        setHasDonation(false);
        setCountdown({ months: 0, days: 0, confetti: false });
        alert('Você ainda não realizou nenhuma doação!');
      } else {
        setHasDonation(true);
        const lastDonationDate = new Date(lastDonationUser.data[0].donationDate);
        setLastDonationDate(lastDonationDate);

        if (genderUser === 'feminino') {
          nextDonationDate = addDays(lastDonationDate, 120);
          setNextDonationDate(nextDonationDate);
        } else {
          nextDonationDate = addDays(lastDonationDate, 90);
          setNextDonationDate(nextDonationDate);
        }

        const diffTime = nextDonationDate.getTime() - new Date().getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const diffMonths = Math.floor(diffDays / 30);
        const remainingDays = diffDays % 30;

        if (diffDays <= 0) {
          setCountdown({ months: 0, days: 0, confetti: true });
          alert('Você já pode doar novamente!');
        } else {
          setCountdown({ months: diffMonths, days: remainingDays, confetti: false });
        }
      }
    } catch (error) {
      console.error('Erro ao buscar dados da última doação:', error);
    }
  };


  const handleSubmitSchedule = async () => {
    // padronizar a data para o formato yyyy-MM-ddTHH:mm:ss
    const scheduleDatetime = format(new Date(scheduleDate), 'yyyy-MM-dd HH:mm:ss');

    const newSchedule = {
      userId: userId,
      scheduleDate: scheduleDatetime,
      scheduleTime: scheduleTime,
    };

    console.log(userId, scheduleDate, scheduleTime);
    try {
      await api.post('/schedule', newSchedule);
      // enviar notificação de sucesso
      alert('Agendamento realizado com sucesso!');
    } catch (error) {
      console.error('Erro ao realizar agendamento:', error)
    }
  }

  const handleLogout = () => {
    // perguntar se deseja realmente sair

    if (window.confirm('Você realmente deseja sair?')) {
      localStorage.clear();
      window.location.href = '/';
    }
  };

  return (

    <div className="bg-red-900">
      {countdown?.confetti && <Confetti />}
      <div className="absolute top-0 left-0 p-4">
        <Alert>
          {/* <RocketIcon className="h-4 w-4" /> */}
          <AlertTitle>Contagem regressiva para sua próxima doação! 🎉</AlertTitle>
          <AlertDescription>
            (De acordo com a última doação registrada)
          </AlertDescription>
          <div className="text-center m-4">
            {countdown !== null && (
              <div className="text-center mt-4">
                <p className="text-white-600 text-2xl ">{countdown.months} meses e {countdown.days} dias</p>
              </div>
            )}
          </div>
          <AlertDescription>
            Você pode doar novamente a partir do dia: {hasDonation ? formatDate(nextDonationDate, 'dd/MM/yyyy') : 'Data não disponível'}
          </AlertDescription>
        </Alert>
      </div>
      <div className="absolute top-0 right-0 p-4">
        <NavigationMenu className="flex flex-col">
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link href="/agendamento" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Agendamento
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/campanhas" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Campanhas
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/localizacao" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Localização da UCT
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/doacoes" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Suas Doações
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/questionario" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Questionário
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()} onClick={() => {
                  handleLogout();
                }}>
                  Sair

                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      <div className="flex justify-center items-center h-screen">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Faça seu agendamento</CardTitle>
            <CardDescription>Agende sua doação e ajude quem precisa de você.</CardDescription>
          </CardHeader>
          <CardContent>
            <form>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="nome">Nome</Label>
                  <Input id="nome" placeholder={userName} readOnly />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="Data">Data</Label>
                  <Select>
                    <SelectTrigger id="data">
                      <SelectValue placeholder={scheduleDate?.toLocaleDateString()}></SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectViewport>
                        <Calendar
                          mode="single"
                          selected={scheduleDate}
                          onSelect={(date) => date && setScheduleDate(date)}
                          className="rounded-md border shadow"
                        ></Calendar>
                      </SelectViewport>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="hora">Hora</Label>
                  <Select onValueChange={(value) => setScheduleTime(value)}>
                    <SelectTrigger id="hora">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="08:00">08:00</SelectItem>
                      <SelectItem value="09:00">09:00</SelectItem>
                      <SelectItem value="10:00">10:00</SelectItem>
                      <SelectItem value="11:00">11:00</SelectItem>
                      <SelectItem value="13:00">13:00</SelectItem>
                      <SelectItem value="14:00">14:00</SelectItem>
                      <SelectItem value="15:00">15:00</SelectItem>
                      <SelectItem value="16:00">16:00</SelectItem>
                      <SelectItem value="17:00">17:00</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">Cancelar</Button>
            <Button className="bg-red-900
          text-white" onClick={handleSubmitSchedule} type="submit"
            >Cadastrar</Button>
          </CardFooter>
        </Card>
      </div>
      <footer className="text-white text-center">
        Feito com ❤️ por Tainá
      </footer>
    </div >
  )
}
