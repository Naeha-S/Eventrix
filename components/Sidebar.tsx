import React from 'react';
import { CalendarIcon, CogIcon, UsersIcon, HomeIcon, PlusCircleIcon, LogoIcon, LogoutIcon } from './icons/Icons';

type Page = 'dashboard' | 'events' | 'equipment' | 'users' | 'bookings' | 'students';

interface SidebarProps {
    currentPage: Page;
    setCurrentPage: (page: Page) => void;
    onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPage, setCurrentPage, onLogout }) => {
    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: <HomeIcon /> },
        { id: 'events', label: 'Events', icon: <CalendarIcon /> },
        { id: 'equipment', label: 'Equipment', icon: <CogIcon /> },
        { id: 'users', label: 'Users', icon: <UsersIcon /> },
        { id: 'students', label: 'Students', icon: <UsersIcon /> },
        { id: 'bookings', label: 'Book Equipment', icon: <PlusCircleIcon /> },
    ];

    return (
        <aside className="bg-surface text-primary w-16 sm:w-20 md:w-64 flex flex-col transition-all duration-300 shadow-lg">
            <div className="flex items-center justify-center md:justify-start md:pl-6 h-20 border-b border-gray-100">
                 <div className="bg-primary p-2 rounded-lg shadow-md">
                    <LogoIcon />
                 </div>
                <h1 className="hidden md:block ml-3 text-2xl font-bold text-primary">Eventrix</h1>
            </div>
            <nav className="flex-1 px-2 md:px-4 py-4">
                {navItems.map(item => (
                    <button
                        key={item.id}
                        onClick={() => setCurrentPage(item.id as Page)}
                        className={`flex items-center w-full p-3 my-2 rounded-lg transition-all duration-200 font-semibold ${
                            currentPage === item.id
                                ? 'bg-primary text-white shadow-lg -translate-y-px'
                                : 'text-text-light hover:bg-background hover:text-primary'
                        }`}
                    >
                        {item.icon}
                        <span className="hidden md:block ml-4">{item.label}</span>
                    </button>
                ))}
            </nav>
            <div className="px-2 md:px-4 py-4 border-t border-gray-100">
                <button
                    onClick={onLogout}
                    className="flex items-center w-full p-3 rounded-lg transition-colors duration-200 font-semibold text-text-light hover:bg-background hover:text-primary"
                >
                    <LogoutIcon />
                    <span className="hidden md:block ml-4">Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;