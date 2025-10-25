import React, { useState } from 'react';
import { User, Event, CheckIn } from '../types';

interface StudentsPageProps {
    users: User[];
    events: Event[];
    checkIns: CheckIn[];
}

const StudentsPage: React.FC<StudentsPageProps> = ({ users, events, checkIns }) => {
    const [expandedUserId, setExpandedUserId] = useState<number | null>(null);

    const toggleExpand = (id: number) => {
        setExpandedUserId(prev => (prev === id ? null : id));
    };

    const attendedByUser = (userId: number) => {
        const eventIds = new Set(checkIns.filter(c => c.user_id === userId).map(c => c.event_id));
        return events.filter(e => eventIds.has(e.event_id));
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Students</h2>

            <div className="overflow-x-auto bg-surface rounded-lg shadow">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-background">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">Roll</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">Attended</th>
                            <th className="px-6 py-3" />
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        {users.map(user => {
                            const attended = attendedByUser(user.user_id);
                            return (
                                <React.Fragment key={user.user_id}>
                                    <tr>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.roll_number}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{attended.length}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => toggleExpand(user.user_id)}
                                                className="text-primary hover:underline"
                                            >
                                                {expandedUserId === user.user_id ? 'Hide' : 'Show'}
                                            </button>
                                        </td>
                                    </tr>
                                    {expandedUserId === user.user_id && (
                                        <tr>
                                            <td colSpan={5} className="bg-gray-50 px-6 py-4">
                                                {attended.length > 0 ? (
                                                    <ul className="list-disc pl-6">
                                                        {attended.map(ev => (
                                                            <li key={ev.event_id} className="text-sm text-gray-700">{ev.event_name} — {new Date(ev.event_date).toLocaleDateString()}</li>
                                                        ))}
                                                    </ul>
                                                ) : (
                                                    <div className="text-sm text-gray-500">No attended events</div>
                                                )}
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StudentsPage;
