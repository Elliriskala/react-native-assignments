import {StatusBar} from 'expo-status-bar';
import Navigator from './navigators/Navigator';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {UserProvider} from './contexts/UserContext';
import { UpdateProvider } from './contexts/updateContext';

const App = () => {
  return (
    <SafeAreaProvider>
      <UserProvider>
        <UpdateProvider>
          <Navigator></Navigator>
        </UpdateProvider>
      </UserProvider>
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
};

export default App;
