import React from 'react';
import { SafeAreaView } from 'react-native';
import Mapa from './src/components/Mapa.js';

const App = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Mapa />
    </SafeAreaView>
  );
};

export default App;