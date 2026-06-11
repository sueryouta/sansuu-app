const FRUIT_PAIRS = [
  ['🍎', '🍊'],
  ['🍇', '🍓'],
  ['🍋', '🍑'],
  ['🫐', '🍒'],
  ['🥝', '🍌'],
];

function pickFruits(seed) {
  return FRUIT_PAIRS[seed % FRUIT_PAIRS.length];
}

function FruitGrid({ count, emoji, size = 30, isQuestion = false }) {
  const rows = [];
  for (let i = 0; i < count; i += 5) {
    rows.push(Array.from({ length: Math.min(5, count - i) }, (_, j) => i + j));
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {rows.map((row, ri) => (
        <div key={ri} style={{ display: 'flex', justifyContent: 'center', marginBottom: 2 }}>
          {row.map((idx) => (
            <span key={idx} style={{ fontSize: size, margin: '0 3px' }}>
              {isQuestion ? '❓' : emoji}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

function CrossedRow({ a, answer, emoji, size = 28 }) {
  const rows = [];
  for (let i = 0; i < a; i += 5) {
    rows.push(Array.from({ length: Math.min(5, a - i) }, (_, j) => i + j));
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {rows.map((row, ri) => (
        <div key={ri} style={{ display: 'flex', justifyContent: 'center', marginBottom: 2 }}>
          {row.map((idx) => {
            const isCrossed = idx >= answer;
            return (
              <span
                key={idx}
                style={{
                  position: 'relative',
                  fontSize: size,
                  margin: '0 3px',
                  opacity: isCrossed ? 0.25 : 1,
                }}
              >
                {emoji}
                {isCrossed && (
                  <span style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    fontSize: 16,
                    color: '#e74c3c',
                    fontWeight: 'bold',
                  }}>✕</span>
                )}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
}

function Label({ text }) {
  return <p style={{ fontSize: 14, color: '#555', marginBottom: 10, textAlign: 'center' }}>{text}</p>;
}

function Group({ label, count, emoji, isQuestion = false, size = 28 }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 4 }}>
      <span style={{ fontSize: 13, color: '#888', marginBottom: 4 }}>{label}</span>
      <FruitGrid count={count} emoji={emoji} size={size} isQuestion={isQuestion} />
    </div>
  );
}

function Op({ text }) {
  return <p style={{ fontSize: 26, color: '#555', margin: '6px 0' }}>{text}</p>;
}

function Answer({ text }) {
  return (
    <div style={{ backgroundColor: '#fff3cd', borderRadius: 12, padding: '8px 20px', marginTop: 8 }}>
      <span style={{ fontSize: 20, fontWeight: 'bold', color: '#2c3e50' }}>{text}</span>
    </div>
  );
}

function AdditionView({ a, b, pattern, answer, fruitA, fruitB, showAnswer }) {
  if (pattern === 'hole_left') {
    return (
      <>
        <Label text={`❓こ ＋ ${fruitB} ${b}こ`} />
        <Group label="❓こ" count={a} emoji={fruitA} isQuestion />
        <Op text="＋" />
        <Group label={`${fruitB} ${b}こ`} count={b} emoji={fruitB} />
        {showAnswer && <Answer text={`❓は ${a}こ！`} />}
      </>
    );
  }
  if (pattern === 'hole_right') {
    return (
      <>
        <Label text={`${fruitA} ${a}こ ＋ ❓こ`} />
        <Group label={`${fruitA} ${a}こ`} count={a} emoji={fruitA} />
        <Op text="＋" />
        <Group label="❓こ" count={b} emoji={fruitB} isQuestion />
        {showAnswer && <Answer text={`❓は ${b}こ！`} />}
      </>
    );
  }
  if (pattern === 'carry') {
    return (
      <>
        <Label text={`${fruitA} ${a}こ ＋ ${fruitB} ${b}こ`} />
        <Group label={`${fruitA} ${a}こ`} count={a} emoji={fruitA} size={24} />
        <Op text="＋" />
        <Group label={`${fruitB} ${b}こ`} count={b} emoji={fruitB} size={24} />
        {showAnswer && <Answer text={`ぜんぶで ${answer}こ！`} />}
      </>
    );
  }
  return (
    <>
      <Label text={`${fruitA} ${a}こ ＋ ${fruitB} ${b}こ`} />
      <Group label={`${fruitA} ${a}こ`} count={a} emoji={fruitA} />
      <Op text="＋" />
      <Group label={`${fruitB} ${b}こ`} count={b} emoji={fruitB} />
      {showAnswer && <Answer text={`ぜんぶで ${answer}こ！`} />}
    </>
  );
}

function SubtractionView({ a, b, pattern, answer, fruitA, fruitB, showAnswer }) {
  if (pattern === 'hole_left') {
    const total = answer + b;
    return (
      <>
        <Label text={`❓こ から ${fruitB} ${b}こ とる`} />
        <Group label="❓こ" count={total} emoji={fruitA} isQuestion size={24} />
        <Op text="－" />
        <Group label={`${fruitB} ${b}こ とる`} count={b} emoji={fruitB} size={24} />
        {showAnswer && <Answer text={`❓は ${total}こ！`} />}
      </>
    );
  }
  if (pattern === 'hole_right') {
    return (
      <>
        <Label text={`${fruitA} ${a}こ から ❓こ とる`} />
        <CrossedRow a={a} answer={answer} emoji={fruitA} />
        {showAnswer && <Answer text={`❓は ${b}こ！`} />}
      </>
    );
  }
  if (pattern === 'carry') {
    return (
      <>
        <Label text={`${fruitA} ${a}こ から ${b}こ とる`} />
        <CrossedRow a={a} answer={answer} emoji={fruitA} size={22} />
        {showAnswer && <Answer text={`のこり ${answer}こ！`} />}
      </>
    );
  }
  return (
    <>
      <Label text={`${fruitA} ${a}こ から ${b}こ とる`} />
      <CrossedRow a={a} answer={answer} emoji={fruitA} />
      {showAnswer && <Answer text={`のこり ${answer}こ！`} />}
    </>
  );
}

export default function FruitIllustration({ question, showAnswer = true }) {
  const { a, b, op, pattern, answer } = question;
  const [fruitA, fruitB] = pickFruits((a + b + answer) % FRUIT_PAIRS.length);

  return (
    <div
      className="fruit-fadein"
      style={{
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 16,
        marginBottom: 10,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {op === '+' ? (
        <AdditionView a={a} b={b} pattern={pattern} answer={answer} fruitA={fruitA} fruitB={fruitB} showAnswer={showAnswer} />
      ) : (
        <SubtractionView a={a} b={b} pattern={pattern} answer={answer} fruitA={fruitA} fruitB={fruitB} showAnswer={showAnswer} />
      )}
    </div>
  );
}
