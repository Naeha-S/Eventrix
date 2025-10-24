import React from 'react';

const iconProps = {
    className: "w-6 h-6",
    strokeWidth: 2,
    stroke: "currentColor",
    fill: "none",
    strokeLinecap: "round" as "round",
    strokeLinejoin: "round" as "round",
};
const smallIconProps = {
    ...iconProps,
    className: "w-5 h-5",
}

export const HomeIcon: React.FC = () => (
    <svg {...iconProps} viewBox="0 0 24 24">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
        <polyline points="9 22 9 12 15 12 15 22"></polyline>
    </svg>
);

export const CalendarIcon: React.FC = () => (
    <svg {...iconProps} viewBox="0 0 24 24">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="16" y1="2" x2="16" y2="6"></line>
        <line x1="8" y1="2" x2="8" y2="6"></line>
        <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
);

export const CogIcon: React.FC = () => (
    <svg {...iconProps} viewBox="0 0 24 24">
        <path d="M19.14,12.94a2,2,0,0,1,0,2.12l-1.14,2a2,2,0,0,0,.5,2.82l1.83,1.22a2,2,0,0,1,0,2.12l-1.14,2a2,2,0,0,0,.5,2.82l1.83,1.22a2,2,0,0,1,0,2.12"></path>
        <path d="M4.86,12.94a2,2,0,0,0,0,2.12l1.14,2a2,2,0,0,1-.5,2.82l-1.83,1.22a2,2,0,0,0,0,2.12l1.14,2a2,2,0,0,1-.5,2.82l-1.83,1.22a2,2,0,0,0,0,2.12"></path>
        <circle cx="12" cy="12" r="3"></circle>
    </svg>
);

export const UsersIcon: React.FC = () => (
    <svg {...iconProps} viewBox="0 0 24 24">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
);

export const BackArrowIcon: React.FC = () => (
    <svg {...iconProps} viewBox="0 0 24 24">
        <path d="M19 12H5"></path>
        <path d="M12 19l-7-7 7-7"></path>
    </svg>
);

export const PlusCircleIcon: React.FC = () => (
    <svg {...iconProps} viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="16"></line>
        <line x1="8" y1="12" x2="16" y2="12"></line>
    </svg>
);

export const EditIcon: React.FC = () => (
    <svg {...smallIconProps} viewBox="0 0 24 24">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
    </svg>
);

export const LogoutIcon: React.FC = () => (
    <svg {...iconProps} viewBox="0 0 24 24">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
        <polyline points="16 17 21 12 16 7"></polyline>
        <line x1="21" y1="12" x2="9" y2="12"></line>
    </svg>
);

export const SearchIcon: React.FC = () => (
    <svg {...smallIconProps} viewBox="0 0 24 24">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
);

export const SpinnerIcon: React.FC = () => (
    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

export const ExportIcon: React.FC = () => (
     <svg {...smallIconProps} viewBox="0 0 24 24">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="7 10 12 15 17 10"></polyline>
        <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>
);

export const LogoIcon: React.FC = () => (
    <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
      <line x1="9" y1="15" x2="15" y2="15"></line>
      <line x1="9" y1="18" x2="15" y2="18"></line>
    </svg>
);