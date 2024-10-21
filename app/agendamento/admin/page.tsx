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
import api from '../../axiosConfig';
import { useAuth } from '../../AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit, faPlus } from '@fortawesome/free-solid-svg-icons';
import { format } from "path"

const AgendamentosAdmin = () => {

    useAuth();

    interface Agendamento {
        id: number;
        scheduleDate: string;
        scheduleTime: string;
        username: string;
    }

    const [agendamentos, setAgendamentos] = React.useState<Agendamento[]>([]);

    React.useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = '/'; // Redirecionar para a página de login se não estiver logado
        } else {
            fetchAgendamentos();
        }
    }, []);

    const fetchAgendamentos = async () => {
        try {
            const response = await api.get('/schedule/all', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                params: {
                    page: 1,
                    limit: 10,
                },
            });
            setAgendamentos(response.data.data);
        } catch (error) {
            console.error('Erro ao buscar agendamentos:', error);
        }
    };

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
                            <Link href="/agendamento/admin" legacyBehavior passHref>
                                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                    Agendamento
                                </NavigationMenuLink>
                            </Link>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <Link href="/campanhas/admin" legacyBehavior passHref>
                                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                    Campanhas
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
                {agendamentos.length > 0 ? (
                    <div className="grid grid-cols-4 gap-3 mt-20">
                        {agendamentos.map((agendamento) => (
                            <Card key={agendamento.id} className="relative bg-white text-black p-4 rounded-lg shadow-md">
                                <CardHeader>
                                    <CardTitle className="text-xl font-bold">{agendamento.username}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-lg">Data: {(new Date(agendamento.scheduleDate)).toLocaleDateString()}</p>
                                    <p className="text-lg">Hora: {agendamento.scheduleTime}</p>
                                </CardContent>
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
        </div>
    )
}

export default AgendamentosAdmin;