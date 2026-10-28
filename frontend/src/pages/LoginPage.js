import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';
import { useAuthStore } from '../stores/authStore';
export default function LoginPage() {
    const [username, setUsername] = useState('demo');
    const [password, setPassword] = useState('demo');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuthStore();
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            const response = await client.post('/auth/login', {
                username,
                password,
            });
            if (response.data.access_token) {
                login(response.data.access_token, {
                    id: '1',
                    username,
                    email: `${username}@test.local`,
                    role: 'admin',
                });
                navigate('/');
            }
        }
        catch (err) {
            setError(err.response?.data?.detail || 'Login failed');
        }
        finally {
            setIsLoading(false);
        }
    };
    return (_jsx("div", { className: "min-h-screen bg-gray-900 flex items-center justify-center p-4", children: _jsxs("div", { className: "bg-gray-800 p-10 rounded-lg shadow-2xl w-full max-w-md border border-gray-700", children: [_jsx("h1", { className: "text-3xl font-bold text-white mb-2", children: "Insurance" }), _jsx("p", { className: "text-gray-400 mb-8", children: "Operation Agent" }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-gray-300 text-sm font-medium mb-2", children: "Username" }), _jsx("input", { type: "text", value: username, onChange: (e) => setUsername(e.target.value), className: "w-full bg-gray-700 text-white px-4 py-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-gray-300 text-sm font-medium mb-2", children: "Password" }), _jsx("input", { type: "password", value: password, onChange: (e) => setPassword(e.target.value), className: "w-full bg-gray-700 text-white px-4 py-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none" })] }), error && _jsx("div", { className: "bg-red-900/60 text-red-200 border border-red-700 p-3 rounded text-sm", children: error }), _jsx("button", { type: "submit", disabled: isLoading, className: "w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-medium py-2 rounded transition duration-150", children: isLoading ? 'Signing in...' : 'Sign In' })] }), _jsx("p", { className: "text-gray-400 text-xs mt-6", children: "Demo: username=demo, password=demo" })] }) }));
}
