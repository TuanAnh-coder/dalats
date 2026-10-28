import "~/styles/globals.css";

import { type Metadata, type Viewport } from "next";
import { Lora, Be_Vietnam_Pro, Dancing_Script } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";
import { CookieConsentBanner } from "~/components/CookieConsentBanner";
import { SmoothScrollProvider } from "~/components/SmoothScrollProvider";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#000000",
};

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://mdalatsvilla.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "M_Dalats Boutique Villa Đà Lạt | Stay Close To Nature",
    template: "%s | M_Dalats Villa Đà Lạt",
  },
  description:
    "Nằm liền kề trung tâm Thành phố Đà Lạt, M_Dalats Villa mang phong cách kiến trúc mộc mạc hòa quyện cùng thiên nhiên rừng thông cao nguyên với 11 phòng nghỉ tiện nghi cao cấp.",
  keywords: [
    "M_Dalats Villa",
    "Villa Đà Lạt",
    "Đặt phòng Đà Lạt",
    "Boutique Villa Đà Lạt",
    "Khách sạn Đà Lạt",
    "Nghỉ dưỡng Đà Lạt",
  ],
  authors: [{ name: "M_Dalats Boutique Villa" }],
  icons: [{ rel: "icon", url: "/images/m_dalats_logo_icon.svg" }],
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: siteUrl,
    siteName: "M_Dalats Boutique Villa Đà Lạt",
    title: "M_Dalats Boutique Villa Đà Lạt | Stay Close To Nature",
    description:
      "Trải nghiệm kỳ nghỉ thư thái giữa rừng thông Đà Lạt. 11 phòng boutique mộc mạc, tiện nghi hiện đại và dịch vụ tận tâm.",
    images: [
      {
        url: "/images/m_dalats_brand_board.jpg",
        width: 1200,
        height: 630,
        alt: "M_Dalats Boutique Villa Đà Lạt",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "M_Dalats Boutique Villa Đà Lạt",
    description: "Boutique Villa nghỉ dưỡng hòa quyện thiên nhiên giữa lòng Đà Lạt.",
    images: ["/images/m_dalats_brand_board.jpg"],
  },
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
      suppressHydrationWarning
      className={`${lora.variable} ${beVietnamPro.variable} ${dancingScript.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        suppressHydrationWarning
        className="min-h-screen bg-[#000000] text-white antialiased selection:bg-[#0070d1] selection:text-white font-sans w-full max-w-full overflow-x-clip min-w-0"
      >
        <TRPCReactProvider>
          <SmoothScrollProvider>
            {children}
          </SmoothScrollProvider>
          <CookieConsentBanner />
        </TRPCReactProvider>
      </body>
    </html>
  );
}
