import { useState } from 'react';
import HomeScreen from './screens/HomeScreen';
import GameScreen from './screens/GameScreen';
import ResultScreen from './screens/ResultScreen';
import KukuMenuScreen from './screens/KukuMenuScreen';
import KukuGridScreen from './screens/KukuGridScreen';
import KukuFlashcardScreen from './screens/KukuFlashcardScreen';

export default function App() {
  const [screen, setScreen] = useState('home');
  const [params, setParams] = useState({});

  const navigate = (screenName, newParams = {}) => {
    setParams(newParams);
    setScreen(screenName.toLowerCase());
  };

  const navigation = {
    navigate,
    replace: navigate,
    goBack: () => { setParams({}); setScreen('home'); },
  };

  if (screen === 'game') return <GameScreen route={{ params }} navigation={navigation} />;
  if (screen === 'result') return <ResultScreen route={{ params }} navigation={navigation} />;
  if (screen === 'kukumenu') return <KukuMenuScreen navigation={navigation} />;
  if (screen === 'kukugrid') return <KukuGridScreen navigation={navigation} />;
  if (screen === 'kukuflashcard') return <KukuFlashcardScreen route={{ params }} navigation={navigation} />;
  return <HomeScreen navigation={navigation} />;
}
