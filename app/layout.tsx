import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const PoppinsRegular = localFont({
  src: "./fonts/Poppins-Regular.ttf",
  variable: "--font-poppins-medium",
  weight: "100 500",
});

const PoppinsSemiBold = localFont({
  src: "./fonts/Poppins-SemiBold.ttf",
  variable: "--font-poppins-semibold",
  weight: "600 900",
});


export const metadata: Metadata = {
  title: "AVALIADOR DE GATOS",
  description: "App Next.js para avalização de gatinhos",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${PoppinsRegular.variable} ${PoppinsSemiBold.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
