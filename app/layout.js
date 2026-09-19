import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFab from "@/components/WhatsAppFab";
import { company } from "@/constants/company";

export const metadata = {
  title: {
    default: "Mona Industry | Wires, Cables, Power Cords & Wire Harnesses",
    template: "%s | Mona Industry",
  },
  description: company.description,
  keywords: [
    "automotive cables",
    "elevator travelling cables",
    "solar cables",
    "instrumentation cables",
    "power cords",
    "wire harness manufacturer",
    "cable manufacturer Surat",
  ],
  openGraph: {
    title: "Mona Industry | Wires, Cables, Power Cords & Wire Harnesses",
    description: company.description,
    siteName: company.name,
    locale: "en_IN",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export const viewport = {
  themeColor: "#0b1524",
};

// Organisation structured data helps search engines show verifiable company
// details alongside the listing, which is part of looking like a real supplier.
const organisationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: company.legalName,
  description: company.description,
  foundingDate: String(company.established),
  address: {
    "@type": "PostalAddress",
    streetAddress: company.address.line1,
    addressLocality: company.address.city,
    addressRegion: company.address.state,
    postalCode: company.address.postalCode,
    addressCountry: "IN",
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: company.phone,
    email: company.email,
    contactType: "sales",
    areaServed: "Worldwide",
    availableLanguage: ["English", "Hindi", "Gujarati"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Outfit for display type, Inter for body copy */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@400;600;700;800&display=swap"
          rel="stylesheet"
        />
        <meta name="format-detection" content="telephone=no" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organisationSchema) }}
        />
      </head>
      <body>
        <a href="#main-content" className="sr-only">Skip to content</a>
        <Navbar />
        <main id="main-content">{children}</main>
        <Footer />
        <WhatsAppFab />
      </body>
    </html>
  );
}
