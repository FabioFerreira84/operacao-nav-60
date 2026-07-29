import assert from "node:assert/strict";
import test from "node:test";

test("question bank contains five valid 60-question exams", async () => {
  const { mockExams, bankStats } = await import("../app/question-bank.ts");
  const source = await import("node:fs/promises").then(({ readFile }) =>
    readFile(new URL("../app/question-bank.ts", import.meta.url), "utf8"),
  );
  assert.equal(bankStats.questions, 300);
  assert.equal(mockExams.length, 5);
  assert.deepEqual(bankStats.bySubject, {
    Inglês: 100,
    RLM: 75,
    Português: 50,
    Ética: 50,
    Informática: 25,
  });

  const all = mockExams.flatMap((exam) => {
    assert.equal(exam.questions.length, 60);
    assert.equal(exam.questions.filter((q) => q.subject === "Inglês").length, 20);
    assert.equal(exam.questions.filter((q) => q.subject === "RLM").length, 15);
    assert.equal(exam.questions.filter((q) => q.subject === "Português").length, 10);
    assert.equal(exam.questions.filter((q) => q.subject === "Ética").length, 10);
    assert.equal(exam.questions.filter((q) => q.subject === "Informática").length, 5);
    return exam.questions;
  });

  assert.equal(new Set(all.map((q) => q.id)).size, 300);
  for (const question of all) {
    assert.equal(question.options.length, 5, question.id);
    assert.equal(new Set(question.options).size, 5, question.id);
    assert.ok(question.correct >= 0 && question.correct <= 4, question.id);
    assert.ok(question.explanation.length >= 20, question.id);
    assert.ok(question.trap.label.length >= 10, question.id);
    assert.ok(question.trap.mechanism.length >= 40, question.id);
    assert.ok(question.trap.defense.length >= 30, question.id);
  }
  assert.ok(new Set(all.map((q) => q.trap.label)).size >= 8);
  assert.deepEqual(
    all.reduce((counts, question) => {
      counts[question.correct] += 1;
      return counts;
    }, [0, 0, 0, 0, 0]),
    [60, 60, 60, 60, 60],
  );
  assert.doesNotMatch(source, /\uFFFD/);
});
