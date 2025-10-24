import React from 'react';

interface AvatarProps {
    name: string;
    size?: 'sm' | 'lg';
}

const Avatar: React.FC<AvatarProps> = ({ name, size = 'sm' }) => {
    
    const getInitials = (name: string): string => {
        const names = name.split(' ');
        if (names.length > 1 && names[names.length - 1]) {
            return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    const generateColor = (name: string): string => {
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
            hash = hash & hash; // Convert to 32bit integer
        }
        const colors = [
            'bg-red-500', 'bg-orange-500', 'bg-amber-500', 
            'bg-lime-500', 'bg-green-500', 'bg-emerald-500', 'bg-teal-500',
            'bg-cyan-500', 'bg-sky-500', 'bg-blue-500', 'bg-indigo-500',
            'bg-violet-500', 'bg-purple-500', 'bg-fuchsia-500', 'bg-pink-500',
            'bg-rose-500'
        ];
        const index = Math.abs(hash % colors.length);
        return colors[index];
    };

    const sizeClasses = size === 'lg' 
        ? 'h-20 w-20 text-3xl' 
        : 'h-10 w-10 text-base';

    const colorClass = generateColor(name);
    const initials = getInitials(name);

    return (
        <div className={`rounded-full flex-shrink-0 flex items-center justify-center font-bold text-white ${sizeClasses} ${colorClass}`}>
            <span>{initials}</span>
        </div>
    );
};

export default Avatar;
