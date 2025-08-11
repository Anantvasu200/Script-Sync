import React from "react";

const ScriptSyncLogo = ({ className }) => (
    <svg
        className={className}
        width="40"
        height="40"
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Script Sync Logo"
    >
        {/* Circular sync arrows */}
        <circle cx="32" cy="32" r="28" stroke="#3B82F6" strokeWidth="4" />
        <path
            d="M20 24L28 16L36 24"
            stroke="#3B82F6"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M44 40L36 48L28 40"
            stroke="#3B82F6"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

export default function Logo({ className }) {
    return (
        <div className={`flex items-center space-x-2 ${className}`}>
            <ScriptSyncLogo className="text-blue-500" />
            <span className="text-xl font-bold text-blue-600 select-none" style={{ userSelect: 'none' }}>
                Script <span className="text-indigo-700">Sync</span>
            </span>
        </div>
    );
}
