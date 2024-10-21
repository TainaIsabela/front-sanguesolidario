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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';

import { useAuth } from "../AuthContext"
import api from "../axiosConfig"
import { set } from "date-fns"


export default function Doacoes() {

  function formatDate(date: string) {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString();
  }

  useAuth();
  const userId = localStorage.getItem('userId');

  interface Donation {
    id: string;
    userId: string;
    donationDate: string;
    notes: string;
  }

  const [doacoes, setDoacoes] = React.useState<Donation[]>([]);
  const [isPopupOpen, setIsPopupOpen] = React.useState(false);
  const [isEditPopupOpen, setIsEditPopupOpen] = React.useState(false);
  const [newDonationDate, setNewDonationDate] = React.useState('');
  const [newDonationNotes, setNewDonationNotes] = React.useState('');
  const [editDonationId, setEditDonationId] = React.useState<string | null>(null);
  const [editDonationDate, setEditDonationDate] = React.useState('');
  const [editDonationNotes, setEditDonationNotes] = React.useState('');

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(`/donations/all/${userId}`,
          {
            params: {
              page: 1,
              limit: 10,
            }
          });
        setDoacoes(response.data.data);
      } catch (error) {
        console.error('Erro ao buscar doações:', error);
      }
    };

    fetchData();
  }, [userId]);

  const handleOpenPopup = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const handleRegisterDonation = async () => {
    const newDoacao = {
      userId: userId,
      donationDate: newDonationDate,
      notes: newDonationNotes,
    };

    try {
      await api.post('/donations', newDoacao);
      handleClosePopup();
      window.location.reload();
    } catch (error) {
      console.error('Erro ao registrar doação:', error);
    }
  };

  const handleEditDonation = (index: number) => {
    const donation: Donation = doacoes[index];
    setEditDonationId(donation.id);
    setEditDonationDate(donation.donationDate);
    setEditDonationNotes(donation.notes);
    setIsEditPopupOpen(true);
  };

  const handleUpdateDonation = async () => {
    if (!editDonationId) return;

    const updatedDonation = {
      userId: userId,
      donationDate: editDonationDate,
      notes: editDonationNotes,
    };

    try {
      await api.patch(`/donations/${editDonationId}`, updatedDonation);
      setIsEditPopupOpen(false);
      window.location.reload();
    } catch (error) {
      console.error('Erro ao atualizar doação:', error);
    }
  };

  const handleDeleteDonation = async (id: string) => {
    const confirmed = window.confirm('Você tem certeza que deseja excluir esta doação?');
    if (confirmed) {
      try {
        await api.delete(`/donations/${id}`);
        setDoacoes(doacoes.filter(doacao => doacao.id !== id));
      } catch (error) {
        console.error('Erro ao excluir doação:', error);
      }
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

      <div className="flex flex-col items-center min-h-screen">
        <div className="flex justify-center w-full p-4 mt-20">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={handleOpenPopup}
          >
            Registrar Nova Doação
          </button>
        </div>
        <div className="grid grid-cols-3 gap-10 mt-20">
          {doacoes.map((doacao, index) => (
            <div key={index} className="relative bg-white shadow-lg rounded-lg p-6 min-w-[250px] min-h-[150px]">
              <button
                className="absolute top-2 left-2 bg-gray-200 text-gray-700 px-2 py-1 rounded"
                onClick={() => handleDeleteDonation(doacao.id)}
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
              <button
                className="absolute top-2 right-2 bg-gray-200 text-gray-700 px-2 py-1 rounded"
                onClick={() => handleEditDonation(index)}
              >
                <FontAwesomeIcon icon={faEdit} />
              </button>
              <div className="text-center">
                <p className="text-gray-600 font-bold mt-5">Data da doação: {formatDate(doacao.donationDate)}</p>
                <p className="text-gray-600 mt-5">Observações: {doacao.notes}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded shadow-lg w-1/3">
            <h2 className="text-2xl mb-4">Registrar Nova Doação</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Data da Doação</label>
              <input
                type="date"
                className="w-full p-2 border border-gray-300 rounded"
                value={newDonationDate}
                onChange={(e) => setNewDonationDate(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Observações</label>
              <textarea
                className="w-full p-2 border border-gray-300 rounded"
                value={newDonationNotes}
                onChange={(e) => setNewDonationNotes(e.target.value)}
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded"
                onClick={handleClosePopup}
              >
                Cancelar
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={handleRegisterDonation}
              >
                Registrar
              </button>
            </div>
          </div>
        </div>
      )}

      {isPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded shadow-lg w-1/3 text-black">
            <h2 className="text-2xl mb-4">Registrar Nova Doação</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Data da Doação</label>
              <input
                type="date"
                className="w-full p-2 border border-gray-300 rounded text-black"
                value={newDonationDate}
                onChange={(e) => setNewDonationDate(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Observações</label>
              <textarea
                className="w-full p-2 border border-gray-300 rounded text-black"
                value={newDonationNotes}
                onChange={(e) => setNewDonationNotes(e.target.value)}
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded"
                onClick={handleClosePopup}
              >
                Cancelar
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={handleRegisterDonation}
              >
                Registrar
              </button>
            </div>
          </div>
        </div>
      )}

      {isEditPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded shadow-lg w-1/3 text-black">
            <h2 className="text-2xl mb-4">Editar Doação</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Data da Doação</label>
              <input
                type="date"
                className="w-full p-2 border border-gray-300 rounded"
                value={editDonationDate}
                onChange={(e) => setEditDonationDate(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Observações</label>
              <textarea
                className="w-full p-2 border border-gray-300 rounded text-black"
                value={editDonationNotes}
                onChange={(e) => setEditDonationNotes(e.target.value)}
              />
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
                onClick={handleUpdateDonation}
              >
                Atualizar
              </button>
            </div>
          </div>
        </div>
      )}
      <footer className="text-white text-center">
        Feito com ❤️ por Tainá
      </footer>
    </div>
  );
}