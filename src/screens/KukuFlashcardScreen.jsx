import { useState, useEffect, useRef } from 'react';
import BearCharacter from '../components/BearCharacter';

const COLORS = ['#FFAB91', '#A5D6A7', '#90CAF9', '#CE93D8'];
const EMOJIS_OK = ['⭐', '🌟', '✨', '🎉', '🎊', '👏'];
const TOTAL = 81;

function buildQuestions(mode) {
  const all = [];
  for (let a = 1; a <= 9; a++) {
    for (let b = 1; b <= 9; b++) {
      all.push({ a, b, answer: a * b, display: `${a} × ${b} ＝ ？` });
    }
  }
  if (mode === 'random') {
    for (let i = all.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [all[i], all[j]] = [all[j], all[i]];
    }
  }
  return all;
}

function generateChoices(answer) {
  const choices = new Set([answer]);
  let attempts = 0;
  while (choices.size < 4 && attempts < 100) {
    attempts++;
    const delta = Math.floor(Math.random() * 12) + 1;
    const candidate = answer + (Math.random() > 0.5 ? delta : -delta);
    if (candidate >= 1 && candidate <= 81) choices.add(candidate);
  }
  for (let i = 1; choices.size < 4; i++) choices.add(i);
  return [...choices].sort(() => Math.random() - 0.5);
}

export default function KukuFlashcardScreen({ route, navigation }) {
  const { mode } = route.params;
  const [questions] = useState(() => buildQuestions(mode));
  const [idx, setIdx]               = useState(0);
  const [choices, setChoices]       = useState([]);
  const [selected, setSelected]     = useState(null);
  const [correct, setCorrect]       = useState(0);
  const [cardClass, setCardClass]   = useState('');
  const [feedbackEmoji, setFeedbackEmoji] = useState('');
  const [showFeedback, setShowFeedback]   = useState(false);
  const [finished, setFinished]     = useState(false);
  const timerRef = useRef(null);

  const question = questions[idx];

  useEffect(() => {
    if (!finished) setChoices(generateChoices(question.answer));
  }, [idx, finished]);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  function advance() {
    if (idx + 1 >= TOTAL) {
      setFinished(true);
    } else {
      setIdx((i) => i + 1);
      setSelected(null);
      setShowFeedback(false);
      setCardClass('');
    }
  }

  function handleAnswer(choice) {
    if (selected !== null) return;
    setSelected(choice);
    const isCorrect = choice === question.answer;
    if (isCorrect) {
      setCorrect((n) => n + 1);
      setFeedbackEmoji(EMOJIS_OK[Math.floor(Math.random() * EMOJIS_OK.length)]);
      setShowFeedback(true);
      setCardClass('card-bounce');
      setTimeout(() => setCardClass(''), 500);
      timerRef.current = setTimeout(advance, 1200);
    } else {
      setCardClass('card-shake');
      timerRef.current = setTimeout(() => {
        setCardClass('');
        setSelected(null);
        setShowFeedback(false);
      }, 900);
    }
  }

  const modeLabel = mode === 'sequential' ? 'じゅんばん' : 'ランダム';

  if (finished) {
    const pct = Math.round((correct / TOTAL) * 100);
    return (
      <div className="screen">
        <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 40, paddingBottom: 40 }}>
          <BearCharacter size={120} expression="happy" />
          <h2 style={{ fontSize: 28, fontWeight: 900, color: '#5D2E0C', marginTop: 16 }}>かんりょう！🎉</h2>
          <p style={{ fontSize: 17, color: '#A0522D', marginTop: 6 }}>81もん ぜんぶといたよ！</p>

          <div style={{
            backgroundColor: 'rgba(255,255,255,0.85)',
            borderRadius: 24,
            padding: 32,
            marginTop: 24,
            textAlign: 'center',
            width: '100%',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          }}>
            <p style={{ fontSize: 18, color: '#5D2E0C', fontWeight: 'bold' }}>せいかい</p>
            <p style={{ fontSize: 60, fontWeight: 900, color: '#e67e22', margin: '6px 0' }}>
              {correct}
              <span style={{ fontSize: 26, color: '#A0522D' }}> / {TOTAL}</span>
            </p>
            <p style={{ fontSize: 26, fontWeight: 'bold', color: '#2ecc71' }}>{pct}%</p>
          </div>

          <button
            onClick={() => navigation.navigate('KukuMenu')}
            style={{
              marginTop: 32,
              width: '100%',
              padding: '18px 0',
              background: 'linear-gradient(135deg, #FFB74D, #F57C00)',
              borderRadius: 24,
              color: '#fff',
              fontSize: 20,
              fontWeight: 'bold',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            }}
          >
            ← もどる
          </button>
        </div>
      </div>
    );
  }

  const bearExpression = (selected !== null && selected === question.answer) ? 'happy' : 'normal';
  const progressPct = (idx / TOTAL) * 100;

  return (
    <div className="screen">
      <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 8, paddingBottom: 32 }}>

        {/* ヘッダー */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: 8 }}>
          <button
            onClick={() => navigation.navigate('KukuMenu')}
            style={{ padding: 8, backgroundColor: 'transparent', color: '#5D2E0C', fontSize: 16, fontWeight: 'bold' }}
          >
            ← もどる
          </button>
          <span style={{ color: '#5D2E0C', fontSize: 20, fontWeight: 'bold' }}>九九 – {modeLabel}</span>
          <span style={{ color: '#5D2E0C', fontSize: 18, fontWeight: 'bold' }}>⭐ {correct}</span>
        </div>

        {/* 問題数 */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', marginBottom: 6 }}>
          <span style={{ color: '#5D2E0C', fontSize: 16, fontWeight: 'bold' }}>{idx + 1} / {TOTAL}もん</span>
        </div>

        {/* 進捗バー */}
        <div style={{ width: '100%', height: 10, backgroundColor: 'rgba(255,255,255,0.6)', borderRadius: 5, marginBottom: 12, overflow: 'hidden' }}>
          <div style={{ width: `${progressPct}%`, height: '100%', backgroundColor: '#FF7043', borderRadius: 5, transition: 'width 0.3s ease' }} />
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
        {showFeedback && selected === question.answer && (
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
            <span style={{ fontSize: 16, color: '#5D2E0C', marginTop: 4 }}>
              {question.a} × {question.b} ＝ {question.answer}
            </span>
          </div>
        )}

        {/* 選択肢 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, width: '100%', marginTop: 4 }}>
          {choices.map((c, i) => {
            const isSelected = selected === c;
            const isCorrect = c === question.answer;
            let bgColor = COLORS[i];
            if (isSelected) bgColor = isCorrect ? '#2ecc71' : '#e74c3c';
            return (
              <button
                key={`${c}-${i}`}
                onClick={() => handleAnswer(c)}
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
