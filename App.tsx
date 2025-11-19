
import React, { useState, useMemo, useEffect } from 'react';
// FIX: Corrected import paths with './'
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import EventsPage from './components/EventsPage';
import EquipmentPage from './components/EquipmentPage';
import UsersPage from './components/UsersPage';
import BookingPage from './components/BookingPage';
import LoginPage from './components/LoginPage';
import StudentsPage from './components/StudentsPage';

// Using local mock data directly instead of backend
import { User, Event, Equipment, Booking, CheckIn, FullEvent, FullUser, UserRole, FullEquipment } from './types';
import { mockUsers, mockEvents, mockEquipment, mockBookings, mockCheckIns } from './data/mockData';

type Page = 'dashboard' | 'events' | 'equipment' | 'users' | 'bookings' | 'students';

const App: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentPage, setCurrentPage] = useState<Page>('dashboard');
    
    // State initialized with mock data directly
    const [users, setUsers] = useState<User[]>(mockUsers);
    const [events, setEvents] = useState<Event[]>(mockEvents);
    const [equipment, setEquipment] = useState<Equipment[]>(mockEquipment);
    const [bookings, setBookings] = useState<Booking[]>(mockBookings);
    const [checkIns, setCheckIns] = useState<CheckIn[]>(mockCheckIns);

    // No backend fetch needed - using local data
    useEffect(() => {
        console.log('Eventrix loaded with mock data:');
        console.log('Users:', users.length);
        console.log('Events:', events.length);
        console.log('Equipment:', equipment.length);
        console.log('Bookings:', bookings.length);
        console.log('Check-ins:', checkIns.length);
    }, []);

    // Memoized, enriched data for performance
    const fullEvents: FullEvent[] = useMemo(() => {
        return events.map(event => {
            const organizer = users.find(u => u.user_id === event.organizer_id);
            const attendeesForEvent = checkIns.filter(c => c.event_id === event.event_id);
            const bookedEquipmentForEvent = bookings.filter(b => b.event_id === event.event_id);

            return {
                ...event,
                organizer_name: organizer?.name || 'N/A',
                attendees: attendeesForEvent.map(c => {
                    const user = users.find(u => u.user_id === c.user_id);
                    return { ...c, user_name: user?.name || 'N/A', user_role: user?.role || UserRole.Participant };
                }),
                bookedEquipment: bookedEquipmentForEvent.map(b => {
                    const equip = equipment.find(e => e.equip_id === b.equip_id);
                    const user = users.find(u => u.user_id === b.assigned_to);
                    return { ...b, equip_name: equip?.equip_name || 'N/A', user_name: user?.name || 'N/A' };
                }),
                attendee_count: attendeesForEvent.length,
            };
        }).sort((a, b) => new Date(b.event_date).getTime() - new Date(a.event_date).getTime());
    }, [events, users, checkIns, bookings, equipment]);

    const fullUsers: FullUser[] = useMemo(() => {
        return users.map(user => {
            const organized = events.filter(e => e.organizer_id === user.user_id);
            const attendedEventIds = new Set(checkIns.filter(c => c.user_id === user.user_id).map(c => c.event_id));
            const attended = events.filter(e => attendedEventIds.has(e.event_id));
            const userBookings = bookings.filter(b => b.assigned_to === user.user_id);

            return {
                ...user,
                organizedEvents: organized,
                attendedEvents: attended,
                bookingDetails: userBookings.map(b => {
                    const equip = equipment.find(e => e.equip_id === b.equip_id);
                    const event = events.find(e => e.event_id === b.event_id);
                    return { ...b, equip_name: equip?.equip_name || 'N/A', event_name: event?.event_name || 'N/A' };
                }),
                organized_events_count: organized.length,
                attended_events_count: attended.length,
            };
        });
    }, [users, events, checkIns, bookings, equipment]);

    const fullEquipmentData: FullEquipment[] = useMemo(() => {
        return equipment.map(item => {
            const history = bookings
                .filter(b => b.equip_id === item.equip_id)
                .map(b => {
                    const event = events.find(e => e.event_id === b.event_id);
                    const user = users.find(u => u.user_id === b.assigned_to);
                    return {
                        ...b,
                        eventName: event?.event_name || 'N/A',
                        userName: user?.name || 'N/A',
                    };
                })
                .sort((a, b) => new Date(b.borrow_date).getTime() - new Date(a.borrow_date).getTime());
            
            return {
                ...item,
                bookingHistory: history,
            }
        });
    }, [equipment, bookings, events, users]);

    const renderPage = () => {
        switch (currentPage) {
            case 'dashboard':
                return <Dashboard events={fullEvents} equipment={equipment} users={fullUsers} />;
            case 'events':
                return <EventsPage events={fullEvents} setEvents={setEvents} users={users} checkIns={checkIns} setCheckIns={setCheckIns} />;
            case 'equipment':
                return <EquipmentPage equipment={fullEquipmentData} bookings={bookings} setEquipment={setEquipment} setBookings={setBookings} />;
            case 'users':
                return <UsersPage users={fullUsers} setUsers={setUsers} />;
            case 'students':
                return <StudentsPage users={users} events={events} checkIns={checkIns} />;
            case 'bookings':
                return <BookingPage events={events} equipment={equipment} users={users} bookings={bookings} setBookings={setBookings} setEquipment={setEquipment} />;
            default:
                return <Dashboard events={fullEvents} equipment={equipment} users={fullUsers} />;
        }
    };

    if (!isAuthenticated) {
        return <LoginPage onLoginSuccess={() => setIsAuthenticated(true)} />;
    }

    return (
        <div className={`flex h-screen bg-background font-sans animate-fade-in`}>
            <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} onLogout={() => setIsAuthenticated(false)} />
            <main className="flex-1 p-6 sm:p-8 md:p-10 overflow-y-auto">
                {renderPage()}
            </main>
        </div>
    );
};

export default App;
