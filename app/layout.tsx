import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Operação NAV 60",
    template: "%s | Operação NAV 60",
  },
  description:
    "Sprint final de estudo para a prova de Profissional Técnico de Navegação Aérea da NAV Brasil.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
