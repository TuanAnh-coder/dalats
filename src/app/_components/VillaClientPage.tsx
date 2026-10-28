"use client";

import React, { useState } from "react";
import { api } from "~/trpc/react";
import { Navbar } from "~/components/Navbar";
import { HeroSection } from "~/components/HeroSection";
import { StorySection } from "~/components/StorySection";
import { RoomsSection } from "~/components/RoomsSection";
import { RoomDetailModal } from "~/components/RoomDetailModal";
import { BookingModal } from "~/components/BookingModal";
import { DiningSection } from "~/components/DiningSection";
import { ExperienceSection } from "~/components/ExperienceSection";
import { AmenitiesSection } from "~/components/AmenitiesSection";
import { TestimonialSection } from "~/components/TestimonialSection";
import { BookingPerksSection } from "~/components/BookingPerksSection";
import { LocationSection } from "~/components/LocationSection";
import { NewsletterSection } from "~/components/NewsletterSection";
import { Footer } from "~/components/Footer";
import { AuthModal } from "~/components/AuthModal";
import { MyBookingsModal } from "~/components/MyBookingsModal";
import { MobileQuickBar } from "~/components/MobileQuickBar";
import { TasteDiamondSlider } from "~/components/TasteDiamondSlider";
import type { Room } from "~/server/db/schema";

export function VillaClientPage() {
  const { data: rooms = [], isLoading } = api.room.getAll.useQuery();

  const [selectedRoomForDetail, setSelectedRoomForDetail] = useState<Room | null>(null);
  const [selectedRoomForBooking, setSelectedRoomForBooking] = useState<Room | null>(null);

  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [myBookingsModalOpen, setMyBookingsModalOpen] = useState(false);

  const [searchParams, setSearchParams] = useState<{
    checkIn: string;
    checkOut: string;
    adults: number;
    children: number;
  } | null>(null);

  const handleOpenBooking = (roomId?: number) => {
    if (roomId) {
      const room = rooms.find((r) => r.id === roomId) || null;
      setSelectedRoomForBooking(room);
    } else if (!selectedRoomForBooking && rooms.length > 0) {
      setSelectedRoomForBooking(rooms[0] ?? null);
    }
    setBookingModalOpen(true);
  };

  const handleBookFromCard = (
    room: Room,
    searchContext?: { checkIn: string; checkOut: string; adults: number; children: number }
  ) => {
    setSelectedRoomForBooking(room);
    if (searchContext) {
      setSearchParams(searchContext);
    }
    setBookingModalOpen(true);
  };

  const handleSelectRoomDetail = (room: Room) => {
    setSelectedRoomForDetail(room);
  };

  const handleSearch = (params: {
    checkIn: string;
    checkOut: string;
    adults: number;
    children: number;
  }) => {
    setSearchParams(params);
  };

  return (
    <div className="flex flex-col min-h-screen w-full max-w-full overflow-x-hidden min-w-0">
      {/* Navigation Header */}
      <Navbar
        onOpenBookingModal={() => handleOpenBooking()}
        onOpenAuthModal={() => setAuthModalOpen(true)}
        onOpenMyBookingsModal={() => setMyBookingsModalOpen(true)}
      />

      {/* Hero Section with Quick Booking Bar */}
      <HeroSection onSearch={handleSearch} />

      {/* Story Section - Architectural Narrative & Core Values */}
      <StorySection />

      {/* Signature Tactile Diamond Vista Slider (Hôtel Fantaisie Heritage) */}
      <TasteDiamondSlider />

      {/* 11 Rooms Section with Filters & Real-time Search */}
      <RoomsSection
        rooms={rooms}
        isLoading={isLoading}
        onSelectRoom={handleSelectRoomDetail}
        onBookRoom={handleBookFromCard}
        searchParams={searchParams}
        onUpdateSearch={handleSearch}
        onClearSearch={() => setSearchParams(null)}
      />

      {/* Unified Dining & Cafe Section (Coffee, Breakfast, BBQ) */}
      <DiningSection />

      {/* Experience (Campfire, Lounge, Garden, Transfers) */}
      <ExperienceSection />

      {/* Amenities & Services */}
      <AmenitiesSection />

      {/* Testimonials & Awards */}
      <TestimonialSection />

      {/* Direct Booking Perks */}
      <BookingPerksSection onOpenBookingModal={() => handleOpenBooking()} />

      {/* Location, Google Map & Contact */}
      <LocationSection />

      {/* Newsletter */}
      <NewsletterSection />

      {/* Footer */}
      <Footer />

      {/* Modals */}
      <RoomDetailModal
        room={selectedRoomForDetail}
        onClose={() => setSelectedRoomForDetail(null)}
        onBookRoom={handleBookFromCard}
      />

      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        selectedRoom={selectedRoomForBooking}
        rooms={rooms}
        initialCheckIn={searchParams?.checkIn}
        initialCheckOut={searchParams?.checkOut}
        initialAdults={searchParams?.adults}
        initialChildren={searchParams?.children}
      />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />

      <MyBookingsModal
        isOpen={myBookingsModalOpen}
        onClose={() => setMyBookingsModalOpen(false)}
      />

      {/* Floating Sticky Mobile Quick Booking Bar */}
      <MobileQuickBar onOpenBookingModal={() => handleOpenBooking()} />
    </div>
  );
}
