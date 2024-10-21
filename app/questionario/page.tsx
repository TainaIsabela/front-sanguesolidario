"use client"

import React, { useState, useEffect } from 'react';
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
import { error } from 'console';
import { useAuth } from '../AuthContext';
import api from '../axiosConfig';
import { format } from 'date-fns';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

const questions = [
  { question: "Você possui entre 18 e 69 anos?", options: ["Sim", "Não"], correctAnswer: "Sim" },
  { question: "Você está em Jejum?", options: ["Sim", "Não"], correctAnswer: "Não" },
  { question: "Você dormiu pelo menos 6 horas nas ultimas 24 horas?", options: ["Sim", "Não"], correctAnswer: "Sim" },
  { question: "Você realizou algum tratamento dentário à menos de 7 dias?", options: ["Sim", "Não"], correctAnswer: "Não" },
  { question: "Você está grávida ou amamentado?", options: ["Sim", "Não"], correctAnswer: "Não" },
  { question: "Você esteve gripado ou com febre nos ultimos 7 dias?", options: ["Sim", "Não"], correctAnswer: "Não" },
  { question: "Você possui diabetes, cardipatias ou contraiu hepatite após os 11 anos?", options: ["Sim", "Não"], correctAnswer: "Não" },
  { question: "Você tomou vacina da gripe nos ultimos dias?", options: ["Sim", "Não"], correctAnswer: "Não" },
  { question: "Você ingeriu álcool nas ultimas 12 horas?", options: ["Sim", "Não"], correctAnswer: "Não" },
  { question: "Você realizou alguns dos seguintes procedimentos: piercing, acuputura ou tatuagem a menos de 12 meses?", options: ["Sim", "Não"], correctAnswer: "Não" },
  { question: "Você realizou endoscopia ou colonoscopia nos últimos 6 meses?", options: ["Sim", "Não"], correctAnswer: "Não" },
  { question: "Você está utilizando de medicamentos controlados recentemente?", options: ["Sim", "Não"], correctAnswer: "Não" },
];

export default function Questionario() {
  useAuth();
  if (typeof window !== 'undefined') {
    // Código que acessa localStorage
  }

  function formatDate(date: string) {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString();
  }

  interface ResultQuiz {
    userId: string;
    result: string;
    dateResult: string;
  }
  const userId = localStorage.getItem('userId');
  const [answers, setAnswers] = useState(Array(questions.length).fill(''));
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showAlert, setShowAlert] = useState(true);
  let [previousResults, setPreviousResults] = useState<ResultQuiz[]>([]);

  React.useEffect(() => {
    handlePreviousResults();
  }
    , []);

  const closeAlert = () => {
    setShowAlert(false);
  };

  const handleAnswerChange = (index: number, answer: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = answer;
    setAnswers(newAnswers);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Verificar se todas as perguntas foram respondidas
    if (answers.includes('')) {
      setError('Por favor, responda todas as perguntas antes de submeter.');
      return;
    }
    setError(null); // Limpar erro se todas as perguntas foram respondidas

    let score = 0;
    answers.forEach((answer, index) => {
      if (answer === questions[index].correctAnswer) {
        score++;
      }
    });
    const isApproved = score >= questions.length / 2;
    const Result = isApproved ? "Aprovado" : "Reprovado";
    setResult(isApproved ? "Aprovado" : "Reprovado");

    const resultQuiz = {
      userId: userId,
      result: Result,
      dateResult: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
    }

    handleRegisterResultQuiz(resultQuiz);

    setShowModal(true); // Mostrar o modal com o resultado
  };

  const handleRegisterResultQuiz = async (resultQuiz: any) => {
    try {
      // enviar o token de autenticação
      const response = await api.post('/quiz', resultQuiz);
      console.log(response.data);
    } catch (error) {
      console.error('Erro ao salvar resultado do questionário:', error);
    }
  }

  const closeModal = () => {
    setShowModal(false);
    setAnswers(Array(questions.length).fill('')); // Limpar respostas
    setResult(null); 3
    window.location.reload();
  };

  const handlePreviousResults = async () => {
    try {
      const response = await api.get(`/quiz/all/${userId}`, {
        params: {
          page: 1,
          limit: 5,
        }
      });
      setPreviousResults(response.data.data);
    } catch (error) {
      console.error('Erro ao buscar resultados do questionário:', error);
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
    <div className="bg-red-900 min-h-screen flex justify-center items-start pt-20">
      <div className="text-yellow-300 absolute top-0 center-0 p-4">
        <Alert>
          <AlertTitle>Este questionário não substitui a avaliação de um profissional.</AlertTitle>
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
      <div className="relative min-h-screen">
        <div className="flex justify-center items-center min-h-screen">
          <div className="w-full max-w-3xl mx-auto mb-10 items-center">
            <Card className="w-full shadow-lg rounded-lg overflow-hidden">
              <CardHeader className="text-center text-gray-700">
                <CardTitle className="text-2xl font-bold">Questionário</CardTitle>
                <CardDescription className="text-lg">Responda as perguntas abaixo e saiba se você está apto a doar.</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="w-full">
                  {questions.map((q, index) => (
                    <div key={index} className="mb-8">
                      <Label className="block text-lg font-medium mb-2 text-center">{q.question}</Label>
                      <div className="flex justify-center space-x-4">
                        {q.options.map((option, i) => (
                          <div key={i} className="flex items-center">
                            <input
                              type="radio"
                              id={`question-${index}-option-${i}`}
                              name={`question-${index}`}
                              value={option}
                              checked={answers[index] === option}
                              onChange={() => handleAnswerChange(index, option)}
                              className="mr-2"
                            />
                            <label htmlFor={`question-${index}-option-${i}`} className="ml-2 text-lg">{option}</label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-end">
                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors duration-300">
                      Enviar
                    </button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

        </div>

      </div>
      <div className="absolute top-1/4 right-0 w-1/6 p-4">
        <div className="bg-white bg-opacity-75 p-4 rounded-lg shadow-md text-gray-800 text-center">
          <p className="text-xl text-lg font-medium mb-4 text-gray-800">Resultados Anteriores</p>
          {previousResults.length === 0 && (
            <p className="text-lg text-gray-800">Nenhum resultado encontrado.</p>
          )}
          {previousResults.map((result, index) => (
            <div key={index} className="mb-4">
              <p className="text-lg font-medium text-gray-800">{result.result}</p>
              <p className="text-sm text-gray-800">{formatDate(result.dateResult)}</p>
            </div>
          ))}
        </div>
      </div>



      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300">
          <div className="bg-white p-8 rounded-lg shadow-2xl text-center transform transition-transform duration-300 scale-100 w-3/4 max-w-2xl">
            <h2 className="text-2xl font-bold mb-4 text-black">Resultado:</h2>
            <p className="text-lg mb-4 text-black">{result}</p>
            <button onClick={closeModal} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors duration-300">
              Fechar
            </button>
          </div>
        </div>
      )}
      {showAlert && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300">
          <div className="bg-white p-8 rounded-lg shadow-2xl text-center transform transition-transform duration-300 scale-100 w-3/4 max-w-2xl">
            <h2 className="text-2xl font-bold mb-4 text-black">Aviso:</h2>
            <p className="text-lg mb-4 text-black">Nenhuma das respostas do questionário será armazenada, apenas o resultado final será salvo.</p>
            <button onClick={closeAlert} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors duration-300">
              Entendi
            </button>
          </div>
        </div>
      )}
    </div>
  );
}