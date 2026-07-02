// Central registry of all Project-Management quizzes.
// Add new quizzes by importing them and pushing into `quizzes`.
import { jacobsenQuiz } from "./jacobsenQuiz.js";
import { waterfallQuiz } from "./waterfallQuiz.js";
import { projectDocumentsQuiz } from "./projectDocuments.js"; // Project Documents Quiz
import { scrumQuiz } from "./scrumQuiz.js"; // Scrum Quiz
import { mixedQuiz } from "./mixedQuiz.js"; // Mixed Quiz
import { estimationQuiz } from "./estimationQuiz.js"; // Estimation Techniques — Hard (Calculations)
import { estimationTheoryQuiz } from "./estimationTheoryQuiz.js"; // Estimation Techniques — Theory
import { processGroupsQuiz } from "./processGroupsQuiz.js"; // PMI Process Groups (drag & drop)

export const quizzes = [
  jacobsenQuiz,
  waterfallQuiz,
  projectDocumentsQuiz,
  scrumQuiz,
  mixedQuiz,
  estimationTheoryQuiz,
  estimationQuiz,
  processGroupsQuiz,
];

/** Flatten a quiz's sections into a single ordered question list, each tagged
 *  with its section title so the runner can show a section heading. */
export function flattenQuestions(quiz) {
  const flat = [];
  quiz.sections.forEach((section) => {
    section.questions.forEach((question) => {
      flat.push({
        ...question,
        // globally-unique key (sectionId + questionId)
        key: `${section.id}.${question.id}`,
        sectionId: section.id,
        sectionTitle: section.title,
      });
    });
  });
  return flat;
}

/** Total number of questions in a quiz. */
export function countQuestions(quiz) {
  return quiz.sections.reduce((sum, s) => sum + s.questions.length, 0);
}

export function getQuizById(id) {
  return quizzes.find((q) => q.id === id);
}
