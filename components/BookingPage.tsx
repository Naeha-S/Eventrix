
import React, { useState, useMemo } from 'react';
// FIX: Corrected import path for types
import { Event, Equipment, User, Booking, EquipmentStatus } from '../types';

interface BookingPageProps {
    events: Event[];
    equipment: Equipment[];
    users: User[];
    bookings: Booking[];
    setBookings: React.Dispatch<React.SetStateAction<Booking[]>>;
    setEquipment: React.Dispatch<React.SetStateAction<Equipment[]>>;
}

const BookingPage: React.FC<BookingPageProps> = ({ events, equipment, users, bookings, setBookings, setEquipment }) => {
    const [selectedEventId, setSelectedEventId] = useState<string>('');
    const [selectedEquipmentId, setSelectedEquipmentId] = useState<string>('');
    const [selectedUserId, setSelectedUserId] = useState<string>('');
    const [remarks, setRemarks] = useState<string>('');
    const [successMessage, setSuccessMessage] = useState<string>('');

    const availableEquipment = equipment.filter(e => e.status === EquipmentStatus.Available);

    const enrichedBookings = useMemo(() => {
        return bookings.map(booking => {
            const event = events.find(e => e.event_id === booking.event_id);
            const equip = equipment.find(eq => eq.equip_id === booking.equip_id);
            const user = users.find(u => u.user_id === booking.assigned_to);

            return {
                ...booking,
                eventName: event?.event_name || 'N/A',
                equipmentName: equip?.equip_name || 'N/A',
                userName: user?.name || 'N/A',
            };
        }).sort((a, b) => new Date(b.borrow_date).getTime() - new Date(a.borrow_date).getTime());
    }, [bookings, events, equipment, users]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedEventId || !selectedEquipmentId || !selectedUserId) {
            alert('Please fill out all fields.');
            return;
        }

        const newBooking: Booking = {
            booking_id: bookings.length + 1,
            event_id: parseInt(selectedEventId, 10),
            equip_id: parseInt(selectedEquipmentId, 10),
            assigned_to: parseInt(selectedUserId, 10),
            borrow_date: new Date().toISOString().split('T')[0], // Today's date
            return_date: null,
            remarks: remarks,
        };

        setBookings(prevBookings => [...prevBookings, newBooking]);

        setEquipment(prevEquipment =>
            prevEquipment.map(item =>
                item.equip_id === newBooking.equip_id
                    ? { ...item, status: EquipmentStatus.Borrowed }
                    : item
            )
        );
        
        const bookedItemName = equipment.find(item => item.equip_id === newBooking.equip_id)?.equip_name;
        setSuccessMessage(`Successfully booked "${bookedItemName}"!`);

        setSelectedEventId('');
        setSelectedEquipmentId('');
        setSelectedUserId('');
        setRemarks('');

        setTimeout(() => setSuccessMessage(''), 4000);
    };

    const FormField: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
        <div>
            <label className="block text-text-main text-sm font-bold mb-2">{label}</label>
            {children}
        </div>
    );

    const selectClasses = "appearance-none border border-gray-200 rounded-lg w-full py-3 px-4 text-text-main leading-tight focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition";

    return (
        <div className="space-y-8 animate-fade-in">
            <h1 className="text-4xl font-bold text-primary">Book New Equipment</h1>
            
            <div className="bg-surface p-8 rounded-xl shadow-md max-w-2xl mx-auto">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {successMessage && (
                        <div className="bg-green-100 border-l-4 border-green-500 text-green-800 p-4 rounded-md" role="alert">
                            <p className="font-bold">Success</p>
                            <p>{successMessage}</p>
                        </div>
                    )}
                    <FormField label="Select Event">
                        <select
                            value={selectedEventId}
                            onChange={e => setSelectedEventId(e.target.value)}
                            className={selectClasses}
                        >
                            <option value="" disabled>Choose an event...</option>
                            {events.map(event => (
                                <option key={event.event_id} value={event.event_id}>{event.event_name}</option>
                            ))}
                        </select>
                    </FormField>

                    <FormField label="Select Available Equipment">
                        <select
                            value={selectedEquipmentId}
                            onChange={e => setSelectedEquipmentId(e.target.value)}
                            className={selectClasses}
                        >
                            <option value="" disabled>Choose equipment...</option>
                            {availableEquipment.map(item => (
                                <option key={item.equip_id} value={item.equip_id}>{item.equip_name} ({item.category})</option>
                            ))}
                        </select>
                    </FormField>
                    
                    <FormField label="Assign To User">
                        <select
                            value={selectedUserId}
                            onChange={e => setSelectedUserId(e.target.value)}
                            className={selectClasses}
                        >
                            <option value="" disabled>Choose a user...</option>
                            {users.map(user => (
                                <option key={user.user_id} value={user.user_id}>{user.name} ({user.role})</option>
                            ))}
                        </select>
                    </FormField>

                    <FormField label="Remarks (Optional)">
                        <textarea
                            value={remarks}
                            onChange={e => setRemarks(e.target.value)}
                            className={`${selectClasses} h-28`}
                            placeholder="e.g., For main stage presentation."
                        />
                    </FormField>
                    
                    <div className="flex items-center justify-end pt-4">
                        <button
                            type="submit"
                            className="bg-primary hover:bg-primary-focus text-white font-bold py-3 px-8 rounded-lg focus:outline-none focus:shadow-outline transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                            Book Equipment
                        </button>
                    </div>
                </form>
            </div>
            
            <div className="space-y-4 pt-4">
                <h2 className="text-3xl font-bold text-primary">Current Bookings</h2>
                <div className="bg-surface p-4 sm:p-6 rounded-xl shadow-md">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-background">
                                <tr>
                                    <th className="p-3 text-sm font-semibold text-text-light uppercase tracking-wider">Equipment</th>
                                    <th className="p-3 text-sm font-semibold text-text-light uppercase tracking-wider">Event</th>
                                    <th className="p-3 text-sm font-semibold text-text-light uppercase tracking-wider">Assigned To</th>
                                    <th className="p-3 text-sm font-semibold text-text-light uppercase tracking-wider">Borrow Date</th>
                                    <th className="p-3 text-sm font-semibold text-text-light uppercase tracking-wider">Return Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {enrichedBookings.map(booking => (
                                    <tr key={booking.booking_id} className="border-b border-gray-100">
                                        <td className="p-4 font-medium text-text-main">{booking.equipmentName}</td>
                                        <td className="p-4 text-text-light">{booking.eventName}</td>
                                        <td className="p-4 text-text-light">{booking.userName}</td>
                                        <td className="p-4 text-text-light">{new Date(booking.borrow_date).toLocaleDateString()}</td>
                                        <td className="p-4 text-text-light">
                                            {booking.return_date 
                                                ? new Date(booking.return_date).toLocaleDateString() 
                                                : <span className="italic text-gray-400">In Use</span>}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingPage;
