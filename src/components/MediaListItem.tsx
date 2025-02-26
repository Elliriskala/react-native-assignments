import {MediaItemWithOwner} from 'hybrid-types/DBTypes';
import {Image, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {NavigationProp, ParamListBase} from '@react-navigation/native';
import {Card, Icon, ListItem} from '@rneui/base';

type MediaListItemProps = {
  item: MediaItemWithOwner;
  navigation: NavigationProp<ParamListBase>;
};

const MediaListItem = ({item, navigation}: MediaListItemProps) => {
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('Single', {item});
      }}
    >
      <Card>
        <Card.Title>{item.title}</Card.Title>
        <Image
          style={styles.image}
          source={{
            uri:
              item.thumbnail ||
              (item.screenshots && item.screenshots[2]) ||
              undefined,
          }}
        />
        <ListItem>
          <Text>{item.description}</Text>
        </ListItem>
        <ListItem>
          <Icon name="today" />
          <Text>{new Date(item.created_at).toLocaleString('fi-FI')}</Text>
        </ListItem>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  image: {
    height: 300,
  },
});

export default MediaListItem;
