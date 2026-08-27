'use client';

import { useEffect, useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

export type OfficialQuizData = {
  sourcePath: string;
  questions: Array<{
    id: string;
    title: string;
    prompt: string;
    choices: Array<{ text: string; explanation: string; correct: boolean }>;
  }>;
};

type SavedQuiz = {
  answers: Array<number | null>;
  submitted: boolean;
  attempts: number;
  bestScore: number;
  wrongQuestionIds: string[];
};

const storageKey = 'official-agent-course-quiz-progress-v1';

export default function OfficialQuiz({ pageId, data, onReview, reviewLabel }: { pageId: string; data: OfficialQuizData; onReview: () => void; reviewLabel: string }) {
  const emptyAnswers = useMemo(() => data.questions.map(() => null), [data.questions]);
  const [answers, setAnswers] = useState<Array<number | null>>(emptyAnswers);
  const [submitted, setSubmitted] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [wrongQuestionIds, setWrongQuestionIds] = useState<string[]>([]);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const records = JSON.parse(localStorage.getItem(storageKey) || '{}') as Record<string, SavedQuiz>;
        const saved = records[pageId];
        if (saved && saved.answers.length === data.questions.length) {
          setAnswers(saved.answers);
          setSubmitted(saved.submitted);
          setAttempts(saved.attempts);
          setBestScore(saved.bestScore);
          setWrongQuestionIds(saved.wrongQuestionIds);
        } else {
          setAnswers(emptyAnswers);
          setSubmitted(false);
          setAttempts(0);
          setBestScore(0);
          setWrongQuestionIds([]);
        }
      } catch {
        setAnswers(emptyAnswers);
      }
      setNotice('');
    }, 0);
    return () => window.clearTimeout(timer);
  }, [data.questions.length, emptyAnswers, pageId]);

  const score = data.questions.reduce((total, question, index) => {
    const choice = answers[index] === null ? null : question.choices[answers[index]!];
    return total + (choice?.correct ? 1 : 0);
  }, 0);

  function persist(next: SavedQuiz) {
    try {
      const records = JSON.parse(localStorage.getItem(storageKey) || '{}') as Record<string, SavedQuiz>;
      records[pageId] = next;
      localStorage.setItem(storageKey, JSON.stringify(records));
    } catch {
      setNotice('浏览器未允许保存进度，但仍可继续本次作答。');
    }
  }

  function choose(questionIndex: number, choiceIndex: number) {
    if (submitted) return;
    const nextAnswers = answers.map((answer, index) => index === questionIndex ? choiceIndex : answer);
    setAnswers(nextAnswers);
    persist({ answers: nextAnswers, submitted: false, attempts, bestScore, wrongQuestionIds });
    setNotice('');
  }

  function submit() {
    if (answers.some((answer) => answer === null)) {
      setNotice('还有题目没有作答。全部选择后才能提交并查看解析。');
      return;
    }
    const nextAttempts = attempts + 1;
    const currentWrongIds = data.questions.filter((question, index) => !question.choices[answers[index]!].correct).map((question) => question.id);
    const currentCorrectIds = data.questions.filter((question, index) => question.choices[answers[index]!].correct).map((question) => question.id);
    const nextWrongQuestionIds = [...new Set([...wrongQuestionIds, ...currentWrongIds])].filter((id) => !currentCorrectIds.includes(id));
    const nextBestScore = Math.max(bestScore, score);
    setSubmitted(true);
    setAttempts(nextAttempts);
    setBestScore(nextBestScore);
    setWrongQuestionIds(nextWrongQuestionIds);
    setNotice('');
    persist({ answers, submitted: true, attempts: nextAttempts, bestScore: nextBestScore, wrongQuestionIds: nextWrongQuestionIds });
  }

  function retry() {
    setAnswers(emptyAnswers);
    setSubmitted(false);
    setNotice('已开始新一轮，正确答案再次隐藏。');
    persist({ answers: emptyAnswers, submitted: false, attempts, bestScore, wrongQuestionIds });
  }

  return (
    <section className="official-quiz" aria-labelledby="official-quiz-heading">
      <header>
        <div><span>官方题目 · 本地互动模式</span><h2 id="official-quiz-heading">先作答，提交后看解析</h2></div>
        <div className="quiz-stat"><strong>{submitted ? `${score}/${data.questions.length}` : `${answers.filter((answer) => answer !== null).length}/${data.questions.length}`}</strong><span>{submitted ? `最佳 ${bestScore} · 错题 ${wrongQuestionIds.length}` : '已作答'}</span></div>
      </header>

      {data.questions.map((question, questionIndex) => (
        <fieldset key={question.id} className="official-question">
          <legend><span>{String(questionIndex + 1).padStart(2, '0')}</span><strong>{question.title}</strong></legend>
          {question.prompt && <div className="question-prompt"><ReactMarkdown rehypePlugins={[rehypeRaw]}>{question.prompt}</ReactMarkdown></div>}
          <div className="official-choices">
            {question.choices.map((choice, choiceIndex) => {
              const chosen = answers[questionIndex] === choiceIndex;
              const resultClass = submitted ? (choice.correct ? 'correct' : chosen ? 'wrong' : '') : '';
              return (
                <button type="button" key={`${question.id}-${choiceIndex}`} className={`${chosen ? 'chosen' : ''} ${resultClass}`} onClick={() => choose(questionIndex, choiceIndex)} disabled={submitted}>
                  <span>{String.fromCharCode(65 + choiceIndex)}</span>
                  <div><ReactMarkdown rehypePlugins={[rehypeRaw]}>{choice.text}</ReactMarkdown></div>
                  {submitted && choice.correct && <b>正确答案</b>}
                </button>
              );
            })}
          </div>
          {submitted && answers[questionIndex] !== null && (
            <aside className={question.choices[answers[questionIndex]!].correct ? 'correct' : 'wrong'}>
              <strong>{question.choices[answers[questionIndex]!].correct ? '回答正确' : '需要复习'}</strong>
              <p>{question.choices[answers[questionIndex]!].explanation || question.choices.find((choice) => choice.correct)?.explanation || '官方没有为该选项提供单独解析。'}</p>
              {!question.choices[answers[questionIndex]!].correct && <button type="button" onClick={onReview}>回到对应正文：{reviewLabel} →</button>}
            </aside>
          )}
        </fieldset>
      ))}

      {notice && <p className="quiz-notice" role="status">{notice}</p>}
      <footer>
        {!submitted ? <button type="button" onClick={submit}>提交全部答案</button> : <button type="button" onClick={retry}>重新作答</button>}
        <p>{submitted ? `本次 ${score}/${data.questions.length}；错题已保存在当前浏览器。` : '提交前不会显示正确答案和解析，刷新页面也会保留选择。'}</p>
      </footer>
    </section>
  );
}
