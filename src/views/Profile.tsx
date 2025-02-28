import {Button, Card, Icon, ListItem} from '@rneui/base';
import {Text} from 'react-native';
import {useUserContext} from '../hooks/contextHooks';
import { NavigationProp, ParamListBase } from '@react-navigation/native';

const Profile = ({navigation}: {navigation: NavigationProp<ParamListBase>}) => {
  const {user, handleLogout} = useUserContext();
  return (
    <Card>
      <Card.Title>Profile</Card.Title>
      <ListItem>
        <Icon name="person" />
        <Text>{user ? user.username : ''}</Text>
      </ListItem>
      <ListItem>
        <Icon name="email" />
        <Text>{user ? user.email : ''}</Text>
      </ListItem>
      <ListItem>
        <Icon name="today" />
        <Text>
          Member since: {user && new Date(user.created_at).toLocaleString('fi-FI')}
        </Text>
      </ListItem>
      <Button onPress={() => {navigation.navigate('MyFiles')}}>My files</Button>
      <Button onPress={handleLogout}>Logout</Button>
    </Card>
  );
};

export default Profile;
