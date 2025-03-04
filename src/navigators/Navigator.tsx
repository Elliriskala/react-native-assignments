import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import Home from '../views/Home';
import Profile from '../views/Profile';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Single from '../views/Single';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useUserContext} from '../hooks/contextHooks';
import Login from '../views/Login';
import MyFiles from '../views/MyFiles';
import { NavigatorType } from '../types/LocalTypes';
import Upload from '../views/Upload';

const Tab = createBottomTabNavigator<NavigatorType>();
const Stack = createNativeStackNavigator<NavigatorType>();

const TabScreen = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName = '';

          if (route.name === 'All Media') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'My Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'Upload') {
            iconName = focused ? 'cloud-upload' : 'cloud-upload-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'green',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen
        name="All Media"
        component={Home}
        //options={{headerShown: false}}
      />
      <Tab.Screen name="My Profile" component={Profile} />
      <Tab.Screen name="Upload" component={Upload} />
    </Tab.Navigator>
  );
};

const StackScreen = () => {
  const {user} = useUserContext();

  return (
    <Stack.Navigator>
      {user ? (
        <>
          <Stack.Screen
            name="Back"
            component={TabScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen name="Single" component={Single} />
          <Stack.Screen name="My Files" component={MyFiles} />
        </>
      ) : (
        <Stack.Screen name="My Media App" component={Login} />
      )}
    </Stack.Navigator>
  );
};

const Navigator = () => {
  return (
    <NavigationContainer>
      <StackScreen />
    </NavigationContainer>
  );
};

export default Navigator;
