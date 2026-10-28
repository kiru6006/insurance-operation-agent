import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
export default function Layout() {
    const { logout } = useAuthStore();
    const navigate = useNavigate();
    const handleLogout = () => {
        logout();
        navigate('/login');
    };
    return (_jsxs("div", { className: "flex h-screen bg-gray-900", children: [_jsxs("aside", { className: "w-64 bg-gray-800 border-r border-gray-700 p-6 flex flex-col", children: [_jsx("h1", { className: "text-2xl font-bold text-white mb-8", children: "Insurance Agent" }), _jsx("nav", { className: "space-y-4 flex-1", children: _jsx("a", { href: "/", className: "block text-gray-300 hover:text-white text-sm", children: "Dashboard" }) }), _jsx("button", { onClick: handleLogout, className: "w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm font-medium transition duration-150", children: "Logout" })] }), _jsxs("div", { className: "flex-1 flex flex-col", children: [_jsx("header", { className: "bg-gray-800 border-b border-gray-700 px-6 py-4", children: _jsx("h2", { className: "text-white text-lg font-semibold", children: "Dashboard" }) }), _jsx("main", { className: "flex-1 overflow-auto p-6 bg-gray-900", children: _jsx(Outlet, {}) })] })] }));
}
