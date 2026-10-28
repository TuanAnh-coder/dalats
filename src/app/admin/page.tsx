"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { authClient } from "~/server/better-auth/client";
import { isAdminRole, isStaffRole } from "~/lib/roles";
import type { Room } from "~/server/db/schema";

import { DashboardSidebar } from "~/components/admin/dashboard/DashboardSidebar";
import { DashboardHeader } from "~/components/admin/dashboard/DashboardHeader";
import { OverviewTab } from "~/components/admin/dashboard/OverviewTab";
import { BookingsTab } from "~/components/admin/dashboard/BookingsTab";
import { RoomsTab } from "~/components/admin/dashboard/RoomsTab";
import { CustomersTab } from "~/components/admin/dashboard/CustomersTab";
import { MessagesTab } from "~/components/admin/dashboard/MessagesTab";
import { AddRoomDialog } from "~/components/admin/dashboard/AddRoomDialog";
import { EditRoomDialog } from "~/components/admin/dashboard/EditRoomDialog";
import { CustomerDetailDialog } from "~/components/admin/dashboard/CustomerDetailDialog";
import type {
  AdminTab,
  AdminBooking,
  AdminCustomer,
  AdminMessage,
} from "~/components/admin/dashboard/types";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { data: session, isPending: isSessionPending } = authClient.useSession();
  const role = (session?.user as { role?: string } | undefined)?.role;
  const isStaff = isStaffRole(role);

  // Authentication & Staff Access Guard
  useEffect(() => {
    if (!isSessionPending && (!session?.user || !isStaff)) {
      router.push("/login?error=forbidden");
    }
  }, [isSessionPending, session, isStaff, router]);

  // UI State
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddRoomOpen, setIsAddRoomOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<AdminCustomer | null>(null);

  // Queries
  const {
    data: bookings = [],
    isLoading: bookingsLoading,
    isRefetching: bookingsRefetching,
    refetch: refetchBookings,
  } = api.booking.getAll.useQuery();

  const {
    data: rooms = [],
    isLoading: roomsLoading,
    isRefetching: roomsRefetching,
    refetch: refetchRooms,
  } = api.room.getAll.useQuery();

  const {
    data: occupancyOverview,
    isRefetching: occupancyRefetching,
    refetch: refetchOccupancy,
  } = api.booking.getRoomOccupancyOverview.useQuery();

  const {
    data: customers = [],
    isLoading: customersLoading,
    isRefetching: customersRefetching,
    refetch: refetchCustomers,
  } = api.customer.getAll.useQuery();

  const {
    data: messages = [],
    isLoading: messagesLoading,
    isRefetching: messagesRefetching,
    refetch: refetchMessages,
  } = api.contact.getAllMessages.useQuery();

  const isRefreshing =
    bookingsRefetching ||
    roomsRefetching ||
    occupancyRefetching ||
    customersRefetching ||
    messagesRefetching;

  // Mutations
  const updateBookingStatus = api.booking.updateStatus.useMutation({
    onSuccess: () => {
      refetchBookings();
      refetchOccupancy();
      refetchRooms();
    },
  });

  const deleteBooking = api.booking.delete.useMutation({
    onSuccess: () => {
      refetchBookings();
      refetchOccupancy();
      refetchRooms();
    },
  });

  const createRoom = api.room.create.useMutation({
    onSuccess: () => {
      setIsAddRoomOpen(false);
      refetchRooms();
      refetchOccupancy();
    },
  });

  const updateRoom = api.room.update.useMutation({
    onSuccess: () => {
      setEditingRoom(null);
      refetchRooms();
      refetchOccupancy();
    },
  });

  const toggleRoomAvailability = api.room.toggleAvailability.useMutation({
    onSuccess: () => {
      refetchRooms();
      refetchOccupancy();
    },
  });

  const deleteRoom = api.room.delete.useMutation({
    onSuccess: (data) => {
      alert(data.message);
      refetchRooms();
      refetchOccupancy();
    },
  });

  const updateCustomerRole = api.customer.updateRole.useMutation({
    onSuccess: () => refetchCustomers(),
  });

  const toggleCustomerBan = api.customer.toggleBan.useMutation({
    onSuccess: () => refetchCustomers(),
  });

  const deleteMessage = api.contact.deleteMessage.useMutation({
    onSuccess: () => refetchMessages(),
  });

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/login");
    router.refresh();
  };

  const handleRefreshAll = () => {
    refetchBookings();
    refetchRooms();
    refetchOccupancy();
    refetchCustomers();
    refetchMessages();
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price) + " ₫";
  };

  const pendingBookingsCount = bookings.filter((b) => b.status === "pending").length;

  // Loading state guard
  if (isSessionPending) {
    return (
      <div className="min-h-screen bg-stone-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-stone-900 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-medium text-stone-600 tracking-wider uppercase">
            Đang xác thực quyền truy cập...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen max-h-screen overflow-hidden bg-stone-100/70 text-stone-900 flex flex-col lg:flex-row antialiased selection:bg-stone-900 selection:text-white">
      {/* Desktop Persistent Sidebar (Fixed height, no outer scroll) */}
      <div className="hidden lg:flex w-64 shrink-0 flex-col h-full z-30 overflow-hidden">
        <DashboardSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          pendingBookingsCount={pendingBookingsCount}
          roomsCount={rooms.length}
          customersCount={customers.length}
          messagesCount={messages.length}
          userName={session?.user?.name}
          userEmail={session?.user?.email}
          userRole={role}
          userImage={session?.user?.image}
          isRefreshing={isRefreshing}
          onRefreshAll={handleRefreshAll}
          onSignOut={handleSignOut}
        />
      </div>

      {/* Main Column */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        {/* Top Header Bar (Fixed at top) */}
        <DashboardHeader
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          pendingBookingsCount={pendingBookingsCount}
          roomsCount={rooms.length}
          customersCount={customers.length}
          messagesCount={messages.length}
          userName={session?.user?.name}
          userEmail={session?.user?.email}
          userRole={role}
          userImage={session?.user?.image}
          isRefreshing={isRefreshing}
          onRefreshAll={handleRefreshAll}
          onSignOut={handleSignOut}
          onOpenAddRoom={() => setIsAddRoomOpen(true)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {/* Tab Content Canvas - ONLY this container scrolls */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl w-full mx-auto space-y-6">
            {activeTab === "overview" && (
              <OverviewTab
                bookings={bookings as unknown as AdminBooking[]}
                rooms={rooms}
                customers={customers as unknown as AdminCustomer[]}
                occupancyOverview={occupancyOverview}
                setActiveTab={setActiveTab}
                onOpenAddRoom={() => setIsAddRoomOpen(true)}
                onUpdateBookingStatus={(id, status) => {
                  updateBookingStatus.mutate({
                    id,
                    status: status as "confirmed" | "checked_in" | "completed" | "cancelled" | "pending",
                  });
                }}
                formatPrice={formatPrice}
              />
            )}

            {activeTab === "bookings" && (
              <BookingsTab
                bookings={bookings as unknown as AdminBooking[]}
                onUpdateStatus={(id, status) => {
                  updateBookingStatus.mutate({
                    id,
                    status: status as "confirmed" | "checked_in" | "completed" | "cancelled" | "pending",
                  });
                }}
                onDeleteBooking={(id) => deleteBooking.mutate({ id })}
                formatPrice={formatPrice}
              />
            )}

            {activeTab === "rooms" && (
              <RoomsTab
                rooms={rooms}
                onOpenAddRoom={() => setIsAddRoomOpen(true)}
                onEditRoom={(room) => setEditingRoom(room)}
                onToggleAvailability={(id) =>
                  toggleRoomAvailability.mutate({ id })
                }
                onDeleteRoom={(id) => deleteRoom.mutate({ id })}
                onUpdatePrice={(id, pricePerNight) => updateRoom.mutate({ id, pricePerNight })}
                formatPrice={formatPrice}
              />
            )}

            {activeTab === "customers" && (
              <CustomersTab
                customers={customers as unknown as AdminCustomer[]}
                currentUserId={session?.user?.id}
                onSelectCustomer={(c) => setSelectedCustomer(c)}
                onUpdateRole={(userId, newRole) => {
                  updateCustomerRole.mutate({
                    userId,
                    role: newRole as "admin" | "staff" | "user",
                  });
                }}
                onToggleBan={(userId, banned) => {
                  toggleCustomerBan.mutate({
                    userId,
                    banned: !banned,
                    banReason: !banned ? "Khóa bởi ban quản trị Extranet" : undefined,
                  });
                }}
                formatPrice={formatPrice}
              />
            )}

            {activeTab === "messages" && (
              <MessagesTab
                messages={messages as unknown as AdminMessage[]}
                onDeleteMessage={(id) => deleteMessage.mutate({ id })}
              />
            )}
          </div>
        </main>
      </div>

      {/* Modals & Dialogs */}
      <AddRoomDialog
        open={isAddRoomOpen}
        onOpenChange={setIsAddRoomOpen}
        onSubmit={(data) => createRoom.mutate(data)}
        isPending={createRoom.isPending}
      />

      <EditRoomDialog
        room={editingRoom}
        open={Boolean(editingRoom)}
        onOpenChange={(open) => {
          if (!open) setEditingRoom(null);
        }}
        onSubmit={(data) => updateRoom.mutate(data)}
        isPending={updateRoom.isPending}
      />

      <CustomerDetailDialog
        customer={selectedCustomer}
        bookings={bookings as unknown as AdminBooking[]}
        open={Boolean(selectedCustomer)}
        onOpenChange={(open) => {
          if (!open) setSelectedCustomer(null);
        }}
        formatPrice={formatPrice}
      />
    </div>
  );
}
