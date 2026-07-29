import type { Metadata } from "next";
import { StudySprint } from "./study-sprint";

export const metadata: Metadata = {
  title: "Operação NAV 60 | Sprint final para a FGV",
  description:
    "Plano de reta final para a prova de Profissional Técnico de Navegação Aérea da NAV Brasil.",
};

export default function Home() {
  return <StudySprint />;
}
