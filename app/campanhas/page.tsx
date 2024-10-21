"use client"

import * as React from "react"
import Link from "next/link"

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
import api from '../axiosConfig';
import { useAuth } from '../AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function Campanhas() {

    interface Campanha {
        id: number;
        patientName: string;
        bloodType: string;
        compatibleBloodTypes: string[];
        isActive: boolean;
    }
    useAuth();

    const [campanhas, setCampanhas] = React.useState<Campanha[]>([]);
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);


    React.useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = '/'; // Redirecionar para a página de login se não estiver logado
        } else {
            fetchData();
        }
    }, []);

    const fetchData = async () => {
        try {
            // enviar o token de autenticação
            const response = await api.get('/campaigns', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                params: {
                    page: 1,
                    limit: 12,
                }
            });
            setCampanhas(response.data.data);
        } catch (error) {
            console.error('Erro ao buscar dados do backend:', error);
        }
    };

    const handleAgendamento = () => {
        window.location.href = '/agendamento';
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
            <div className="flex justify-center items-start min-h-screen p-10">
                {campanhas ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-20">
                        {campanhas.map((campanha) => (
                            <Card key={campanha.id} className="relative">
                                <CardHeader>
                                    <CardTitle>{campanha.patientName}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription>Tipo Sanguíneo: {campanha.bloodType}</CardDescription>
                                </CardContent>
                                <CardFooter>
                                    <div>
                                        <h4 className="text-lg font-semibold mb-2">Tipos compatíveis:</h4>
                                        <ul className="flex flex-wrap gap-2 list-none p-0">
                                            {campanha.compatibleBloodTypes.map((bloodType) => (
                                                <li key={bloodType} className="bg-gray-200 px-2 py-1 rounded text-sm">
                                                    {bloodType}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </CardFooter>
                                <CardFooter>
                                    <Button
                                        className="w-full"
                                        onClick={() => {
                                            handleAgendamento();
                                        }}
                                    >
                                        Doar
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}

                    </div>

                ) : (
                    <div>Carregando...</div>
                )}
            </div>
            <footer className="text-white text-center">
                Feito com ❤️ por Tainá
            </footer>
        </div >
    )
}
