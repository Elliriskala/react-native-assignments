import {MediaItemWithOwner} from 'hybrid-types/DBTypes';
import {Image, ScrollView, StyleSheet, Text} from 'react-native';
import {Video} from 'expo-av';
import {Card, Icon, ListItem} from '@rneui/base';

const Single = ({route}: any) => {
  const item: MediaItemWithOwner = route.params.item;
  console.log(item.filename);

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
