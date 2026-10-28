import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
export default function DashboardPage() {
    const [metrics, setMetrics] = useState({
        casesReceived: 0,
        aiProcessed: 0,
        pendingReview: 0,
        automationRate: 0,
    });
    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                setMetrics({
                    casesReceived: 24,
                    aiProcessed: 18,
                    pendingReview: 6,
                    automationRate: 75,
                });
            }
            catch (err) {
                console.error('Failed to fetch metrics', err);
            }
        };
        fetchMetrics();
    }, []);
    return (_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-white mb-8", children: "Dashboard" }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8", children: [_jsxs("div", { className: "bg-gray-800 border border-gray-700 rounded p-6", children: [_jsx("div", { className: "text-gray-400 text-sm font-medium", children: "Cases Received" }), _jsx("div", { className: "text-4xl font-bold text-white mt-2", children: metrics.casesReceived })] }), _jsxs("div", { className: "bg-gray-800 border border-gray-700 rounded p-6", children: [_jsx("div", { className: "text-gray-400 text-sm font-medium", children: "AI Processed" }), _jsx("div", { className: "text-4xl font-bold text-white mt-2", children: metrics.aiProcessed })] }), _jsxs("div", { className: "bg-gray-800 border border-gray-700 rounded p-6", children: [_jsx("div", { className: "text-gray-400 text-sm font-medium", children: "Pending Review" }), _jsx("div", { className: "text-4xl font-bold text-white mt-2", children: metrics.pendingReview })] }), _jsxs("div", { className: "bg-gray-800 border border-gray-700 rounded p-6", children: [_jsx("div", { className: "text-gray-400 text-sm font-medium", children: "Automation Rate" }), _jsxs("div", { className: "text-4xl font-bold text-white mt-2", children: [metrics.automationRate, "%"] })] })] }), _jsxs("div", { className: "bg-gray-800 border border-gray-700 rounded p-6", children: [_jsx("h2", { className: "text-lg font-semibold text-white mb-4", children: "Status" }), _jsx("p", { className: "text-gray-400", children: "Platform initialized. PHASE 1 complete." })] })] }));
}
