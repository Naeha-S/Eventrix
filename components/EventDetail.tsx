
import React, { useState } from 'react';
// FIX: Corrected import path for types
import { FullEvent, CheckInStatus, User, CheckIn } from '../types';
import { BackArrowIcon } from './icons/Icons';

interface EventDetailProps {
    event: FullEvent;
    onBack: () => void;
    users: User[];
    setCheckIns: React.Dispatch<React.SetStateAction<CheckIn[]>>;
}

const EventDetail: React.FC<EventDetailProps> = ({ event, onBack, users, setCheckIns }) => {
    const [rollNumber, setRollNumber] = useState('');
    const [nameSearch, setNameSearch] = useState('');
    const [searchResults, setSearchResults] = useState<User[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | 'info', message: string } | null>(null);

    const handleNameSearch = (value: string) => {
        setNameSearch(value);
        if (value.trim().length >= 2) {
            const filtered = users.filter(u => 
                u.name.toLowerCase().includes(value.toLowerCase()) ||
                u.roll_number.includes(value)
            ).slice(0, 10); // Limit to 10 results
            setSearchResults(filtered);
            setShowDropdown(filtered.length > 0);
        } else {
            setSearchResults([]);
            setShowDropdown(false);
        }
    };

    const markAttendance = (user: User) => {
        const isAlreadyCheckedIn = event.attendees.some(attendee => attendee.user_id === user.user_id);
        if (isAlreadyCheckedIn) {
            setFeedback({ type: 'info', message: `${user.name} is already marked as present.` });
            setNameSearch('');
            setRollNumber('');
            setShowDropdown(false);
            return;
        }

        const newCheckIn: CheckIn = {
            checkin_id: Date.now(),
            user_id: user.user_id,
            event_id: event.event_id,
            checkin_time: new Date().toISOString(),
            checkout_time: null,
            status: CheckInStatus.Present,
        };

        // Persist to backend
        (async () => {
            try {
                const base = 'http://localhost:8081';
                const res = await fetch(`${base}/api/checkins`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newCheckIn),
                });
                if (!res.ok) throw new Error('Failed to create check-in');
                const saved = await res.json();
                setCheckIns(prev => [...prev, saved]);
                setFeedback({ type: 'success', message: `Successfully marked ${user.name} as present.` });
            } catch (err) {
                console.error(err);
                setFeedback({ type: 'error', message: `Failed to mark ${user.name} as present.` });
            }
            setNameSearch('');
            setRollNumber('');
            setShowDropdown(false);
            setTimeout(() => setFeedback(null), 4000);
        })();
    };

    const handleAttendanceSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setFeedback(null);

        if (rollNumber.trim()) {
            if (!/^\d{9}$/.test(rollNumber)) {
                setFeedback({ type: 'error', message: 'Please enter a valid 9-digit roll number.' });
                return;
            }

            const user = users.find(u => u.roll_number === rollNumber);
            if (!user) {
                setFeedback({ type: 'error', message: `No user found with roll number ${rollNumber}.` });
                return;
            }

            markAttendance(user);
        } else if (nameSearch.trim()) {
            const exactMatch = users.find(u => 
                u.name.toLowerCase() === nameSearch.toLowerCase()
            );
            if (exactMatch) {
                markAttendance(exactMatch);
            } else {
                setFeedback({ type: 'error', message: 'Please select a student from the dropdown or enter their roll number.' });
            }
        } else {
            setFeedback({ type: 'error', message: 'Please enter a student name or roll number.' });
        }
    };

    const TableContainer: React.FC<{ children: React.ReactNode; title: string }> = ({ children, title }) => (
        <div className="bg-surface p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-bold text-primary mb-4">{title}</h2>
            {children}
        </div>
    );

    return (
        <div className="space-y-6 animate-fade-in">
            <button onClick={onBack} className="flex items-center text-primary font-semibold mb-2 hover:underline transition-colors">
                <BackArrowIcon />
                <span className="ml-2">Back to Events</span>
            </button>
            <div className="bg-surface p-8 rounded-xl shadow-md">
                <p className="text-md text-secondary font-semibold">{new Date(event.event_date).toDateString()}</p>
                <h1 className="text-4xl font-bold text-primary mt-1">{event.event_name}</h1>
                <p className="mt-4 text-text-light max-w-3xl">{event.description}</p>
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm border-t border-gray-100 pt-6">
                    <div>
                        <p className="font-semibold text-gray-400 uppercase text-xs tracking-wider">Venue</p>
                        <p className="font-medium text-text-main text-base">{event.venue}</p>
                    </div>
                     <div>
                        <p className="font-semibold text-gray-400 uppercase text-xs tracking-wider">Organizer</p>
                        <p className="font-medium text-text-main text-base">{event.organizer_name}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <TableContainer title="Attendance">
                    <div className="mb-6 pb-6 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-text-main mb-3">Mark Attendance</h3>
                        <form onSubmit={handleAttendanceSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="relative">
                                    <label htmlFor="nameSearch" className="block text-sm font-medium text-gray-700 mb-1">
                                        Search by Name
                                    </label>
                                    <input
                                        id="nameSearch"
                                        type="text"
                                        value={nameSearch}
                                        onChange={(e) => handleNameSearch(e.target.value)}
                                        onFocus={() => nameSearch.length >= 2 && setShowDropdown(searchResults.length > 0)}
                                        placeholder="Type student name..."
                                        className="appearance-none border border-gray-200 rounded-lg w-full py-3 px-4 text-text-main leading-tight focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition"
                                    />
                                    {showDropdown && (
                                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                            {searchResults.map(user => (
                                                <button
                                                    key={user.user_id}
                                                    type="button"
                                                    onClick={() => markAttendance(user)}
                                                    className="w-full text-left px-4 py-2 hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0"
                                                >
                                                    <div className="font-medium text-text-main">{user.name}</div>
                                                    <div className="text-sm text-gray-500">{user.roll_number} • {user.email}</div>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label htmlFor="rollNumber" className="block text-sm font-medium text-gray-700 mb-1">
                                        Or Enter Roll Number
                                    </label>
                                    <input
                                        id="rollNumber"
                                        type="text"
                                        value={rollNumber}
                                        onChange={(e) => setRollNumber(e.target.value.replace(/\D/g, ''))}
                                        maxLength={9}
                                        placeholder="9-digit roll number"
                                        className="appearance-none border border-gray-200 rounded-lg w-full py-3 px-4 text-text-main leading-tight focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition"
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="bg-primary hover:bg-primary-focus text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 w-full md:w-auto"
                            >
                                Mark Present
                            </button>
                        </form>
                        {feedback && (
                            <div className={`mt-4 p-3 rounded-md text-sm font-semibold ${
                                feedback.type === 'success' ? 'bg-green-100 text-green-800' :
                                feedback.type === 'error' ? 'bg-red-100 text-red-700' :
                                'bg-blue-100 text-blue-800'
                            }`}>
                                {feedback.message}
                            </div>
                        )}
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-background">
                                <tr>
                                    <th className="p-3 text-sm font-semibold text-text-light">Name</th>
                                    <th className="p-3 text-sm font-semibold text-text-light">Role</th>
                                    <th className="p-3 text-sm font-semibold text-text-light">Status</th>
                                    <th className="p-3 text-sm font-semibold text-text-light">Check-in</th>
                                </tr>
                            </thead>
                            <tbody>
                                {event.attendees.map(c => (
                                    <tr key={c.checkin_id} className="border-b border-gray-100">
                                        <td className="p-3 font-medium text-text-main">{c.user_name}</td>
                                        <td className="p-3 text-text-light">{c.user_role}</td>
                                        <td className="p-3">
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${c.status === CheckInStatus.Present ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{c.status}</span>
                                        </td>
                                        <td className="p-3 text-sm text-gray-500">{new Date(c.checkin_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                                    </tr>
                                ))}
                                {event.attendees.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="text-center py-8 text-text-light">No attendees checked in yet.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </TableContainer>

                <TableContainer title="Booked Equipment">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-background">
                                <tr>
                                    <th className="p-3 text-sm font-semibold text-text-light">Item</th>
                                    <th className="p-3 text-sm font-semibold text-text-light">Assigned To</th>
                                    <th className="p-3 text-sm font-semibold text-text-light">Borrow Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {event.bookedEquipment.map(b => (
                                    <tr key={b.booking_id} className="border-b border-gray-100">
                                        <td className="p-3 font-medium text-text-main">{b.equip_name}</td>
                                        <td className="p-3 text-text-light">{b.user_name}</td>
                                        <td className="p-3 text-sm text-gray-500">{new Date(b.borrow_date).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                                 {event.bookedEquipment.length === 0 && (
                                    <tr>
                                        <td colSpan={3} className="text-center py-8 text-text-light">No equipment booked for this event.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </TableContainer>
            </div>
        </div>
    );
};

export default EventDetail;
