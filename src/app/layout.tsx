import "~/styles/globals.css";

import { type Metadata, type Viewport } from "next";
import { Lora, Be_Vietnam_Pro, Dancing_Script } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";
import { DragonflyScrollCompanion } from "~/components/DragonflyScrollCompanion";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#367156",
};

export const metadata: Metadata = {
  title: "M_Dalats Villa Đà Lạt | Stay Close To Nature",
  description:
    "Nằm liền kề trung tâm Thành phố Đà Lạt, M_Dalats Villa mang phong cách kiến trúc mộc mạc hòa quyện cùng thiên nhiên rừng thông cao nguyên.",
  icons: [{ rel: "icon", url: "/images/m_dalats_logo_icon.svg" }],
};

const lora = Lora({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-serif",
  display: "swap",
});

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-be-vietnam-pro",
  display: "swap",
});

const dancingScript = Dancing_Script({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dancing-script",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    name: "M_Dalats Boutique Villa Đà Lạt",
    alternateName: "M_Dalats Villa",
    description:
      "Boutique Villa nghỉ dưỡng phong cách mộc mạc, hòa quyện giữa rừng thông và mây ngàn Đà Lạt với 11 phòng cao cấp.",
    url: "https://mdalatsvilla.com",
    telephone: "+84939014234",
    priceRange: "850.000₫ - 1.850.000₫",
    image: "https://mdalatsvilla.com/images/m_dalats_logo_icon.svg",
    address: {
      "@type": "PostalAddress",
      streetAddress: "14 Đường 3 Tháng 4, Phường 3",
      addressLocality: "Thành phố Đà Lạt",
      addressRegion: "Lâm Đồng",
      postalCode: "67000",
      addressCountry: "VN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 11.9312,
      longitude: 108.4452,
    },
    checkinTime: "14:00",
    checkoutTime: "12:00",
    numberOfRooms: 11,
    amenityFeature: [
      { "@type": "LocationFeatureSpecification", name: "Free Wi-Fi", value: true },
      { "@type": "LocationFeatureSpecification", name: "Boutique Cafe & BBQ", value: true },
      { "@type": "LocationFeatureSpecification", name: "Mountain & Pine Forest View", value: true },
      { "@type": "LocationFeatureSpecification", name: "24/7 Butler Service", value: true },
    ],
  };

  return (
    <html
      lang="vi"
      className={`${lora.variable} ${beVietnamPro.variable} ${dancingScript.variable} scroll-smooth`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-[#faf7f1] text-[#222222] antialiased selection:bg-[#367156] selection:text-white font-sans w-full max-w-full overflow-x-hidden min-w-0">
        <TRPCReactProvider>
          {children}
          <DragonflyScrollCompanion />
        </TRPCReactProvider>
      </body>
    </html>
  );
}
