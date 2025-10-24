
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Event, User } from '../types';

interface EditEventModalProps {
    event: Event | null;
    users: User[];
    onClose: () => void;
    onSave: (event: Event) => void;
}

const EditEventModal: React.FC<EditEventModalProps> = ({ event, users, onClose, onSave }) => {
    const [formData, setFormData] = useState<Event>({
        event_id: 0,
        event_name: '',
        event_date: '',
        venue: '',
        description: '',
        organizer_id: 0,
    });

    useEffect(() => {
        if (event) {
            setFormData({
                ...event,
                event_date: event.event_date.split('T')[0] // Format for date input
            });
        } else {
            setFormData({
                event_id: 0,
                event_name: '',
                event_date: '',
                venue: '',
                description: '',
                organizer_id: users[0]?.user_id || 0,
            });
        }
    }, [event, users]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const eventToSave: Event = {
            ...formData,
            event_id: formData.event_id,
            organizer_id: Number(formData.organizer_id),
            event_date: new Date(formData.event_date).toISOString(),
        }
        onSave(eventToSave);
        onClose();
    };

    const modalContent = (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-surface p-8 rounded-xl shadow-2xl w-full max-w-lg transform transition-all animate-fade-in-up">
                <h2 className="text-2xl font-bold text-primary mb-6">{event ? 'Edit Event' : 'Create New Event'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-text-main text-sm font-bold mb-2">Event Name</label>
                        <input type="text" name="event_name" value={formData.event_name} onChange={handleChange} required className="w-full p-2 border border-gray-200 rounded-lg" />
                    </div>
                     <div>
                        <label className="block text-text-main text-sm font-bold mb-2">Date</label>
                        <input type="date" name="event_date" value={formData.event_date} onChange={handleChange} required className="w-full p-2 border border-gray-200 rounded-lg" />
                    </div>
                     <div>
                        <label className="block text-text-main text-sm font-bold mb-2">Venue</label>
                        <input type="text" name="venue" value={formData.venue} onChange={handleChange} required className="w-full p-2 border border-gray-200 rounded-lg" />
                    </div>
                    <div>
                        <label className="block text-text-main text-sm font-bold mb-2">Organizer</label>
                        <select name="organizer_id" value={formData.organizer_id} onChange={handleChange} required className="w-full p-2 border border-gray-200 rounded-lg bg-white">
                            {users.map(u => <option key={u.user_id} value={u.user_id}>{u.name}</option>)}
                        </select>
                    </div>
                     <div>
                        <label className="block text-text-main text-sm font-bold mb-2">Description</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} required className="w-full p-2 border border-gray-200 rounded-lg h-24" />
                    </div>
                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg">Cancel</button>
                        <button type="submit" className="bg-primary text-white font-bold py-2 px-4 rounded-lg">{event ? 'Save Changes' : 'Create Event'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
    
    const modalRoot = document.getElementById('modal-root');
    return modalRoot ? ReactDOM.createPortal(modalContent, modalRoot) : null;
};

export default EditEventModal;
