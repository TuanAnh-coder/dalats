import type { Room } from "~/server/db/schema";

export type AdminTab = "overview" | "bookings" | "rooms" | "customers" | "messages";

export interface AdminBooking {
  id: number;
  bookingCode: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  totalPrice: number;
  status: "pending" | "confirmed" | "checked_in" | "completed" | "cancelled" | string;
  specialRequests?: string | null;
  createdAt?: Date | string | null;
  roomId?: number;
  room?: {
    id: number;
    name: string;
    roomNumber: string;
    image?: string | null;
  } | null;
}

export interface AdminCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  isRegistered: boolean;
  banned: boolean;
  totalBookings: number;
  totalSpent: number;
  lastBookingDate: string | null;
  vipTier: string;
  bookingCodes: string[];
  createdAt?: Date | string | null;
}

export interface RoomOccupancyOverview {
  today: string;
  totalRooms: number;
  occupiedCount: number;
  arrivingTodayCount: number;
  departingTodayCount: number;
  maintenanceCount: number;
  availableCount: number;
  rooms: Array<{
    room: Room;
    occupancy: {
      status: "occupied" | "arriving_today" | "departing_today" | "available" | "maintenance" | string;
      activeBooking?: {
        bookingCode: string;
        customerName: string;
        checkIn: string;
        checkOut: string;
        status: string;
      } | null;
    };
  }>;
}

export interface AdminMessage {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  message: string;
  createdAt: Date | string;
}
