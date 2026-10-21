import { createClient } from "@libsql/client";

const client = createClient({ url: "file:./db.sqlite" });

async function main() {
  console.log("1. Creating test booking for Room 1 (2026-11-01 to 2026-11-03)...");
  const createRes = await fetch("http://localhost:3000/api/trpc/booking.create?batch=1", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      0: {
        json: {
          roomId: 1,
          customerName: "Khách Thử Nghiệm",
          customerEmail: "test-search@mdalats.vn",
          customerPhone: "0909123456",
          checkIn: "2026-11-01",
          checkOut: "2026-11-03",
          adults: 2,
          children: 0,
          totalNights: 2,
          totalPrice: 1700000,
        },
      },
    }),
  });
  const createData = await createRes.json();
  const bookingCode = createData[0]?.result?.data?.json?.bookingCode;
  console.log("=> Created booking code:", bookingCode);

  console.log("\n2. Searching rooms for overlapping dates (2026-11-02 to 2026-11-04)...");
  const searchInput = encodeURIComponent(
    JSON.stringify({
      0: {
        json: {
          adults: 2,
          children: 0,
          checkIn: "2026-11-02",
          checkOut: "2026-11-04",
        },
      },
    })
  );
  const searchRes = await fetch(`http://localhost:3000/api/trpc/room.search?batch=1&input=${searchInput}`);
  const searchData = await searchRes.json();
  const room1 = searchData[0].result.data.json.find((r) => r.id === 1);
  console.log("=> Room 1 isBooked:", room1.isBooked);
  console.log("=> Room 1 isAvailableForDates:", room1.isAvailableForDates);

  console.log("\n3. Attempting duplicate booking on same dates (conflict test)...");
  const dupRes = await fetch("http://localhost:3000/api/trpc/booking.create?batch=1", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      0: {
        json: {
          roomId: 1,
          customerName: "Khách Đặt Trùng",
          customerEmail: "conflict@mdalats.vn",
          customerPhone: "0909999999",
          checkIn: "2026-11-02",
          checkOut: "2026-11-04",
          adults: 2,
          children: 0,
          totalNights: 2,
          totalPrice: 1700000,
        },
      },
    }),
  });
  const dupData = await dupRes.json();
  console.log("=> Conflict blocked error:", dupData[0]?.error?.json?.message);

  console.log("\n4. Cleaning up test booking...");
  await client.execute("DELETE FROM bookings WHERE customerEmail = 'test-search@mdalats.vn'");
  console.log("=> Cleanup complete!");
}

main().catch(console.error);
