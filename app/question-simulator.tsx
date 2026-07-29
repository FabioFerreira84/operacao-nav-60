"use client";

import { useEffect, useMemo, useState } from "react";
import { bankStats, mockExams, type Subject } from "./question-bank";

type SavedResult = {
  score: number;
  total: number;
  bySubject: Record<string, { correct: number; total: number }>;
  completedAt: string;
};

const subjectOrder: Subject[] = ["Inglês", "RLM", "Português", "Ética", "Informática"];

export function QuestionSimulator() {
  const [examIndex, setExamIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [finished, setFinished] = useState(false);
  const [reviewOnlyErrors, setReviewOnlyErrors] = useState(false);
  const [results, setResults] = useState<Record<string, SavedResult>>({});
  const exam = mockExams[examIndex];

  useEffect(() => {
    const saved = window.localStorage.getItem("nav60-sim-results");
    if (saved) {
      try {
        setResults(JSON.parse(saved));
      } catch {
        window.localStorage.removeItem("nav60-sim-results");
      }
    }
  }, []);

  const reviewQuestions = useMemo(
    () =>
      reviewOnlyErrors
        ? exam.questions.filter((question) => answers[question.id] !== question.correct)
        : exam.questions,
    [answers, exam.questions, reviewOnlyErrors],
  );
  const current = reviewQuestions[Math.min(questionIndex, Math.max(0, reviewQuestions.length - 1))];

  const finishExam = () => {
    const bySubject: SavedResult["bySubject"] = {};
    let score = 0;
    for (const question of exam.questions) {
      const correct = answers[question.id] === question.correct;
      score += correct ? 1 : 0;
      bySubject[question.subject] ??= { correct: 0, total: 0 };
      bySubject[question.subject].total += 1;
      bySubject[question.subject].correct += correct ? 1 : 0;
    }
    const next = {
      ...results,
      [exam.id]: {
        score,
        total: exam.questions.length,
        bySubject,
        completedAt: new Date().toISOString(),
      },
    };
    setResults(next);
    window.localStorage.setItem("nav60-sim-results", JSON.stringify(next));
    setFinished(true);
    setQuestionIndex(0);
  };

  const selectExam = (index: number) => {
    setExamIndex(index);
    setQuestionIndex(0);
    setAnswers({});
    setFinished(false);
    setReviewOnlyErrors(false);
  };

  const result = results[exam.id];
  const answeredCount = exam.questions.filter((question) => answers[question.id] !== undefined).length;

  return (
    <section className="section simulator-section" id="simulados">
      <div className="section-heading simulator-heading">
        <div>
          <p className="section-kicker">Banco autoral · matriz 5×</p>
          <h2>300 questões. Cinco degraus de pressão.</h2>
        </div>
        <div className="bank-stats">
          <span><strong>{bankStats.questions}</strong> questões</span>
          <span><strong>5</strong> simulados</span>
          <span><strong>60</strong> itens cada</span>
        </div>
      </div>

      <div className="quality-notice">
        <strong>Contrato honesto:</strong> questões autorais alinhadas ao conteúdo do edital, não questões oficiais da FGV.
        A dificuldade é uma progressão heurística; use os erros para orientar revisão, não como previsão de classificação.
      </div>

      <div className="exam-selector" role="tablist" aria-label="Escolha do simulado">
        {mockExams.map((item, index) => (
          <button
            key={item.id}
            role="tab"
            aria-selected={examIndex === index}
            className={examIndex === index ? "active" : ""}
            onClick={() => selectExam(index)}
          >
            <span>0{item.level}</span>
            <strong>{item.title}</strong>
            <small>{item.label}</small>
            {results[item.id] && <b>{results[item.id].score}/60</b>}
          </button>
        ))}
      </div>

      {!finished && current ? (
        <div className="quiz-shell">
          <aside className="quiz-rail">
            <p>{exam.title} · {exam.label}</p>
            <strong>{answeredCount}<span>/60 respondidas</span></strong>
            <div className="quiz-progress"><i style={{ width: `${(answeredCount / 60) * 100}%` }} /></div>
            <div className="subject-legend">
              {subjectOrder.map((subject) => {
                const count = exam.questions.filter((q) => q.subject === subject && answers[q.id] !== undefined).length;
                const total = exam.questions.filter((q) => q.subject === subject).length;
                return <span key={subject}><b>{subject}</b><small>{count}/{total}</small></span>;
              })}
            </div>
            <button className="finish-button" disabled={answeredCount < 60} onClick={finishExam}>
              {answeredCount < 60 ? `Faltam ${60 - answeredCount}` : "Finalizar e corrigir"}
            </button>
          </aside>

          <article className="question-card">
            <div className="question-meta">
              <span>{current.subject}</span>
              <span>{current.skill}</span>
              <span>NÍVEL {current.difficulty}</span>
            </div>
            <p className="question-number">QUESTÃO {String(exam.questions.indexOf(current) + 1).padStart(2, "0")} / 60</p>
            {current.context && <blockquote>{current.context}</blockquote>}
            <h3>{current.stem}</h3>
            <div className="options">
              {current.options.map((option, optionIndex) => {
                const selected = answers[current.id] === optionIndex;
                return (
                  <button
                    key={option}
                    className={selected ? "selected" : ""}
                    onClick={() => setAnswers((state) => ({ ...state, [current.id]: optionIndex }))}
                  >
                    <span>{String.fromCharCode(65 + optionIndex)}</span>
                    {option}
                  </button>
                );
              })}
            </div>
            <div className="question-nav">
              <button disabled={questionIndex === 0} onClick={() => setQuestionIndex((n) => Math.max(0, n - 1))}>← Anterior</button>
              <button
                disabled={questionIndex >= reviewQuestions.length - 1}
                onClick={() => setQuestionIndex((n) => Math.min(reviewQuestions.length - 1, n + 1))}
              >
                Próxima →
              </button>
            </div>
          </article>
        </div>
      ) : (
        <div className="results-panel">
          <div className="result-score">
            <span>RESULTADO</span>
            <strong>{result?.score ?? 0}<small>/60</small></strong>
            <p>{(result?.score ?? 0) >= 30 ? "Acima do corte mínimo do edital." : "Abaixo do corte mínimo: revise antes de avançar."}</p>
          </div>
          <div className="result-breakdown">
            {subjectOrder.map((subject) => {
              const row = result?.bySubject[subject] ?? { correct: 0, total: 0 };
              return (
                <div key={subject}>
                  <span>{subject}</span>
                  <i><b style={{ width: `${row.total ? (row.correct / row.total) * 100 : 0}%` }} /></i>
                  <strong>{row.correct}/{row.total}</strong>
                </div>
              );
            })}
          </div>
          <div className="result-actions">
            <button onClick={() => { setReviewOnlyErrors(true); setFinished(false); setQuestionIndex(0); }}>
              Revisar somente erros
            </button>
            <button onClick={() => selectExam(Math.min(4, examIndex + 1))}>
              Ir para o próximo nível
            </button>
          </div>
          <div className="answer-review">
            {exam.questions.filter((q) => answers[q.id] !== q.correct).slice(0, 10).map((question) => (
              <article key={question.id}>
                <span>{question.subject} · {question.skill}</span>
                <p>{question.stem}</p>
                <strong>Resposta: {question.options[question.correct]}</strong>
                <small>{question.explanation}</small>
              </article>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
