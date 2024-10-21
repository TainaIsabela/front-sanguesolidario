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

const CampanhasAdmin = () => {

    interface Campanha {
        id: number;
        patientName: string;
        bloodType: string;
        compatibleBloodTypes: string[];
        isActive: boolean;
    }
    useAuth();

    const [campanhas, setCampanhas] = React.useState<Campanha[]>([]);
    const [isEditPopupOpen, setIsEditPopupOpen] = React.useState(false);
    const [isCreatePopupOpen, setIsCreatePopupOpen] = React.useState(false);
    const [editCampaign, setEditCampaign] = React.useState<Campanha | null>(null);
    const [newCampaign, setNewCampaign] = React.useState<Partial<Campanha>>({
        patientName: '',
        bloodType: '',
        compatibleBloodTypes: [],
        isActive: true,
    });
    const [lastPage, setLastPage] = React.useState (0);
    const [page, setPage] = React.useState(1);
    const [total, setTotal] = React.useState(0);
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);


    React.useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = '/'; // Redirecionar para a página de login se não estiver logado
        } else {
            Promise.all([fetchData()]);
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
                    limit: 10,
                },
            });
            // tirar page, total e lastPage do response.data

            setCampanhas(response.data.data);
            setPage(response.data.page);
            setTotal(response.data.total);
            setLastPage(response.data.lastPage); 
        } catch (error) {
            console.error('Erro ao buscar dados do backend:', error);
        }
    };


    const handleLogout = () => {
        // perguntar se deseja realmente sair

        if (window.confirm('Você realmente deseja sair?')) {
            localStorage.clear();
            window.location.href = '/';
        }
    };



    const handleEditClick = (campanha: Campanha) => {
        setEditCampaign(campanha);
        setIsEditPopupOpen(true);
    };

    const handleUpdateCampaign = async () => {
        if (editCampaign) {
            try {
                await api.patch(`/campaigns/${editCampaign.id}`, editCampaign, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                fetchData();
                setIsEditPopupOpen(false);
            } catch (error) {
                console.error('Erro ao atualizar campanha:', error);
            }
        }
    };
    const handleCreateCampaign = async () => {
        try {
            await api.post('/campaigns', newCampaign, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            fetchData();
            setIsCreatePopupOpen(false);
        } catch (error) {
            console.error('Erro ao criar campanha:', error);
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
            {/* <div className="bg-red-900 flex justify-center items-center pt-20 pb-5">
                <h1 className="text-4xl text-white">Campanhas de Doação de Sangue Ativas:</h1>
            </div> */}

            <div className="flex justify-center w-full pt-20">
                <button
                    className="bg-green-500 text-white px-4 py-2 rounded"
                    onClick={() => setIsCreatePopupOpen(true)}
                >
                    <FontAwesomeIcon icon={faPlus} /> Nova Campanha
                </button>
            </div>


            <div className="flex justify-center items-start min-h-screen p-10">

                {campanhas ? (
                    <div className="grid grid-cols-4 gap-3 mt-20">
                        {campanhas.map((campanha) => (
                            <Card key={campanha.id} className="relative">
                                <CardHeader>
                                    <CardTitle>{campanha.patientName}</CardTitle>
                                    <button
                                        className="absolute top-0 right-0 bg-blue-500 text-white px-4 py-2 rounded m-2"
                                        onClick={() => handleEditClick(campanha)}
                                    >
                                        <FontAwesomeIcon icon={faEdit} />
                                    </button>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription>Tipo Sanguíneo: {campanha.bloodType}</CardDescription>
                                </CardContent>
                                <CardFooter>
                                    <div>
                                        <h4>Tipos compatíveis:</h4>
                                        <ul className="flex space-x-2 list-none p-0">
                                            {campanha.compatibleBloodTypes.map((bloodType) => (
                                                <li key={bloodType} className="bg-gray-200 px-2 py-1 rounded">{bloodType}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </CardFooter>
                            </Card>
                        ))}

                    </div>

                ) : (
                    <div>Carregando...</div>
                )}
            </div>
            {isEditPopupOpen && editCampaign && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-8 rounded shadow-lg w-1/3 text-black">
                        <h2 className="text-2xl mb-4">Editar Campanha</h2>
                        <div className="mb-4">
                            <Label htmlFor="patientName">Nome do Paciente</Label>
                            <Input
                                id="patientName"
                                value={editCampaign.patientName}
                                onChange={(e) => setEditCampaign({ ...editCampaign, patientName: e.target.value })}
                            />
                        </div>
                        <div className="mb-4">
                            <Label htmlFor="bloodType">Tipo Sanguíneo</Label>
                            <Input
                                id="bloodType"
                                value={editCampaign.bloodType}
                                onChange={(e) => setEditCampaign({ ...editCampaign, bloodType: e.target.value })}
                            />
                        </div>
                        <div className="mb-4">
                            <Label htmlFor="compatibleBloodTypes">Tipos Compatíveis</Label>
                            <Input
                                id="compatibleBloodTypes"
                                value={editCampaign.compatibleBloodTypes.join(', ')}
                                onChange={(e) =>
                                    setEditCampaign({
                                        ...editCampaign,
                                        compatibleBloodTypes: e.target.value.split(',').map((type) => type.trim()),
                                    })
                                }
                            />
                        </div>
                        <div className="mb-4">
                            <Label htmlFor="isActive">Ativa</Label>
                            <Select
                                value={editCampaign.isActive ? 'true' : 'false'}
                                onValueChange={(value) =>
                                    setEditCampaign({
                                        ...editCampaign,
                                        isActive: value === 'true',
                                    })
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue>
                                        {editCampaign.isActive ? 'Ativa' : 'Inativa'}
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="true">Ativa</SelectItem>
                                    <SelectItem value="false">Inativa</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex justify-end space-x-4">
                            <button
                                className="bg-gray-500 text-white px-4 py-2 rounded"
                                onClick={() => setIsEditPopupOpen(false)}
                            >
                                Cancelar
                            </button>
                            <button
                                className="bg-blue-500 text-white px-4 py-2 rounded"
                                onClick={handleUpdateCampaign}
                            >
                                Salvar
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {isCreatePopupOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-8 rounded shadow-lg w-1/3 text-black">
                        <h2 className="text-2xl mb-4">Criar Nova Campanha</h2>
                        <div className="mb-4">
                            <Label htmlFor="newPatientName">Nome do Paciente</Label>
                            <Input
                                id="newPatientName"
                                value={newCampaign.patientName}
                                onChange={(e) => setNewCampaign({ ...newCampaign, patientName: e.target.value })}
                            />
                        </div>
                        <div className="mb-4">
                            <Label htmlFor="newBloodType">Tipo Sanguíneo</Label>
                            <Input
                                id="newBloodType"
                                value={newCampaign.bloodType}
                                onChange={(e) => setNewCampaign({ ...newCampaign, bloodType: e.target.value })}
                            />
                        </div>
                        <div className="mb-4">
                            <Label htmlFor="newCompatibleBloodTypes">Tipos Compatíveis</Label>
                            <Input
                                id="newCompatibleBloodTypes"
                                value={newCampaign.compatibleBloodTypes.join(', ')}
                                onChange={(e) =>
                                    setNewCampaign({
                                        ...newCampaign,
                                        compatibleBloodTypes: e.target.value.split(',').map((type) => type.trim()),
                                    })
                                }
                            />
                        </div>
                        <div className="flex justify-end space-x-4">
                            <button
                                className="bg-gray-500 text-white px-4 py-2 rounded"
                                onClick={() => setIsCreatePopupOpen(false)}
                            >
                                Cancelar
                            </button>
                            <button
                                className="bg-blue-500 text-white px-4 py-2 rounded"
                                onClick={handleCreateCampaign}
                            >
                                Criar
                            </button>
                        </div>
                    </div>
                </div>
            )}
           <footer className="text-white text-center">
                Feito com ❤️ por Tainá
            </footer>
        </div>
    )
}

export default CampanhasAdmin;