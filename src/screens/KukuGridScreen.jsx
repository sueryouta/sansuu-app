const COLUMN_COLORS = [
  '#EF5350', '#FF7043', '#FFA726', '#FFEE58',
  '#66BB6A', '#26C6DA', '#42A5F5', '#7E57C2', '#EC407A',
];

export default function KukuGridScreen({ navigation }) {
  return (
    <div className="screen">
      <div className="container" style={{ paddingBottom: 40 }}>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 16, marginBottom: 20 }}>
          <button
            onClick={() => navigation.navigate('KukuMenu')}
            style={{ padding: 8, backgroundColor: 'transparent', color: '#5D2E0C', fontSize: 16, fontWeight: 'bold' }}
          >
            ← もどる
          </button>
          <span style={{ color: '#5D2E0C', fontSize: 20, fontWeight: 'bold' }}>九九の表</span>
          <span style={{ width: 72 }} />
        </div>

        <div style={{ overflowX: 'auto', borderRadius: 16, boxShadow: '0 4px 16px rgba(0,0,0,0.12)' }}>
          <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 320 }}>
            <thead>
              <tr>
                <th style={{
                  padding: '8px 4px',
                  backgroundColor: 'rgba(255,255,255,0.7)',
                  fontSize: 13,
                  color: '#5D2E0C',
                  fontWeight: 'bold',
                  minWidth: 32,
                }}>×</th>
                {Array.from({ length: 9 }, (_, i) => i + 1).map((n) => (
                  <th
                    key={n}
                    style={{
                      padding: '9px 4px',
                      backgroundColor: COLUMN_COLORS[n - 1],
                      color: n === 4 ? '#5D2E0C' : '#fff',
                      fontWeight: 'bold',
                      fontSize: 12,
                      textAlign: 'center',
                      minWidth: 36,
                    }}
                  >
                    {n}の段
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 9 }, (_, row) => row + 1).map((r) => (
                <tr key={r}>
                  <td style={{
                    padding: '8px 4px',
                    textAlign: 'center',
                    fontWeight: 'bold',
                    fontSize: 14,
                    color: '#5D2E0C',
                    backgroundColor: 'rgba(255,255,255,0.7)',
                  }}>
                    ×{r}
                  </td>
                  {Array.from({ length: 9 }, (_, col) => col + 1).map((c) => (
                    <td
                      key={c}
                      style={{
                        padding: '9px 4px',
                        textAlign: 'center',
                        backgroundColor: `${COLUMN_COLORS[c - 1]}2a`,
                        fontWeight: 'bold',
                        fontSize: 16,
                        color: '#2c3e50',
                        border: '1px solid rgba(255,255,255,0.7)',
                      }}
                    >
                      {c * r}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
