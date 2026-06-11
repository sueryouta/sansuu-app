import BearCharacter from '../components/BearCharacter';

export default function ResultScreen({ route, navigation }) {
  const { score, correct, total, wrongQuestions, category, level } = route.params;
  const perfect = correct === total;
  const bearExpression = perfect ? 'excited' : correct >= total / 2 ? 'happy' : 'sad';

  const resultTitle = perfect ? 'かんぺき！' : correct >= total / 2 ? 'よくできました！' : 'もうすこし！';

  return (
    <div className="screen">
      <div className="container" style={{ paddingTop: 8, paddingBottom: 40 }}>

        {/* 結果ヘッダー */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: 'rgba(255,255,255,0.6)',
          borderRadius: 28,
          paddingTop: 32,
          paddingBottom: 32,
          marginTop: 24,
          marginBottom: 24,
        }}>
          <BearCharacter size={120} expression={bearExpression} />
          <h2 style={{ fontSize: 30, fontWeight: 'bold', color: '#5D2E0C', marginTop: 12 }}>{resultTitle}</h2>
          <p style={{ fontSize: 28, fontWeight: 'bold', color: '#E07040', marginTop: 8 }}>⭐ {score}てん</p>
          <p style={{ fontSize: 18, color: '#A0522D', marginTop: 8 }}>
            {total}もんちゅう {correct}もん せいかい！
          </p>
        </div>

        {/* まちがいリスト */}
        {wrongQuestions.length > 0 && (
          <div style={{
            backgroundColor: 'rgba(255,255,255,0.6)',
            borderRadius: 20,
            padding: 16,
            marginBottom: 24,
          }}>
            <p style={{ fontSize: 18, fontWeight: 'bold', color: '#5D2E0C', marginBottom: 12 }}>
              ❌ まちがえた もんだい
            </p>
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
          </div>
        )}

        {/* ボタン */}
        <button
          onClick={() => navigation.replace('Game', { category, level })}
          style={{
            width: '100%',
            backgroundColor: '#FFE066',
            borderRadius: 20,
            paddingTop: 18,
            paddingBottom: 18,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 12,
            cursor: 'pointer',
            fontSize: 20,
            fontWeight: 'bold',
            color: '#2c3e50',
          }}
        >
          🔄 もういちど
        </button>

        <button
          onClick={() => navigation.navigate('Home')}
          style={{
            width: '100%',
            backgroundColor: 'rgba(255,255,255,0.6)',
            borderRadius: 20,
            paddingTop: 18,
            paddingBottom: 18,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontSize: 20,
            fontWeight: 'bold',
            color: '#5D2E0C',
          }}
        >
          🏠 ホームにもどる
        </button>
      </div>
    </div>
  );
}
