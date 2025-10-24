
import React from 'react';
import { FullEvent, Equipment, FullUser } from '../types';
import Card from './Card';
import { CalendarIcon, CogIcon, UsersIcon } from './icons/Icons';

interface DashboardProps {
    events: FullEvent[];
    equipment: Equipment[];
    users: FullUser[];
}

const Dashboard: React.FC<DashboardProps> = ({ events, equipment, users }) => {

    const upcomingEvents = events.filter(e => new Date(e.event_date) >= new Date()).slice(0, 5);
    const recentActivity = users.flatMap(u => 
        u.attendedEvents.map(e => ({ type: 'attendance', userName: u.name, eventName: e.event_name, date: e.event_date }))
    ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);
    
    return (
        <div className="space-y-8 animate-fade-in">
            <h1 className="text-4xl font-bold text-primary">Dashboard</h1>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card title="Total Events" value={events.length.toString()} icon={<CalendarIcon />} />
                <Card title="Equipment Items" value={equipment.length.toString()} icon={<CogIcon />} />
                <Card title="Registered Users" value={users.length.toString()} icon={<UsersIcon />} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Upcoming Events */}
                <div className="bg-surface p-6 rounded-xl shadow-md">
                    <h2 className="text-2xl font-bold text-primary mb-4">Upcoming Events</h2>
                    <div className="space-y-4">
                        {upcomingEvents.length > 0 ? (
                            upcomingEvents.map(event => (
                                <div key={event.event_id} className="p-4 bg-background rounded-lg">
                                    <p className="font-semibold text-text-main">{event.event_name}</p>
                                    <p className="text-sm text-text-light">{new Date(event.event_date).toLocaleDateString()} at {event.venue}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-text-light text-center py-4">No upcoming events scheduled.</p>
                        )}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-surface p-6 rounded-xl shadow-md">
                    <h2 className="text-2xl font-bold text-primary mb-4">Recent Activity</h2>
                     <div className="space-y-3">
                        {recentActivity.length > 0 ? (
                            recentActivity.map((activity, index) => (
                                <div key={index} className="flex items-center space-x-3 p-2 bg-background rounded-lg">
                                    <div className="bg-secondary text-white rounded-full h-8 w-8 flex-shrink-0 flex items-center justify-center text-sm font-bold">
                                        {activity.userName.charAt(0)}
                                    </div>
                                    <p className="text-sm text-text-main">
                                        <span className="font-semibold">{activity.userName}</span> attended <span className="font-semibold">{activity.eventName}</span>.
                                    </p>
                                </div>
                            ))
                        ) : (
                            <p className="text-text-light text-center py-4">No recent user activity.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
