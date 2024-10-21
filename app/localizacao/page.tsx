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


export default function Localizacao() {
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
            <div className="flex justify-center items-center h-screen">
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3837.4762737129513!2d-52.24993822486787!3d-15.884100184768915!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x93656fe6ac0f0f2d%3A0x11530730ac435dcc!2sBanco%20de%20Sangue%20P%C3%BAblico%2FUnidade%20de%20Coleta%20e%20Transfus%C3%A3o!5e0!3m2!1spt-BR!2sbr!4v1725857027892!5m2!1spt-BR!2sbr"
                    width="1500"
                    height="800"
                    className="border-0 rounded"
                    allowFullScreen={true}
                    loading="eager"
                    referrerPolicy="no-referrer-when-downgrade">
                </iframe>
            </div>
            <footer className="text-white text-center">
                Feito com ❤️ por Tainá
            </footer>
        </div>
    )
}
