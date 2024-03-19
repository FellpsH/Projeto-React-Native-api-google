import React from 'react';
import { SafeAreaView } from 'react-native';
import Mapa from './src/components/Mapa/Mapa.js';
import { I18nextProvider } from 'react-i18next';
import i18n from './src/languages/ii8n.js';

const App = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <I18nextProvider i18n={i18n}>
        <Mapa />
      </I18nextProvider>
    </SafeAreaView>
  );
};

export default App;