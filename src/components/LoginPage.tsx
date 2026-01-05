// src/components/LoginPage.tsx

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Leaf, LogIn } from 'lucide-react';

export function LoginPage() {
  const { setUser } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // This is a simple mock authentication for the prototype.
    // In a real application, this would be a call to a backend server.
    if (email === 'citizen@demo.com' && password === 'password') {
      setUser({
        id: '1',
        name: 'CITIZEN',
        email: 'citizen@demo.com',
        role: 'citizen',
        points: 1250,
        avatar: 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=150'
      });
    } else if (email === 'worker@demo.com' && password === 'password') {
        setUser({
            id: '2',
            name: 'WORKER',
            email: 'worker@demo.com',
            role: 'worker',
            points: 0, // Workers don't have points
            avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
        });
    } else if (email === 'gov@demo.com' && password === 'password') {
        setUser({
            id: '3',
            name: 'GOVERNMENT',
            email: 'gov@demo.com',
            role: 'government',
            points: 0, // Government users don't have points
            avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
        });
    }
    else {
      setError('Invalid email or password. Please use one of the demo accounts.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg border border-gray-200">
        <div className="flex flex-col items-center">
          <div className="bg-green-600 p-3 rounded-full mb-4">
            <Leaf className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">EcoSync</h1>
          <p className="text-gray-600">Please sign in to continue</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password"className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <LogIn className="h-5 w-5 text-green-500 group-hover:text-green-400" aria-hidden="true" />
              </span>
              Sign in
            </button>
          </div>
        </form>
        <div className="text-sm text-center text-gray-500 pt-4 border-t border-gray-200">
          <p className="font-semibold">Demo Accounts (password: 'password')</p>
          <p>Citizen: `citizen@demo.com`</p>
          <p>Worker: `worker@demo.com`</p>
          <p>Government: `gov@demo.com`</p>
        </div>
      </div>
    </div>
  );
}