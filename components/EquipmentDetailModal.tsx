
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
// FIX: Corrected import path for types
import { FullEquipment } from '../types';

interface EquipmentDetailModalProps {
    equipment: FullEquipment;
    onClose: () => void;
}

const EquipmentDetailModal: React.FC<EquipmentDetailModalProps> = ({ equipment, onClose }) => {

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        const handleOutsideClick = (e: MouseEvent) => {
            const modalContent = document.querySelector('.modal-content');
            if (modalContent && !modalContent.contains(e.target as Node)) {
                onClose();
            }
        };
        
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('mousedown', handleOutsideClick);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [onClose]);

    const modalContent = (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-surface p-8 rounded-xl shadow-2xl w-full max-w-2xl modal-content transform transition-all animate-fade-in-up">
                <h2 className="text-2xl font-bold text-primary mb-2">{equipment.equip_name}</h2>
                <p className="text-sm text-text-light mb-6">Category: {equipment.category}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-text-main">
                    <p><span className="font-semibold">Status:</span> {equipment.status}</p>
                    <p><span className="font-semibold">Current Location:</span> {equipment.location}</p>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-100">
                    <h3 className="text-xl font-bold text-primary mb-4">Booking History</h3>
                    <div className="max-h-60 overflow-y-auto pr-2">
                        {equipment.bookingHistory.length > 0 ? (
                             <table className="w-full text-left">
                                <thead className="bg-background sticky top-0">
                                    <tr>
                                        <th className="p-2 text-sm font-semibold text-text-light">Event</th>
                                        <th className="p-2 text-sm font-semibold text-text-light">User</th>
                                        <th className="p-2 text-sm font-semibold text-text-light">Borrowed</th>
                                        <th className="p-2 text-sm font-semibold text-text-light">Returned</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {equipment.bookingHistory.map(b => (
                                        <tr key={b.booking_id} className="border-b border-gray-100">
                                            <td className="p-2 font-medium text-text-main text-sm">{b.eventName}</td>
                                            <td className="p-2 text-text-light text-sm">{b.userName}</td>
                                            <td className="p-2 text-text-light text-sm">{new Date(b.borrow_date).toLocaleDateString()}</td>
                                            <td className="p-2 text-text-light text-sm">{b.return_date ? new Date(b.return_date).toLocaleDateString() : <span className="italic">In Use</span>}</td>
                                        </tr>
                                    ))}
                                </tbody>
                             </table>
                        ) : (
                            <p className="text-center text-text-light py-4">No booking history for this item.</p>
                        )}
                    </div>
                </div>
                
                <div className="mt-8 flex justify-end">
                    <button
                        onClick={onClose}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-lg focus:outline-none focus:shadow-outline transition-all duration-300"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );

    const modalRoot = document.getElementById('modal-root');
    return modalRoot ? ReactDOM.createPortal(modalContent, modalRoot) : null;
};

export default EquipmentDetailModal;
