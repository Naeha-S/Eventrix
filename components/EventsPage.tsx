
import React, { useState, useMemo } from 'react';
import { FullEvent, Event, User, CheckIn } from '../types';
import EventDetail from './EventDetail';
import EditEventModal from './EditEventModal';
import { PlusCircleIcon, SearchIcon, EditIcon } from './icons/Icons';

interface EventsPageProps {
    events: FullEvent[];
    setEvents: React.Dispatch<React.SetStateAction<Event[]>>;
    users: User[];
    checkIns: CheckIn[];
    setCheckIns: React.Dispatch<React.SetStateAction<CheckIn[]>>;
}

const EventsPage: React.FC<EventsPageProps> = ({ events, setEvents, users, checkIns, setCheckIns }) => {
    const [selectedEvent, setSelectedEvent] = useState<FullEvent | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [eventToEdit, setEventToEdit] = useState<Event | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredEvents = useMemo(() => {
        return events.filter(event =>
            event.event_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            event.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
            event.organizer_name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [events, searchQuery]);

    const handleCreateNew = () => {
        setEventToEdit(null);
        setIsModalOpen(true);
    };

    const handleEdit = (event: FullEvent) => {
        const basicEvent: Event = {
            event_id: event.event_id,
            event_name: event.event_name,
            event_date: event.event_date,
            venue: event.venue,
            description: event.description,
            organizer_id: event.organizer_id,
        }
        setEventToEdit(basicEvent);
        setIsModalOpen(true);
    };

    const handleSaveEvent = (event: Event) => {
        if (event.event_id === 0) { // New event
            const newEvent = { ...event, event_id: Date.now() };
            setEvents(prev => [...prev, newEvent]);
        } else { // Existing event
            setEvents(prev => prev.map(e => e.event_id === event.event_id ? event : e));
        }
    };
    
    if (selectedEvent) {
        return <EventDetail event={selectedEvent} onBack={() => setSelectedEvent(null)} users={users} setCheckIns={setCheckIns} />;
    }

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-4xl font-bold text-primary">Events</h1>
                <button 
                    onClick={handleCreateNew}
                    className="flex items-center gap-2 bg-primary hover:bg-primary-focus text-white font-bold py-3 px-5 rounded-lg focus:outline-none focus:shadow-outline transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                    <PlusCircleIcon />
                    <span>Create New Event</span>
                </button>
            </div>
            
            <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                    <SearchIcon />
                </span>
                <input
                    type="text"
                    placeholder="Search events by name, venue, or organizer..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map(event => (
                    <div key={event.event_id} className="bg-surface rounded-xl shadow-md p-6 flex flex-col justify-between hover:shadow-lg hover:-translate-y-1 transition-all">
                        <div>
                            <p className="text-sm text-secondary font-semibold">{new Date(event.event_date).toDateString()}</p>
                            <h2 className="text-xl font-bold text-primary mt-1 cursor-pointer" onClick={() => setSelectedEvent(event)}>{event.event_name}</h2>
                            <p className="text-sm text-text-light mt-2">{event.venue}</p>
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                            <div className="text-sm">
                                <p className="text-text-light">Attendees</p>
                                <p className="font-bold text-text-main">{event.attendee_count}</p>
                            </div>
                            <button onClick={() => handleEdit(event)} className="p-2 text-gray-400 hover:text-primary transition-colors">
                                <EditIcon />
                            </button>
                        </div>
                    </div>
                ))}
                 {filteredEvents.length === 0 && (
                        <div className="text-center py-12 md:col-span-2 lg:col-span-3">
                             <p className="text-text-light text-lg">No events found.</p>
                             <p className="text-sm text-gray-400 mt-1">Try adjusting your search or create a new event.</p>
                        </div>
                    )}
            </div>

            {isModalOpen && (
                <EditEventModal
                    event={eventToEdit}
                    users={users}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSaveEvent}
                />
            )}
        </div>
    );
};

export default EventsPage;
