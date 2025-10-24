import React, { useState } from 'react';
// FIX: Corrected import path for types
import { FullUser, UserRole } from '../types';
import UserProfile from './UserProfile';
import Avatar from './Avatar'; // Import the new Avatar component

interface UsersPageProps {
    users: FullUser[];
}

const UsersPage: React.FC<UsersPageProps> = ({ users }) => {
    const [selectedUser, setSelectedUser] = useState<FullUser | null>(null);

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
            <h1 className="text-4xl font-bold text-primary">Users</h1>
            <div className="bg-surface p-4 sm:p-6 rounded-xl shadow-md">
                 <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-background">
                            <tr>
                                <th className="p-3 text-sm font-semibold text-text-light uppercase tracking-wider">Name</th>
                                <th className="p-3 text-sm font-semibold text-text-light uppercase tracking-wider">Email</th>
                                <th className="p-3 text-sm font-semibold text-text-light uppercase tracking-wider">Phone</th>
                                <th className="p-3 text-sm font-semibold text-text-light uppercase tracking-wider">Role</th>
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
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default UsersPage;