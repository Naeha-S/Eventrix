
import React, { useState, useMemo } from 'react';
// FIX: Corrected import path for types
import { FullEquipment, Equipment, EquipmentStatus, Booking } from '../types';
import EquipmentDetailModal from './EquipmentDetailModal';
import { SearchIcon } from './icons/Icons';

interface EquipmentPageProps {
    equipment: FullEquipment[];
    bookings: Booking[];
    setEquipment: React.Dispatch<React.SetStateAction<Equipment[]>>;
    setBookings: React.Dispatch<React.SetStateAction<Booking[]>>;
}

const EquipmentPage: React.FC<EquipmentPageProps> = ({ equipment, bookings, setEquipment, setBookings }) => {
    const [selectedEquipment, setSelectedEquipment] = useState<FullEquipment | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<EquipmentStatus | 'All'>('All');

    const filteredEquipment = useMemo(() => {
        return equipment.filter(item => {
            const matchesSearch = item.equip_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.location.toLowerCase().includes(searchQuery.toLowerCase());
            
            const matchesStatus = statusFilter === 'All' || item.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [equipment, searchQuery, statusFilter]);
    
    const getStatusPill = (status: EquipmentStatus) => {
        const baseClasses = 'px-3 py-1 text-xs font-semibold rounded-full inline-block text-white';
        switch (status) {
            case EquipmentStatus.Available:
                return <span className={`${baseClasses} bg-green-500`}>Available</span>;
            case EquipmentStatus.Borrowed:
                return <span className={`${baseClasses} bg-yellow-500`}>Borrowed</span>;
            case EquipmentStatus.Damaged:
                return <span className={`${baseClasses} bg-red-500`}>Damaged</span>;
            default:
                return <span className={`${baseClasses} bg-gray-500`}>Unknown</span>;
        }
    };

    const handleReturn = (equipId: number) => {
        const bookingToEnd = bookings.find(b => b.equip_id === equipId && b.return_date === null);
        if (bookingToEnd) {
            setBookings(prev => prev.map(b => b.booking_id === bookingToEnd.booking_id ? { ...b, return_date: new Date().toISOString().split('T')[0] } : b));
        }
        setEquipment(prev => prev.map(e => e.equip_id === equipId ? { ...e, status: EquipmentStatus.Available } : e));
    };

    const handleMarkDamaged = (equipId: number) => {
        setEquipment(prev => prev.map(e => e.equip_id === equipId ? { ...e, status: EquipmentStatus.Damaged } : e));
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <h1 className="text-4xl font-bold text-primary">Equipment Inventory</h1>
            
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-grow">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                        <SearchIcon />
                    </span>
                    <input
                        type="text"
                        placeholder="Search by name, category, or location..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition"
                    />
                </div>
                <select 
                    value={statusFilter} 
                    onChange={e => setStatusFilter(e.target.value as EquipmentStatus | 'All')}
                    className="appearance-none border border-gray-200 rounded-lg py-3 px-4 text-text-main leading-tight focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                >
                    <option value="All">All Statuses</option>
                    <option value={EquipmentStatus.Available}>Available</option>
                    <option value={EquipmentStatus.Borrowed}>Borrowed</option>
                    <option value={EquipmentStatus.Damaged}>Damaged</option>
                </select>
            </div>
            
            <div className="bg-surface p-4 sm:p-6 rounded-xl shadow-md">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-background">
                            <tr>
                                <th className="p-3 text-sm font-semibold text-text-light uppercase tracking-wider">Name</th>
                                <th className="p-3 text-sm font-semibold text-text-light uppercase tracking-wider">Category</th>
                                <th className="p-3 text-sm font-semibold text-text-light uppercase tracking-wider">Location</th>
                                <th className="p-3 text-sm font-semibold text-text-light uppercase tracking-wider">Status</th>
                                <th className="p-3 text-sm font-semibold text-text-light uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEquipment.map(item => (
                                <tr key={item.equip_id} className="border-b border-gray-100 hover:bg-background transition-colors">
                                    <td className="p-4 font-medium text-text-main">{item.equip_name}</td>
                                    <td className="p-4 text-text-light">{item.category}</td>
                                    <td className="p-4 text-text-light">{item.location}</td>
                                    <td className="p-4">{getStatusPill(item.status)}</td>
                                    <td className="p-4 flex gap-2">
                                        {item.status === EquipmentStatus.Borrowed && (
                                            <button onClick={() => handleReturn(item.equip_id)} className="text-sm bg-blue-500 text-white py-1 px-3 rounded-md hover:bg-blue-600 transition">Return</button>
                                        )}
                                        {item.status !== EquipmentStatus.Damaged && (
                                            <button onClick={() => handleMarkDamaged(item.equip_id)} className="text-sm bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600 transition">Mark Damaged</button>
                                        )}
                                        <button onClick={() => setSelectedEquipment(item)} className="text-sm bg-gray-200 text-gray-700 py-1 px-3 rounded-md hover:bg-gray-300 transition">Details</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                     {filteredEquipment.length === 0 && (
                        <div className="text-center py-12">
                             <p className="text-text-light text-lg">No equipment found.</p>
                             <p className="text-sm text-gray-400 mt-1">Try adjusting your filters.</p>
                        </div>
                    )}
                </div>
            </div>
            {selectedEquipment && (
                <EquipmentDetailModal
                    equipment={selectedEquipment}
                    onClose={() => setSelectedEquipment(null)}
                />
            )}
        </div>
    );
};

export default EquipmentPage;
