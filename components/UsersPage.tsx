import React, { useState } from 'react';
// FIX: Corrected import path for types
import { FullUser, UserRole, User } from '../types';
import UserProfile from './UserProfile';
import Avatar from './Avatar'; // Import the new Avatar component
import { PlusCircleIcon } from './icons/Icons';

interface UsersPageProps {
    users: FullUser[];
    setUsers: React.Dispatch<React.SetStateAction<User[]>>;
}

const UsersPage: React.FC<UsersPageProps> = ({ users, setUsers }) => {
    const [selectedUser, setSelectedUser] = useState<FullUser | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newUserForm, setNewUserForm] = useState({ name: '', email: '', phone: '', role: 'Participant', roll_number: '' });

    const handleAddUser = async () => {
        if (!newUserForm.name || !newUserForm.email || !newUserForm.roll_number) {
            alert('Please fill all required fields');
            return;
        }
        try {
            const base = 'http://localhost:8081';
            const res = await fetch(`${base}/api/users`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newUserForm),
            });
            if (!res.ok) throw new Error('Failed to create user');
            const saved = await res.json();
            setUsers(prev => [...prev, saved]);
            setNewUserForm({ name: '', email: '', phone: '', role: 'Participant', roll_number: '' });
            setShowAddModal(false);
        } catch (err) {
            console.error(err);
            alert('Could not add user. Check console.');
        }
    };

    const handleDeleteUser = async (userId: number) => {
        if (!confirm('Are you sure you want to delete this user?')) return;
        try {
            const base = 'http://localhost:8081';
            const res = await fetch(`${base}/api/users/${userId}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete user');
            setUsers(prev => prev.filter(u => u.user_id !== userId));
        } catch (err) {
            console.error(err);
            alert('Could not delete user. Check console.');
        }
    };

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

    if (selectedUser) {
        return <UserProfile user={selectedUser} onBack={() => setSelectedUser(null)} />;
    }

    return (
         <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-4xl font-bold text-primary">Users</h1>
                <button 
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 bg-primary hover:bg-primary-focus text-white font-bold py-3 px-5 rounded-lg focus:outline-none focus:shadow-outline transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                    <PlusCircleIcon />
                    <span>Add New User</span>
                </button>
            </div>
            <div className="bg-surface p-4 sm:p-6 rounded-xl shadow-md">
                 <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-background">
                            <tr>
                                <th className="p-3 text-sm font-semibold text-text-light uppercase tracking-wider">Name</th>
                                <th className="p-3 text-sm font-semibold text-text-light uppercase tracking-wider">Email</th>
                                <th className="p-3 text-sm font-semibold text-text-light uppercase tracking-wider">Phone</th>
                                <th className="p-3 text-sm font-semibold text-text-light uppercase tracking-wider">Role</th>
                                <th className="p-3 text-sm font-semibold text-text-light uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr 
                                    key={user.user_id} 
                                    className="border-b border-gray-100 hover:bg-background cursor-pointer transition-colors"
                                    onClick={() => setSelectedUser(user)}
                                >
                                    <td className="p-4">
                                        <div className="flex items-center gap-4">
                                            <Avatar name={user.name} />
                                            <span className="font-medium text-text-main">{user.name}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-text-light">{user.email}</td>
                                    <td className="p-4 text-text-light">{user.phone}</td>
                                    <td className="p-4">
                                        {getRolePill(user.role)}
                                    </td>
                                    <td className="p-4">
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); handleDeleteUser(user.user_id); }}
                                            className="text-red-500 hover:text-red-700 font-semibold text-sm"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
                    <div className="bg-surface p-8 rounded-xl shadow-2xl w-full max-w-lg transform transition-all animate-fade-in-up">
                        <h2 className="text-2xl font-bold text-primary mb-6">Add New User</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-text-main text-sm font-bold mb-2">Name *</label>
                                <input 
                                    type="text" 
                                    value={newUserForm.name} 
                                    onChange={(e) => setNewUserForm({...newUserForm, name: e.target.value})}
                                    className="w-full p-2 border border-gray-200 rounded-lg"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-text-main text-sm font-bold mb-2">Email *</label>
                                <input 
                                    type="email" 
                                    value={newUserForm.email} 
                                    onChange={(e) => setNewUserForm({...newUserForm, email: e.target.value})}
                                    className="w-full p-2 border border-gray-200 rounded-lg"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-text-main text-sm font-bold mb-2">Roll Number *</label>
                                <input 
                                    type="text" 
                                    value={newUserForm.roll_number} 
                                    onChange={(e) => setNewUserForm({...newUserForm, roll_number: e.target.value})}
                                    className="w-full p-2 border border-gray-200 rounded-lg"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-text-main text-sm font-bold mb-2">Phone</label>
                                <input 
                                    type="text" 
                                    value={newUserForm.phone} 
                                    onChange={(e) => setNewUserForm({...newUserForm, phone: e.target.value})}
                                    className="w-full p-2 border border-gray-200 rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-text-main text-sm font-bold mb-2">Role</label>
                                <select 
                                    value={newUserForm.role} 
                                    onChange={(e) => setNewUserForm({...newUserForm, role: e.target.value})}
                                    className="w-full p-2 border border-gray-200 rounded-lg bg-white"
                                >
                                    <option value="Participant">Participant</option>
                                    <option value="Volunteer">Volunteer</option>
                                    <option value="Organizer">Organizer</option>
                                </select>
                            </div>
                            <div className="flex justify-end gap-4 pt-4">
                                <button 
                                    type="button" 
                                    onClick={() => setShowAddModal(false)}
                                    className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="button" 
                                    onClick={handleAddUser}
                                    className="bg-primary text-white font-bold py-2 px-4 rounded-lg"
                                >
                                    Add User
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UsersPage;
