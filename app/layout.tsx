import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Inter,
  Source_Sans_3,
  Lora,
  Playfair_Display,
  Montserrat,
  Roboto,
  Merriweather,
  Open_Sans,
  Poppins,
  Libre_Baskerville,
  Space_Grotesk,
} from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const sourceSans = Source_Sans_3({
  variable: "--font-source",
  subsets: ["latin"],
});
const lora = Lora({ variable: "--font-lora", subsets: ["latin"] });
const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});
const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});
const roboto = Roboto({
  variable: "--font-roboto",
  weight: ["400", "500", "700"],
  subsets: ["latin"],
});
const merriweather = Merriweather({
  variable: "--font-merriweather",
  weight: ["400", "700"],
  subsets: ["latin"],
});
const openSans = Open_Sans({
  variable: "--font-opensans",
  subsets: ["latin"],
});
const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});
const libreBaskerville = Libre_Baskerville({
  variable: "--font-librebaskerville",
  weight: ["400", "700"],
  subsets: ["latin"],
});
const spaceGrotesk = Space_Grotesk({
  variable: "--font-spacegrotesk",
  weight: ["400", "500", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3001"),
  title: {
    default: "Resume Builder — Build a Professional Resume in Minutes",
    template: "%s — Resume Builder",
  },
  description:
    "Design a professional resume in minutes. Nine hand-crafted templates, AI writing assistance, ATS checks, cover letters, and pixel-perfect PDF export — free, no signup required.",
  openGraph: {
    type: "website",
    title: "Resume Builder — Build a Professional Resume in Minutes",
    description:
      "Design a professional resume in minutes. Nine hand-crafted templates, AI writing assistance, ATS checks, and pixel-perfect PDF export.",
    siteName: "Resume Builder",
  },
  twitter: {
    card: "summary_large_image",
    title: "Resume Builder — Build a Professional Resume in Minutes",
    description:
      "Design a professional resume in minutes. Nine hand-crafted templates, AI writing assistance, ATS checks, and pixel-perfect PDF export.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${sourceSans.variable} ${lora.variable} ${playfair.variable} ${montserrat.variable} ${roboto.variable} ${merriweather.variable} ${openSans.variable} ${poppins.variable} ${libreBaskerville.variable} ${spaceGrotesk.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("resume-builder:theme");if(t){document.documentElement.setAttribute("data-theme",t);}else if(window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches){document.documentElement.setAttribute("data-theme","dark");}}catch(e){}})();`,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
