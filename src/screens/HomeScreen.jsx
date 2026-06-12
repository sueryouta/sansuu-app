import { useState, useEffect } from 'react';
import { loadWrongQuestions, clearWrongQuestions } from '../utils/storage';
import BearCharacter from '../components/BearCharacter';

const CATEGORIES = [
  {
    id: 'addition',
    label: 'たし算',
    emoji: '➕',
    description: 'かずをたしてみよう！',
    colors: ['#FF6B6B', '#FF8E53'],
  },
  {
    id: 'subtraction',
    label: 'ひき算',
    emoji: '➖',
    description: 'かずをひいてみよう！',
    colors: ['#4ECDC4', '#44A08D'],
  },
  {
    id: 'mixed',
    label: 'まざった',
    emoji: '🔀',
    description: 'たし算とひき算をまぜて！',
    colors: ['#A855F7', '#6366F1'],
  },
  {
    id: 'carrying2',
    label: 'くり上がり2桁',
    emoji: '🔢',
    description: '2けたのくり上がりにちょうせん！',
    colors: ['#FF9A3C', '#FF6348'],
  },
];

const LEVELS = [
  { id: 1, label: 'かんたん', emoji: '⭐', color: '#4ECDC4' },
  { id: 2, label: 'ふつう',   emoji: '⭐⭐', color: '#F7B731' },
  { id: 3, label: 'むずかしい', emoji: '⭐⭐⭐', color: '#FC5C65' },
];

const LEVEL_DESCS = {
  carrying2: { 1: '2桁＋1桁', 2: '2桁＋2桁(小)', 3: '2桁＋2桁(大)' },
};

export default function HomeScreen({ navigation }) {
  const [wrongQuestions, setWrongQuestions] = useState([]);
  const [noteOpen, setNoteOpen] = useState(false);

  useEffect(() => {
    setWrongQuestions(loadWrongQuestions());
  }, []);

  function handleClear() {
    clearWrongQuestions();
    setWrongQuestions([]);
  }

  return (
    <div className="screen">
      <div className="container" style={{ paddingBottom: 40 }}>

        {/* タイトル */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 20, marginBottom: 28 }}>
          <BearCharacter size={130} expression="happy" />
          <h1 style={{ fontSize: 30, fontWeight: 900, color: '#5D2E0C', marginTop: 8 }}>さんすうれんしゅう</h1>
          <p style={{ fontSize: 16, color: '#A0522D', marginTop: 4 }}>もんだいをえらんでね！</p>
        </div>

        {/* カテゴリカード */}
        {CATEGORIES.map((cat) => (
          <div
            key={cat.id}
            style={{
              backgroundColor: 'rgba(255,255,255,0.6)',
              borderRadius: 24,
              marginBottom: 20,
              overflow: 'hidden',
            }}
          >
            {/* カテゴリヘッダー */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              padding: 18,
              background: `linear-gradient(135deg, ${cat.colors[0]}, ${cat.colors[1]})`,
            }}>
              <span style={{ fontSize: 40 }}>{cat.emoji}</span>
              <div>
                <p style={{ fontSize: 24, fontWeight: 'bold', color: '#fff' }}>{cat.label}</p>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.9)', marginTop: 2 }}>{cat.description}</p>
              </div>
            </div>

            {/* レベルボタン */}
            <div style={{ display: 'flex', justifyContent: 'space-around', padding: '16px 12px', gap: 10 }}>
              {LEVELS.map((lv) => {
                const subDesc = LEVEL_DESCS[cat.id]?.[lv.id];
                return (
                  <button
                    key={lv.id}
                    onClick={() => navigation.navigate('Game', { category: cat.id, level: lv.id })}
                    style={{
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      paddingTop: 14,
                      paddingBottom: 14,
                      borderRadius: 16,
                      border: `2.5px solid ${lv.color}`,
                      backgroundColor: '#fff',
                      cursor: 'pointer',
                    }}
                  >
                    <span style={{ fontSize: 18 }}>{lv.emoji}</span>
                    <span style={{ fontSize: 13, fontWeight: 'bold', marginTop: 4, color: lv.color }}>{lv.label}</span>
                    {subDesc && <span style={{ fontSize: 10, color: '#888', marginTop: 2 }}>{subDesc}</span>}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {/* まちがいノート */}
        <button
          onClick={() => setNoteOpen((o) => !o)}
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: 'rgba(255,255,255,0.6)',
            borderRadius: 20,
            paddingTop: 16,
            paddingBottom: 16,
            paddingLeft: 20,
            paddingRight: 20,
            marginBottom: 4,
            cursor: 'pointer',
          }}
        >
          <span style={{ fontSize: 18, fontWeight: 'bold', color: '#5D2E0C' }}>
            📒 まちがいノート {wrongQuestions.length > 0 ? `（${wrongQuestions.length}もん）` : '（なし）'}
          </span>
          <span style={{ fontSize: 16, color: '#5D2E0C' }}>{noteOpen ? '▲' : '▼'}</span>
        </button>

        {noteOpen && (
          <div style={{
            backgroundColor: 'rgba(255,255,255,0.5)',
            borderRadius: 20,
            padding: 16,
            marginBottom: 8,
          }}>
            {wrongQuestions.length === 0 ? (
              <p style={{ color: '#5D2E0C', fontSize: 16, textAlign: 'center', paddingTop: 8, paddingBottom: 8 }}>
                まちがえた もんだいは ないよ！🎉
              </p>
            ) : (
              <>
                {wrongQuestions.map((q, i) => (
                  <div
                    key={i}
                    style={{
                      backgroundColor: '#fff',
                      borderRadius: 14,
                      paddingTop: 12,
                      paddingBottom: 12,
                      paddingLeft: 16,
                      paddingRight: 16,
                      marginBottom: 8,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <span style={{ fontSize: 20, fontWeight: 'bold', color: '#2c3e50' }}>{q.display}</span>
                    <span style={{ fontSize: 18, color: '#e74c3c', fontWeight: 'bold' }}>こたえ：{q.answer}</span>
                  </div>
                ))}
                <button
                  onClick={handleClear}
                  style={{
                    width: '100%',
                    paddingTop: 10,
                    paddingBottom: 10,
                    marginTop: 4,
                    backgroundColor: 'rgba(255,255,255,0.5)',
                    borderRadius: 12,
                    cursor: 'pointer',
                    color: '#5D2E0C',
                    fontSize: 15,
                    fontWeight: 'bold',
                  }}
                >
                  🗑️ リセット
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
