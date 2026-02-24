import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";
import WelcomeSplash from "@/components/WelcomeSplash";
import SiteFooter from "@/components/SiteFooter";
import ThemeCornerToggle from "@/components/ThemeCornerToggle";

export const metadata: Metadata = {
  title: "Creative Ally",
  description: "Internships and certification courses"
};

const themeInitScript = `
(() => {
  try {
    const key = "creative-ally-theme";
    const storedTheme = window.localStorage.getItem(key);
    const theme = storedTheme === "dark" || storedTheme === "light"
      ? storedTheme
      : (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.style.colorScheme = theme;
  } catch (error) {
    document.documentElement.setAttribute("data-theme", "dark");
    document.documentElement.style.colorScheme = "dark";
  }
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <Providers>
          <WelcomeSplash />
          <Navbar />
          <ThemeCornerToggle />
          <div className="page-shell">{children}</div>
          <SiteFooter />
        </Providers>
      </body>
    </html>
  );
}
