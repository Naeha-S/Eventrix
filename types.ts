
export enum UserRole {
    Organizer = 'Organizer',
    Volunteer = 'Volunteer',
    Participant = 'Participant',
}

export enum EquipmentStatus {
    Available = 'Available',
    Borrowed = 'Borrowed',
    Damaged = 'Damaged',
}

export enum CheckInStatus {
    Present = 'Present',
    Absent = 'Absent',
}

export interface User {
    user_id: number;
    name: string;
    email: string;
    phone: string;
    role: UserRole;
    roll_number: string;
}

export interface Event {
    event_id: number;
    event_name: string;
    event_date: string; // ISO string
    venue: string;
    description: string;
    organizer_id: number;
}

export interface Equipment {
    equip_id: number;
    equip_name: string;
    category: string;
    status: EquipmentStatus;
    location: string;
    purchase_date: string; // YYYY-MM-DD
}

export interface Booking {
    booking_id: number;
    event_id: number;
    equip_id: number;
    assigned_to: number; // user_id
    borrow_date: string; // YYYY-MM-DD
    return_date: string | null; // YYYY-MM-DD
    remarks?: string;
}

export interface CheckIn {
    checkin_id: number;
    user_id: number;
    event_id: number;
    checkin_time: string; // ISO string
    checkout_time: string | null; // ISO string
    status: CheckInStatus;
}

// Enriched types for display

export interface FullCheckIn extends CheckIn {
    user_name: string;
    user_role: UserRole;
}

export interface FullBooking extends Booking {
    equip_name: string;
    user_name: string;
}

export interface FullEvent extends Event {
    organizer_name: string;
    attendees: FullCheckIn[];
    bookedEquipment: FullBooking[];
    attendee_count: number;
}

export interface FullUser extends User {
    organizedEvents: Event[];
    attendedEvents: Event[];
    bookingDetails: (Booking & { equip_name: string; event_name: string; })[];
    organized_events_count: number;
    attended_events_count: number;
}

export interface FullEquipment extends Equipment {
    bookingHistory: (Booking & { eventName: string; userName: string; })[];
}
