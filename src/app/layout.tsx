import ArrowUp from "@/components/ArrowUp";
import Footer from "@/components/Footer";
import Copyright from "@/components/Copyright";
import Topbar from "@/components/Topbar";
import Navbar from "@/components/Navbar";
import type { Metadata } from "next";
import "../scss/globals.scss";
import Script from "next/script";
import "owl.carousel/dist/assets/owl.carousel.min.css";
import "owl.carousel/dist/assets/owl.theme.default.min.css";

export const metadata: Metadata = {
  title: "Interser - Centro Psicoterapeutico Humanista",
  description: "Centro Psicoterapeutico Humanista.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // <!DOCTYPE html>
    <html lang="es">
      <head>
        <meta charSet="utf-8" />
        <title>Terapia - Physical Therapy Website Template</title>
        <meta content="width=device-width, initial-scale=1.0" name="viewport" />
        <meta content="" name="keywords" />
        <meta content="" name="description" />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;600&family=Playfair+Display:wght@400;500;600&display=swap"
          rel="stylesheet"
        />

        <link
          rel="stylesheet"
          href="https://use.fontawesome.com/releases/v5.15.4/css/all.css"
        />
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.4.1/font/bootstrap-icons.css"
          rel="stylesheet"
        />

        <link href="lib/animate/animate.min.css" rel="stylesheet" />
        <link
          href="lib/owlcarousel/assets/owl.carousel.min.css"
          rel="stylesheet"
        />

        <link href="css/bootstrap.min.css" rel="stylesheet" />

        <link href="css/style.css" rel="stylesheet" />
      </head>

      <body>
        <Topbar />
        <Navbar />
        {children}
        <Footer />
        <Copyright />
        <ArrowUp />

        <Script
          src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.4/jquery.min.js"
          strategy="beforeInteractive" // Carga el script antes de que el código de React se ejecute
          id="jquery-script"
        />
        <Script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0/dist/js/bootstrap.bundle.min.js"
          strategy="beforeInteractive" // Carga el script antes de que el código de React se ejecute
          id="jquery-script"
        />
        <Script
          src="lib/wow/wow.min.js"
          strategy="beforeInteractive" // Carga el script antes de que el código de React se ejecute
          id="jquery-script"
        />
        <Script
          src="lib/easing/easing.min.js"
          strategy="beforeInteractive" // Carga el script antes de que el código de React se ejecute
          id="jquery-script"
        />
        <Script
          src="lib/waypoints/waypoints.min.js"
          strategy="beforeInteractive" // Carga el script antes de que el código de React se ejecute
          id="jquery-script"
        />
        <Script
          src="lib/owlcarousel/owl.carousel.min.js"
          strategy="beforeInteractive" // Carga el script antes de que el código de React se ejecute
          id="jquery-script"
        />

        {/* <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.4/jquery.min.js"></script> */}
        {/* <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0/dist/js/bootstrap.bundle.min.js"></script>
        <script src="lib/wow/wow.min.js"></script>
        <script src="lib/easing/easing.min.js"></script>
        <script src="lib/waypoints/waypoints.min.js"></script>
        <script src="lib/owlcarousel/owl.carousel.min.js"></script> */}

        <Script
          src="js/main.js"
          strategy="beforeInteractive" // Carga el script antes de que el código de React se ejecute
          id="jquery-script"
        />
        {/* <script src="js/main.js"></script> */}
      </body>
    </html>
  );
}
