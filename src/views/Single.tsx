import {MediaItemWithOwner} from 'hybrid-types/DBTypes';
import {Alert, Image, ScrollView, StyleSheet, Text} from 'react-native';
import {Video} from 'expo-av';
import {Button, Card, Icon, ListItem} from '@rneui/base';
import Likes from '../components/Likes';
import Comments from '../components/Comments';
import {useMedia} from '../hooks/apiHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useUpdateContext, useUserContext} from '../hooks/contextHooks';
import {useNavigation} from '@react-navigation/native';

const Single = ({route}: any) => {
  const item: MediaItemWithOwner = route.params.item;
  const {user} = useUserContext();
  const {triggerUpdate} = useUpdateContext();
  const {deleteMedia} = useMedia();
  const navigation = useNavigation();

  const handleDelete = async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      if (!token) {
        return;
      }

      const deleteResponse = await deleteMedia(item.media_id, token);
      triggerUpdate();
      Alert.alert('Success', deleteResponse.message);
      navigation.goBack();
    } catch {}
  };

  return (
    <ScrollView>
      <Card>
        <Card.Title>{item.title}</Card.Title>
        {item.media_type.includes('image') ? (
          <Image style={styles.image} src={item.filename} />
        ) : (
          <Video
            style={styles.image}
            source={{uri: item.filename}}
            useNativeControls
          />
        )}
        <ListItem>
          <Icon name="today" />
          <Text>{new Date(item.created_at).toLocaleString('fi-FI')}</Text>
        </ListItem>
        <ListItem>
          <Text>{item.description}</Text>
        </ListItem>
        <ListItem>
          <Icon name="person" />
          <Text>{item.username}</Text>
        </ListItem>
        <ListItem>
          <Icon name="description" />
          <Text>{item.media_type}</Text>
        </ListItem>
        <ListItem>
          <Icon name="image" />
          <Text>{Math.round(item.filesize / 1024)} kB</Text>
        </ListItem>
        <Likes item={item} />
        <Comments item={item} />
        {user?.user_id === item.user_id && (
          <ListItem>
            <Button title="Delete" color="error" onPress={handleDelete} />
          </ListItem>
        )}
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  image: {
    height: 400,
  },
});

export default Single;
