import { useState, useEffect, useRef } from 'react';
import { saveWrongQuestions } from '../utils/storage';
import FruitIllustration from '../components/FruitIllustration';
import BearCharacter from '../components/BearCharacter';

const TOTAL_QUESTIONS = 10;

// ── 問題生成 ───────────────────────────────────────────

function pickSourceLevel(level) {
  if (level === 1) return 1;
  if (level === 2) return Math.random() < 0.5 ? 1 : 2;
  return 3;
}

function pickPattern(sourceLevel) {
  const weights =
    sourceLevel === 1
      ? [{ type: 'basic', w: 10 }]
      : sourceLevel === 2
      ? [
          { type: 'basic', w: 4 },
          { type: 'hole_left', w: 3 },
          { type: 'hole_right', w: 3 },
        ]
      : [
          { type: 'hole_left', w: 4 },
          { type: 'hole_right', w: 4 },
          { type: 'carry', w: 6 },
        ];
  const total = weights.reduce((s, x) => s + x.w, 0);
  let r = Math.random() * total;
  for (const { type, w } of weights) {
    r -= w;
    if (r <= 0) return type;
  }
  return 'basic';
}

function generateAddition(pattern, level) {
  const max = level === 1 ? 5 : 9;
  if (pattern === 'carry') {
    const a = Math.floor(Math.random() * 9) + 1;
    const minB = Math.max(1, 10 - a);
    const b = minB + Math.floor(Math.random() * (9 - minB + 1));
    return { display: `${a} ＋ ${b} ＝ ？`, answer: a + b, a, b, op: '+', pattern };
  }
  const a = Math.floor(Math.random() * max) + 1;
  const b = Math.floor(Math.random() * (max - a + 1)) + 1;
  const sum = a + b;
  if (pattern === 'hole_left')  return { display: `□ ＋ ${b} ＝ ${sum}`, answer: a, a, b, op: '+', pattern };
  if (pattern === 'hole_right') return { display: `${a} ＋ □ ＝ ${sum}`, answer: b, a, b, op: '+', pattern };
  return { display: `${a} ＋ ${b} ＝ ？`, answer: sum, a, b, op: '+', pattern };
}

function generateSubtraction(pattern, level) {
  const max = level === 1 ? 5 : level === 2 ? 10 : 18;
  if (pattern === 'carry') {
    const a = Math.floor(Math.random() * 9) + 11;
    const b = Math.floor(Math.random() * 9) + 2;
    const answer = a - b;
    if (answer < 0) return generateSubtraction(pattern, level);
    return { display: `${a} － ${b} ＝ ？`, answer, a, b, op: '-', pattern };
  }
  const a = Math.floor(Math.random() * (max - 1)) + 2;
  const b = Math.floor(Math.random() * a) + 1;
  const diff = a - b;
  if (pattern === 'hole_left')  return { display: `□ － ${b} ＝ ${diff}`, answer: a, a, b, op: '-', pattern };
  if (pattern === 'hole_right') return { display: `${a} － □ ＝ ${diff}`, answer: b, a, b, op: '-', pattern };
  return { display: `${a} － ${b} ＝ ？`, answer: diff, a, b, op: '-', pattern };
}

function generateCarry2(level) {
  let a, b, attempts = 0;
  if (level === 1) {
    // 2桁+1桁 くり上がり: aの一の位 + b >= 10
    do {
      a = Math.floor(Math.random() * 19) + 11; // 11-29
      b = Math.floor(Math.random() * 9) + 1;   // 1-9
      attempts++;
    } while ((a % 10) + b < 10 && attempts < 200);
  } else if (level === 2) {
    // 2桁+2桁 くり上がり小: 一の位の和 >= 10、結果 <= 99
    do {
      a = Math.floor(Math.random() * 40) + 11; // 11-50
      b = Math.floor(Math.random() * 40) + 11; // 11-50
      attempts++;
    } while (((a % 10) + (b % 10) < 10 || a + b > 99) && attempts < 200);
    if (attempts >= 200) { a = 23; b = 17; }
  } else {
    // 2桁+2桁 くり上がり大: 一の位の和 >= 10、結果 100超えも可
    do {
      a = Math.floor(Math.random() * 60) + 20; // 20-79
      b = Math.floor(Math.random() * 60) + 20; // 20-79
      attempts++;
    } while ((a % 10) + (b % 10) < 10 && attempts < 200);
  }
  return { display: `${a} ＋ ${b} ＝ ？`, answer: a + b, a, b, op: '+', pattern: 'carry2' };
}

function generateQuestion(category, level) {
  if (category === 'carrying2') return generateCarry2(level);
  const isAdd = category === 'mixed' ? Math.random() > 0.5 : category === 'addition';
  const sourceLevel = pickSourceLevel(level);
  const pattern = pickPattern(sourceLevel);
  return isAdd ? generateAddition(pattern, sourceLevel) : generateSubtraction(pattern, sourceLevel);
}

function generateQuestionSet(category, level, total) {
  const seen = new Set();
  const questions = [];
  let attempts = 0;
  while (questions.length < total && attempts < total * 20) {
    attempts++;
    const q = generateQuestion(category, level);
    if (!seen.has(q.display)) {
      seen.add(q.display);
      questions.push(q);
    }
  }
  return questions;
}

function generateChoices(answer) {
  const choices = new Set([answer]);
  let attempts = 0;
  while (choices.size < 4 && attempts < 50) {
    attempts++;
    const delta = Math.floor(Math.random() * 6) + 1;
    const candidate = answer + (Math.random() > 0.5 ? delta : -delta);
    if (candidate >= 0) choices.add(candidate);
  }
  return [...choices].sort(() => Math.random() - 0.5);
}

// ── 定数 ──────────────────────────────────────────────

const COLORS = ['#FFAB91', '#A5D6A7', '#90CAF9', '#CE93D8'];
const EMOJIS_OK = ['⭐', '🌟', '✨', '🎉', '🎊', '👏'];

// ── メインコンポーネント ──────────────────────────────

export default function GameScreen({ route, navigation }) {
  const { category, level: initLevel } = route.params;
  const [level]        = useState(initLevel);
  const [questionList] = useState(() => generateQuestionSet(category, initLevel, TOTAL_QUESTIONS));
  const [questionNum,  setQuestionNum]  = useState(1);
  const [question,     setQuestion]     = useState(() => questionList[0]);
  const [choices,      setChoices]      = useState([]);
  const [selected,     setSelected]     = useState(null);
  const [score,        setScore]        = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongList,    setWrongList]    = useState([]);
  const [streak,       setStreak]       = useState(0);
  const [retryMode,    setRetryMode]    = useState(false);
  const [retrySelected,setRetrySelected]= useState(null);
  const [cardClass,    setCardClass]    = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackEmoji,setFeedbackEmoji]= useState('');

  const timerRef = useRef(null);

  useEffect(() => {
    setChoices(generateChoices(question.answer));
  }, [question]);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  function finishGame(finalWrong, finalScore, finalCorrectCount) {
    saveWrongQuestions(finalWrong);
    navigation.replace('Result', {
      score: finalScore,
      correct: finalCorrectCount,
      total: TOTAL_QUESTIONS,
      wrongQuestions: finalWrong,
      category,
      level,
    });
  }

  function advanceQuestion(newWrong, newScore, newCorrectCount) {
    if (questionNum >= TOTAL_QUESTIONS) {
      finishGame(newWrong, newScore, newCorrectCount);
      return;
    }
    const nextNum = questionNum + 1;
    setQuestionNum(nextNum);
    setQuestion(questionList[nextNum - 1]);
    setSelected(null);
    setRetryMode(false);
    setRetrySelected(null);
    setShowFeedback(false);
    setCardClass('');
  }

  function handleAnswer(choice) {
    if (selected !== null) return;
    setSelected(choice);
    const correct = choice === question.answer;

    if (correct) {
      const newScore = score + 10 * level;
      const newCorrectCount = correctCount + 1;
      setStreak((s) => s + 1);
      setScore(newScore);
      setCorrectCount(newCorrectCount);
      setFeedbackEmoji(EMOJIS_OK[Math.floor(Math.random() * EMOJIS_OK.length)]);
      setShowFeedback(true);
      setCardClass('card-bounce');
      setTimeout(() => setCardClass(''), 500);
      timerRef.current = setTimeout(() => advanceQuestion(wrongList, newScore, newCorrectCount), 1200);
    } else {
      setStreak(0);
      const newWrong = wrongList.some((w) => w.display === question.display)
        ? wrongList
        : [...wrongList, question];
      setWrongList(newWrong);
      setCardClass('card-shake');
      setTimeout(() => setCardClass(''), 400);
      timerRef.current = setTimeout(() => {
        setRetryMode(true);
        setSelected(null);
        setRetrySelected(null);
      }, 800);
    }
  }

  function handleRetry(choice) {
    if (retrySelected !== null) return;
    setRetrySelected(choice);
    const correct = choice === question.answer;
    if (correct) {
      setCardClass('card-bounce');
      setTimeout(() => setCardClass(''), 500);
      timerRef.current = setTimeout(() => advanceQuestion(wrongList, score, correctCount), 1000);
    } else {
      setCardClass('card-shake');
      timerRef.current = setTimeout(() => {
        setCardClass('');
        setRetrySelected(null);
      }, 900);
    }
  }

  const levelLabel = level === 1 ? 'かんたん' : level === 2 ? 'ふつう' : 'むずかしい';
  const levelColor = level === 1 ? '#4ECDC4' : level === 2 ? '#F7B731' : '#FC5C65';
  const categoryLabel = category === 'addition' ? 'たし算' : category === 'subtraction' ? 'ひき算' : category === 'carrying2' ? 'くり上がり2桁' : 'まざった';
  const bearExpression = retryMode ? 'sad' : (selected === question.answer && selected !== null) ? 'happy' : 'normal';

  const progressPct = ((questionNum - 1) / TOTAL_QUESTIONS) * 100;

  return (
    <div className="screen">
      <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 8, paddingBottom: 32 }}>

        {/* ヘッダー */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: 8 }}>
          <button
            onClick={() => navigation.goBack()}
            style={{ padding: 8, backgroundColor: 'transparent', color: '#5D2E0C', fontSize: 16, fontWeight: 'bold', cursor: 'pointer' }}
          >
            ← もどる
          </button>
          <span style={{ color: '#5D2E0C', fontSize: 20, fontWeight: 'bold' }}>{categoryLabel}</span>
          <span style={{ color: '#5D2E0C', fontSize: 18, fontWeight: 'bold' }}>⭐ {score}</span>
        </div>

        {/* レベル・問題数 */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: 6 }}>
          <span style={{ backgroundColor: levelColor, color: '#fff', fontWeight: 'bold', fontSize: 14, padding: '5px 12px', borderRadius: 20 }}>
            {levelLabel}
          </span>
          <span style={{ color: '#5D2E0C', fontSize: 16, fontWeight: 'bold' }}>{questionNum} / {TOTAL_QUESTIONS}もん</span>
          <span style={{ backgroundColor: 'rgba(255,255,255,0.5)', color: '#5D2E0C', fontSize: 14, fontWeight: 'bold', padding: '5px 12px', borderRadius: 20 }}>
            🔥 {streak}
          </span>
        </div>

        {/* 進捗バー */}
        <div style={{ width: '100%', height: 10, backgroundColor: 'rgba(255,255,255,0.6)', borderRadius: 5, marginBottom: 12, overflow: 'hidden' }}>
          <div style={{ width: `${progressPct}%`, height: '100%', backgroundColor: levelColor, borderRadius: 5, transition: 'width 0.3s ease' }} />
        </div>

        {/* くまキャラクター */}
        <div style={{ marginBottom: 4 }}>
          <BearCharacter size={80} expression={bearExpression} />
        </div>

        {/* 問題カード */}
        <div
          className={`question-card ${cardClass}`}
          style={{
            backgroundColor: '#fff',
            borderRadius: 28,
            paddingTop: 36,
            paddingBottom: 36,
            paddingLeft: 24,
            paddingRight: 24,
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            marginBottom: 12,
          }}
        >
          <span style={{ fontSize: 44, fontWeight: 'bold', color: '#2c3e50', letterSpacing: 2 }}>
            {question.display}
          </span>
        </div>

        {/* 正解フィードバック */}
        {showFeedback && !retryMode && selected === question.answer && (
          <div
            className="feedback-fadein"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              backgroundColor: 'rgba(255,255,255,0.95)',
              borderRadius: 20,
              padding: 16,
              marginBottom: 10,
              width: '100%',
            }}
          >
            <span style={{ fontSize: 48 }}>{feedbackEmoji}</span>
            <span style={{ fontSize: 24, fontWeight: 'bold', color: '#2ecc71', marginTop: 4 }}>せいかい！</span>
          </div>
        )}

        {/* 果物イラスト（リトライ時） */}
        {retryMode && <FruitIllustration question={question} showAnswer={false} />}

        {/* 選択肢 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, width: '100%', marginTop: 4 }}>
          {choices.map((c, i) => {
            const sel = retryMode ? retrySelected : selected;
            const isSelected = sel === c;
            const isCorrect = c === question.answer;
            let bgColor = COLORS[i];
            if (isSelected) bgColor = isCorrect ? '#2ecc71' : '#e74c3c';
            else if (retryMode && isCorrect && retrySelected !== null) bgColor = '#2ecc71';
            return (
              <button
                key={`${c}-${i}`}
                onClick={() => retryMode ? handleRetry(c) : handleAnswer(c)}
                style={{
                  backgroundColor: bgColor,
                  borderRadius: 24,
                  paddingTop: 26,
                  paddingBottom: 26,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                }}
              >
                <span style={{ fontSize: 46, fontWeight: 'bold', color: '#fff' }}>{c}</span>
              </button>
            );
          })}
        </div>

        <p style={{ color: '#A0522D', fontSize: 15, marginTop: 14 }}>↑ こたえをえらんでね！</p>
      </div>
    </div>
  );
}
