import {Button, Card, ListItem} from '@rneui/base';
import {Text, View} from 'react-native';
import {useUserContext} from '../hooks/contextHooks';

const Profile = () => {
  const {user, handleLogout} = useUserContext();
  return (
    <Card>
      <Card.Title>Profile</Card.Title>
      <ListItem>
        <Text>Username: {user ? user.username : ''}</Text>
      </ListItem>
      <ListItem>
        <Text>Email: {user ? user.email : ''}</Text>
      </ListItem>
      <Button onPress={handleLogout}>Logout</Button>
    </Card>
  );
};

export default Profile;
