
import { User, Event, Equipment, Booking, CheckIn, UserRole, EquipmentStatus, CheckInStatus } from '../types';

export const mockUsers: User[] = [
    { user_id: 1, name: 'Alice Johnson', email: 'alice@example.com', phone: '123-456-7890', role: UserRole.Organizer, roll_number: '202100001' },
    { user_id: 2, name: 'Bob Williams', email: 'bob@example.com', phone: '234-567-8901', role: UserRole.Volunteer, roll_number: '202100002' },
    { user_id: 3, name: 'Charlie Brown', email: 'charlie@example.com', phone: '345-678-9012', role: UserRole.Participant, roll_number: '202100003' },
    { user_id: 4, name: 'Diana Miller', email: 'diana@example.com', phone: '456-789-0123', role: UserRole.Participant, roll_number: '202100004' },
    { user_id: 5, name: 'Ethan Davis', email: 'ethan@example.com', phone: '567-890-1234', role: UserRole.Volunteer, roll_number: '202100005' },
];

export const mockEvents: Event[] = [
    { event_id: 101, event_name: 'Annual Tech Conference', event_date: '2024-08-15T09:00:00.000Z', venue: 'Main Auditorium', description: 'A conference about the latest trends in technology.', organizer_id: 1 },
    { event_id: 102, event_name: 'Summer Music Festival', event_date: '2024-07-20T14:00:00.000Z', venue: 'Central Park', description: 'An outdoor music festival featuring local bands.', organizer_id: 1 },
    { event_id: 103, event_name: 'Community Hackathon', event_date: '2024-09-05T10:00:00.000Z', venue: 'Innovation Hub', description: 'A 24-hour coding competition to solve local problems.', organizer_id: 5 },
    { event_id: 104, event_name: 'Art Exhibition Opening', event_date: '2023-11-01T18:00:00.000Z', venue: 'Downtown Gallery', description: 'Opening night for a new contemporary art exhibition.', organizer_id: 1 },
];

export const mockEquipment: Equipment[] = [
    { equip_id: 201, equip_name: 'Projector A', category: 'AV', status: EquipmentStatus.Available, location: 'Storage Room 1', purchase_date: '2022-01-15' },
    { equip_id: 202, equip_name: 'Microphone Kit (2 mics)', category: 'Audio', status: EquipmentStatus.Borrowed, location: 'AV Booth', purchase_date: '2022-03-20' },
    { equip_id: 203, equip_name: 'Laptop (Dell XPS 15)', category: 'IT', status: EquipmentStatus.Available, location: 'IT Office', purchase_date: '2023-05-10' },
    { equip_id: 204, equip_name: 'Portable Speaker', category: 'Audio', status: EquipmentStatus.Damaged, location: 'Storage Room 2', purchase_date: '2021-11-30' },
    { equip_id: 205, equip_name: 'VR Headset (Quest 3)', category: 'AV', status: EquipmentStatus.Available, location: 'Innovation Hub', purchase_date: '2024-02-01' },
];

export const mockBookings: Booking[] = [
    { booking_id: 301, event_id: 102, equip_id: 202, assigned_to: 2, borrow_date: '2024-07-19', return_date: null, remarks: 'For main stage announcements.' },
    { booking_id: 302, event_id: 101, equip_id: 201, assigned_to: 1, borrow_date: '2024-08-14', return_date: '2024-08-16' },
    { booking_id: 303, event_id: 103, equip_id: 203, assigned_to: 4, borrow_date: '2024-09-04', return_date: '2024-09-06' },
];

export const mockCheckIns: CheckIn[] = [
    { checkin_id: 401, user_id: 3, event_id: 101, checkin_time: '2024-08-15T09:05:00.000Z', checkout_time: null, status: CheckInStatus.Present },
    { checkin_id: 402, user_id: 4, event_id: 101, checkin_time: '2024-08-15T09:15:00.000Z', checkout_time: null, status: CheckInStatus.Present },
    { checkin_id: 403, user_id: 2, event_id: 102, checkin_time: '2024-07-20T13:45:00.000Z', checkout_time: null, status: CheckInStatus.Present },
    { checkin_id: 404, user_id: 3, event_id: 102, checkin_time: '2024-07-20T14:10:00.000Z', checkout_time: null, status: CheckInStatus.Present },
    { checkin_id: 405, user_id: 5, event_id: 103, checkin_time: '2024-09-05T09:55:00.000Z', checkout_time: null, status: CheckInStatus.Present },
];
