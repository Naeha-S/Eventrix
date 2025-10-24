import React from 'react';

interface CardProps {
    title: string;
    value: string;
    icon: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ title, value, icon }) => {
    return (
        <div className="bg-surface p-6 rounded-xl shadow-md flex items-center justify-between transition-all hover:shadow-lg hover:-translate-y-1">
            <div>
                <p className="text-sm font-medium text-text-light uppercase tracking-wider">{title}</p>
                <p className="text-3xl font-bold text-primary">{value}</p>
            </div>
            <div className="bg-gradient-to-br from-secondary to-primary text-white p-4 rounded-full shadow-lg">
                {icon}
            </div>
        </div>
    );
};

export default Card;