import BearCharacter from '../components/BearCharacter';

const MENU_ITEMS = [
  {
    key: 'grid',
    label: '九九の表を見る',
    emoji: '📊',
    description: '9×9のひょうでかくにんしよう',
    target: 'KukuGrid',
    params: {},
    colors: ['#4FC3F7', '#0288D1'],
  },
  {
    key: 'sequential',
    label: 'じゅんばん通りに練習',
    emoji: '📋',
    description: '1×1からじゅんばんに81もん！',
    target: 'KukuFlashcard',
    params: { mode: 'sequential' },
    colors: ['#81C784', '#388E3C'],
  },
  {
    key: 'random',
    label: 'ランダムで練習',
    emoji: '🎲',
    description: 'シャッフルして81もんちょうせん！',
    target: 'KukuFlashcard',
    params: { mode: 'random' },
    colors: ['#FFB74D', '#F57C00'],
  },
];

export default function KukuMenuScreen({ navigation }) {
  return (
    <div className="screen">
      <div className="container" style={{ paddingBottom: 40 }}>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 16, marginBottom: 8 }}>
          <button
            onClick={() => navigation.goBack()}
            style={{ padding: 8, backgroundColor: 'transparent', color: '#5D2E0C', fontSize: 16, fontWeight: 'bold' }}
          >
            ← もどる
          </button>
          <span style={{ color: '#5D2E0C', fontSize: 20, fontWeight: 'bold' }}>九九をおぼえよう</span>
          <span style={{ width: 72 }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 8, marginBottom: 28 }}>
          <BearCharacter size={110} expression="happy" />
          <p style={{ fontSize: 16, color: '#A0522D', marginTop: 8 }}>なにをするか えらんでね！</p>
        </div>

        {MENU_ITEMS.map((item) => (
          <button
            key={item.key}
            onClick={() => navigation.navigate(item.target, item.params)}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              background: `linear-gradient(135deg, ${item.colors[0]}, ${item.colors[1]})`,
              borderRadius: 24,
              padding: '20px 24px',
              marginBottom: 16,
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              textAlign: 'left',
            }}
          >
            <span style={{ fontSize: 44 }}>{item.emoji}</span>
            <div>
              <p style={{ fontSize: 21, fontWeight: 'bold', color: '#fff' }}>{item.label}</p>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.9)', marginTop: 4 }}>{item.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
