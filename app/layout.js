import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Mona Industry | Premium Copper Manufacturers",
  description: "Mona Industry based in Surat, Gujarat. Showcasing 32 premium copper products including scrap, cathodes, and sheets.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Using Outfit for display and Inter for body text */}
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Outfit:wght@400;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body>
        <Navbar />

        {/* The top banner is now handled inside Navbar itself */}
        <main>
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}
