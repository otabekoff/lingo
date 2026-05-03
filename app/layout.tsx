import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Nunito } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { ModalProvider } from "@/components/modals/modal-provider";

const nunito = Nunito({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Lingo",
  description:
    "Free, fun, and effective courses in languages and more. Learn with quick, science-based lessons personalized to you.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", "font-sans", nunito.variable)}
    >
      <body className="flex min-h-full flex-col">
        <Toaster />
        <ModalProvider />
        <ClerkProvider>
          <TooltipProvider>{children}</TooltipProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
