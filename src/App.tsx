import {StatusBar} from 'expo-status-bar';
import Navigator from './navigators/Navigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const App = () => {
  console.log('App is running!');
  return (
    <SafeAreaProvider>
      <Navigator />
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
};

export default App;
