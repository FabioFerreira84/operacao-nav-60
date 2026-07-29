"use client";

import { useEffect, useMemo, useState } from "react";

type Mission = {
  id: string;
  day: string;
  date: string;
  label: string;
  focus: string;
  blocks: string[];
  target: string;
};

const missions: Mission[] = [
  {
    id: "ter",
    day: "TER",
    date: "28 JUL",
    label: "Recalibrar",
    focus: "Diagnóstico real, sem releitura passiva",
    blocks: [
      "Faça 30 questões: 10 Inglês, 8 RLM, 5 Português, 4 Ética e 3 Informática.",
      "Classifique cada erro: conteúdo, interpretação, cálculo ou distração.",
      "Inglês: skimming, scanning, conectores e 20 termos de comércio exterior.",
    ],
    target: "Saída: mapa dos 3 erros que mais custam pontos.",
  },
  {
    id: "qua",
    day: "QUA",
    date: "29 JUL",
    label: "Atacar",
    focus: "Inglês + RLM, os 35 pontos de maior alavanca",
    blocks: [
      "2 textos em inglês com tempo: ideia central, inferência e referência pronominal.",
      "RLM: proposições, equivalências, porcentagem, razão e leitura de tabelas.",
      "Feche com 15 questões mistas e revise somente os erros.",
    ],
    target: "Meta: 70% em Inglês e 60% em RLM.",
  },
  {
    id: "qui",
    day: "QUI",
    date: "30 JUL",
    label: "Converter",
    focus: "Português + pontos baratos de Informática",
    blocks: [
      "Português FGV: interpretação, reescrita, conectores, pontuação e regência.",
      "Informática: Microsoft 365, segurança digital, Windows e noções de IA.",
      "Ética: apenas uma revisão de 30 min das leis e pegadinhas já dominadas.",
    ],
    target: "Meta: não deixar disciplina com risco de zero.",
  },
  {
    id: "sex",
    day: "SEX",
    date: "31 JUL",
    label: "Simular",
    focus: "Prova completa de 60 questões em 3h30",
    blocks: [
      "Faça 60 questões em bloco único, com cartão-resposta e sem consulta.",
      "Use a ordem: forte → médio → difícil; marque dúvidas e siga.",
      "Corrija no mesmo dia e crie uma folha única de erros recorrentes.",
    ],
    target: "Meta mínima: 36/60; alvo competitivo de treino: 42+/60.",
  },
  {
    id: "sab",
    day: "SÁB",
    date: "01 AGO",
    label: "Estabilizar",
    focus: "Consolidar sem se esgotar",
    blocks: [
      "Revise a folha de erros e 30 cartões de alta recorrência.",
      "Faça só 20 questões leves; pare conteúdo novo às 16h.",
      "Separe documento, canetas transparentes, comprovante, rota e alarme.",
    ],
    target: "Meta: dormir cedo e chegar com atenção preservada.",
  },
];

const scoreMap = [
  { subject: "Inglês", questions: 20, color: "var(--signal)" },
  { subject: "RLM", questions: 15, color: "var(--amber)" },
  { subject: "Português", questions: 10, color: "var(--sky)" },
  { subject: "Ética", questions: 10, color: "var(--violet)" },
  { subject: "Informática", questions: 5, color: "var(--rose)" },
];

const englishTerms = [
  ["shipment", "remessa / carregamento"],
  ["freight", "frete / carga transportada"],
  ["invoice", "fatura comercial"],
  ["customs", "alfândega"],
  ["warehouse", "armazém"],
  ["supplier", "fornecedor"],
  ["purchase order", "pedido de compra"],
  ["bill of lading", "conhecimento de embarque"],
  ["lead time", "prazo entre pedido e entrega"],
  ["clearance", "liberação aduaneira — não autorização ATC"],
  ["whereas", "enquanto / considerando que"],
  ["therefore", "portanto"],
];

function useCountdown() {
  const target = useMemo(
    () => new Date("2026-08-02T08:00:00-03:00").getTime(),
    [],
  );
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const distance = Math.max(0, target - now);
  return {
    days: Math.floor(distance / 86_400_000),
    hours: Math.floor((distance / 3_600_000) % 24),
    minutes: Math.floor((distance / 60_000) % 60),
    seconds: Math.floor((distance / 1000) % 60),
  };
}

export function StudySprint() {
  const countdown = useCountdown();
  const [activeDay, setActiveDay] = useState("ter");
  const [completed, setCompleted] = useState<string[]>([]);
  const [termIndex, setTermIndex] = useState(0);
  const [showMeaning, setShowMeaning] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem("nav60-progress");
    if (saved) {
      try {
        setCompleted(JSON.parse(saved));
      } catch {
        window.localStorage.removeItem("nav60-progress");
      }
    }
  }, []);

  const toggleMission = (id: string) => {
    setCompleted((current) => {
      const next = current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id];
      window.localStorage.setItem("nav60-progress", JSON.stringify(next));
      return next;
    });
  };

  const activeMission =
    missions.find((mission) => mission.id === activeDay) ?? missions[0];

  const nextTerm = () => {
    setTermIndex((current) => (current + 1) % englishTerms.length);
    setShowMeaning(false);
  };

  return (
    <main>
      <header className="topbar">
        <a className="brand" href="#inicio" aria-label="Operação NAV 60">
          <span className="brand-mark" aria-hidden="true">
            N60
          </span>
          <span>
            <strong>OPERAÇÃO NAV 60</strong>
            <small>briefing de reta final</small>
          </span>
        </a>
        <nav aria-label="Navegação principal">
          <a href="#rota">Rota</a>
          <a href="#placar">Placar</a>
          <a href="#ingles">Drill</a>
        </nav>
        <a
          className="official-link"
          href="https://conhecimento.fgv.br/concursos/navbrasil26"
          target="_blank"
          rel="noreferrer"
        >
          Área oficial <span aria-hidden="true">↗</span>
        </a>
      </header>

      <section className="hero" id="inicio">
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-copy">
          <p className="eyebrow">
            PTNA · OPERADOR DE TORRE · FGV · 02 AGO 2026
          </p>
          <h1>
            Não dá para ver tudo.
            <span>Dá para acertar o que mais vale.</span>
          </h1>
          <p className="hero-lede">
            Uma rota de cinco dias baseada no edital, no seu 10/10 em Ética e no
            ponto cego que mais ameaça sua nota: estudar o inglês errado.
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href="#rota">
              Abrir missão de hoje
            </a>
            <a className="button button-ghost" href="#correcao">
              Ver a correção crítica
            </a>
          </div>
        </div>

        <aside className="countdown-card" aria-label="Contagem regressiva">
          <div className="radar">
            <span className="radar-sweep" />
            <span className="radar-dot dot-one" />
            <span className="radar-dot dot-two" />
            <span className="radar-center">PROVA</span>
          </div>
          <p>JANELA ATÉ A PROVA</p>
          <div className="countdown">
            {[
              [countdown.days, "dias"],
              [countdown.hours, "h"],
              [countdown.minutes, "min"],
              [countdown.seconds, "s"],
            ].map(([value, label]) => (
              <span key={label}>
                <strong>{String(value).padStart(2, "0")}</strong>
                <small>{label}</small>
              </span>
            ))}
          </div>
          <div className="exam-strip">
            <span>DOMINGO</span>
            <strong>08:00—11:30</strong>
            <small>portões fecham às 07:30</small>
          </div>
        </aside>
      </section>

      <section className="correction" id="correcao">
        <div className="correction-tag">CORREÇÃO DE ROTA 01</div>
        <div>
          <p className="section-kicker">O ponto cego do plano anterior</p>
          <h2>Inglês aeronáutico parece lógico. O edital diz outra coisa.</h2>
          <p>
            As 20 questões de Língua Inglesa cobram textos técnicos e
            institucionais ligados a <strong>comércio exterior</strong>,
            correspondência comercial, exportação, importação e logística
            internacional. NOTAM, METAR e fraseologia ATC podem ser úteis na
            carreira, mas são uma aposta fraca para esta prova.
          </p>
        </div>
        <div className="do-dont">
          <div>
            <span className="status status-stop">PAUSAR</span>
            <p>Listas de runway, taxiway, heading, TAF e fraseologia.</p>
          </div>
          <div>
            <span className="status status-go">PRIORIZAR</span>
            <p>Skimming, scanning, inferência, conectores e logística.</p>
          </div>
        </div>
      </section>

      <section className="section" id="placar">
        <div className="section-heading">
          <div>
            <p className="section-kicker">Arquitetura da prova</p>
            <h2>Siga os pontos, não a ansiedade.</h2>
          </div>
          <p className="section-note">
            60 questões · 1 ponto cada · mínimo de 30 acertos · não pode zerar
            nenhuma disciplina
          </p>
        </div>

        <div className="score-layout">
          <div className="score-bars">
            {scoreMap.map((item) => (
              <div className="score-row" key={item.subject}>
                <div>
                  <strong>{item.subject}</strong>
                  <span>{Math.round((item.questions / 60) * 100)}% da prova</span>
                </div>
                <div className="bar-track">
                  <span
                    style={{
                      width: `${(item.questions / 20) * 100}%`,
                      background: item.color,
                    }}
                  />
                </div>
                <b>{item.questions}</b>
              </div>
            ))}
          </div>

          <aside className="profile-card">
            <p className="card-label">LEITURA DO SEU PERFIL</p>
            <div className="profile-score">
              <strong>10/10</strong>
              <span>último simulado de Ética</span>
            </div>
            <p>
              Isso é evidência de domínio naquele conjunto de questões, não
              garantia de prova perfeita. A decisão racional agora é
              <strong> manutenção curta em Ética</strong> e diagnóstico nas
              outras quatro disciplinas.
            </p>
            <div className="allocation">
              <span>
                <i style={{ width: "38%" }} /> Inglês · 38%
              </span>
              <span>
                <i style={{ width: "30%" }} /> RLM · 30%
              </span>
              <span>
                <i style={{ width: "17%" }} /> Português · 17%
              </span>
              <span>
                <i style={{ width: "8%" }} /> Informática · 8%
              </span>
              <span>
                <i style={{ width: "7%" }} /> Ética · 7%
              </span>
            </div>
          </aside>
        </div>
      </section>

      <section className="section route-section" id="rota">
        <div className="section-heading">
          <div>
            <p className="section-kicker">Plano adaptativo</p>
            <h2>Cinco dias. Uma entrega por dia.</h2>
          </div>
          <div className="progress-readout">
            <strong>{completed.length}/5</strong>
            <span>missões concluídas neste aparelho</span>
          </div>
        </div>

        <div className="mission-tabs" role="tablist" aria-label="Dias do plano">
          {missions.map((mission) => (
            <button
              key={mission.id}
              role="tab"
              aria-selected={activeDay === mission.id}
              className={activeDay === mission.id ? "active" : ""}
              onClick={() => setActiveDay(mission.id)}
            >
              <span>{mission.day}</span>
              <small>{mission.date}</small>
              {completed.includes(mission.id) && (
                <i aria-label="Concluída">✓</i>
              )}
            </button>
          ))}
        </div>

        <article className="mission-panel" role="tabpanel">
          <div className="mission-number">
            0{missions.findIndex((item) => item.id === activeDay) + 1}
          </div>
          <div className="mission-main">
            <p className="mission-label">{activeMission.label}</p>
            <h3>{activeMission.focus}</h3>
            <ol>
              {activeMission.blocks.map((block) => (
                <li key={block}>{block}</li>
              ))}
            </ol>
          </div>
          <div className="mission-target">
            <span>CRITÉRIO DE SAÍDA</span>
            <p>{activeMission.target}</p>
            <button
              className={`complete-button ${
                completed.includes(activeMission.id) ? "completed" : ""
              }`}
              onClick={() => toggleMission(activeMission.id)}
            >
              {completed.includes(activeMission.id)
                ? "✓ Missão concluída"
                : "Marcar como concluída"}
            </button>
          </div>
        </article>
      </section>

      <section className="section drill-section" id="ingles">
        <div className="drill-copy">
          <p className="section-kicker">Microdrill de inglês</p>
          <h2>Troque vocabulário de aviação por vocabulário de prova.</h2>
          <p>
            Revele o significado, diga uma frase mental com a palavra e avance.
            O objetivo não é decorar uma lista enorme; é reconhecer termos sem
            interromper a leitura.
          </p>
          <div className="drill-stats">
            <span>
              <strong>20</strong> questões
            </span>
            <span>
              <strong>33%</strong> da nota
            </span>
            <span>
              <strong>1º</strong> desempate
            </span>
          </div>
        </div>

        <div className="flashcard" aria-live="polite">
          <div className="flashcard-top">
            <span>TERM {String(termIndex + 1).padStart(2, "0")}</span>
            <span>{termIndex + 1}/{englishTerms.length}</span>
          </div>
          <strong>{englishTerms[termIndex][0]}</strong>
          <p className={showMeaning ? "revealed" : ""}>
            {showMeaning
              ? englishTerms[termIndex][1]
              : "Toque para revelar o significado"}
          </p>
          <div className="flashcard-actions">
            <button onClick={() => setShowMeaning((current) => !current)}>
              {showMeaning ? "Ocultar" : "Revelar"}
            </button>
            <button onClick={nextTerm}>
              Próximo <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      </section>

      <section className="section playbook-section">
        <div className="section-heading">
          <div>
            <p className="section-kicker">Playbook de domingo</p>
            <h2>A prova começa antes das 08:00.</h2>
          </div>
        </div>
        <div className="playbook-grid">
          {[
            ["06:00", "Acordar", "Café conhecido. Nada de conteúdo novo."],
            ["06:30", "Checar", "Documento original, canetas e comprovante."],
            ["07:00", "Chegar", "O edital pede 1h30 de antecedência."],
            ["07:30", "Portões", "Fechamento. Depois disso, não entra."],
            ["08:00", "Executar", "60 questões em 210 min: média de 3m30."],
            ["11:30", "Entregar", "Cartão-resposta obrigatório ao fiscal."],
          ].map(([time, title, text]) => (
            <article key={time}>
              <span>{time}</span>
              <strong>{title}</strong>
              <p>{text}</p>
            </article>
          ))}
        </div>
        <div className="closing-rule">
          <span>REGRA FINAL</span>
          <p>
            Não transforme uma questão difícil em cinco questões perdidas.
            Marque, avance e volte. Sua nota vem da soma, não do orgulho.
          </p>
        </div>
      </section>

      <footer>
        <div>
          <strong>OPERAÇÃO NAV 60</strong>
          <p>
            Material de apoio independente, elaborado a partir do Edital nº
            01/2026. Não substitui comunicados oficiais da FGV.
          </p>
        </div>
        <div className="footer-links">
          <a
            href="https://conhecimento.fgv.br/sites/default/files/concursos/edital-01-2026-nav-brasil_1.pdf"
            target="_blank"
            rel="noreferrer"
          >
            Edital completo ↗
          </a>
          <a
            href="https://conhecimento.fgv.br/concursos/navbrasil26"
            target="_blank"
            rel="noreferrer"
          >
            Página do concurso ↗
          </a>
        </div>
      </footer>
    </main>
  );
}
