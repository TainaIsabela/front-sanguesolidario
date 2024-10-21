"use client"

import React, { useState } from 'react';
import api from '../axiosConfig';
const UpdatePasswordForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleUpdatePassword = async () => {
        try {
            const response = await api.post('/users/resetPassword', { email, password });
            setSuccess('Senha atualizada com sucesso!');
            setError('');
        } catch (error) {
            const message = error.response.data.message[0];
            if (message) {
                setError(message);
            } else {
                setError('Erro ao atualizar a senha. Verifique os campos e tente novamente.');
            }
            setSuccess('');
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-red-900 p-4">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-gray-500 mb-6 text-center">Atualizar Senha</h2>
                {error && (
                    <div className="bg-red-500 text-white p-4 mb-4 rounded">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="bg-green-500 text-white p-4 mb-4 rounded">
                        {success}
                    </div>
                )}
                <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-500 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">Nova Senha</label>
                    <input
                        type="password"
                        id="newPassword"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-500 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
                    />
                </div>
                <div className="flex justify-between items-center">
                    <a href="/" className="text-sm text-blue-600">Voltar para o login</a>
                    <button
                        onClick={handleUpdatePassword}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors duration-300"
                    >
                        Atualizar Senha
                    </button>
                </div>
            </div>
            <footer className="text-white text-center">
                Feito com ❤️ por Tainá
            </footer>
        </div>
    );
};

export default UpdatePasswordForm;