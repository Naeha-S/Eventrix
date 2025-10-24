import React from 'react';
// FIX: Corrected import path for types
import { FullUser, UserRole } from '../types';
import { BackArrowIcon } from './icons/Icons';
import Avatar from './Avatar'; // Import the new Avatar component

interface UserProfileProps {
    user: FullUser;
    onBack: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, onBack }) => {

    const getRolePill = (role: UserRole) => {
        const baseClasses = 'px-3 py-1 text-xs font-semibold rounded-full inline-block text-white';
        switch (role) {
            case UserRole.Organizer:
                return <span className={`${baseClasses} bg-primary`}>Organizer</span>;
            case UserRole.Volunteer:
                return <span className={`${baseClasses} bg-secondary`}>Volunteer</span>;
            case UserRole.Participant:
                return <span className={`${baseClasses} bg-accent`}>Participant</span>;
            default:
                return <span className={`${baseClasses} bg-gray-500`}>Unknown</span>;
        }
    }
    
    const eventInvolvement = [
        ...user.organizedEvents.map(e => ({ ...e, involvement: 'Organizer' })),
        ...user.attendedEvents.map(e => ({ ...e, involvement: 'Attendee' }))
    ].sort((a, b) => new Date(b.event_date).getTime() - new Date(a.event_date).getTime());

    return (
        <div className="space-y-6 animate-fade-in">
            <button onClick={onBack} className="flex items-center text-primary font-semibold mb-2 hover:underline transition-colors">
                <BackArrowIcon />
                <span className="ml-2">Back to Users</span>
            </button>
            <div className="bg-surface p-8 rounded-xl shadow-md">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                    <Avatar name={user.name} size="lg" />
                    <div className="flex-1 text-center sm:text-left">
                        <h1 className="text-4xl font-bold text-primary">{user.name}</h1>
                        <div className="mt-2 inline-block">{getRolePill(user.role)}</div>
                        <div className="text-sm mt-3">
                            <p className="text-text-light">{user.email}</p>
                            <p className="text-text-light">{user.phone}</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-surface p-6 rounded-xl shadow-md">
                    <h2 className="text-2xl font-bold text-primary mb-4">Event Involvement</h2>
                    <ul className="space-y-3 max-h-96 overflow-y-auto pr-2">
                        {eventInvolvement.length > 0 ? eventInvolvement.map(event => (
                            <li key={`${event.event_id}-${event.involvement}`} className="p-3 bg-background rounded-lg flex justify-between items-center">
                                <div>
                                    <p className="font-semibold text-text-main">{event.event_name}</p>
                                    <p className="text-xs text-text-light">{new Date(event.event_date).toLocaleDateString()}</p>
                                </div>
                                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${event.involvement === 'Organizer' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                                    {event.involvement}
                                </span>
                            </li>
                        )) : <p className="text-text-light text-center py-4">No event history found.</p>}
                    </ul>
                </div>

                <div className="bg-surface p-6 rounded-xl shadow-md">
                    <h2 className="text-2xl font-bold text-primary mb-4">Booking History</h2>
                    <div className="overflow-x-auto max-h-96">
                        <table className="w-full text-left">
                            <thead className="bg-background sticky top-0">
                                <tr>
                                    <th className="p-3 text-sm font-semibold text-text-light">Equipment</th>
                                    <th className="p-3 text-sm font-semibold text-text-light">Event</th>
                                    <th className="p-3 text-sm font-semibold text-text-light">Borrowed</th>
                                </tr>
                            </thead>
                            <tbody>
                                {user.bookingDetails.length > 0 ? user.bookingDetails.map(booking => (
                                    <tr key={booking.booking_id} className="border-b border-gray-100">
                                        <td className="p-3 font-medium text-text-main">{booking.equip_name}</td>
                                        <td className="p-3 text-text-light text-sm">{booking.event_name}</td>
                                        <td className="p-3 text-gray-500 text-xs">{new Date(booking.borrow_date).toLocaleDateString()}</td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={3} className="text-center py-8 text-text-light">No booking history found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default UserProfile;