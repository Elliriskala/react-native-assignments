import {MediaItemWithOwner} from 'hybrid-types/DBTypes';
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import {NavigationProp, ParamListBase} from '@react-navigation/native';

type MediaListItemProps = {
  item: MediaItemWithOwner;
  navigation: NavigationProp<ParamListBase>;
};

const MediaListItem = ({item, navigation}: MediaListItemProps) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => {
        console.log('Item pressed:', item.title);
        navigation.navigate('Single', {item});
      }}
    >
      <Text style={styles.titleText}>{item.title}</Text>
      <Image
        style={styles.image}
        source={{
          uri:
            item.thumbnail ||
            (item.screenshots && item.screenshots[2]) ||
            undefined,
        }}
      />
      <Text style={styles.text}>{item.description}</Text>
      <Text style={styles.date}>
        Created at: {new Date(item.created_at).toLocaleString('fi-FI')}
      </Text>
    </TouchableOpacity>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 30 : 0,
    backgroundColor: '#B0C4DE',
    margin: 10,
    borderWidth: 1,
    borderColor: 'purple',
    borderRadius: 10,
  },
  image: {
    height: 300,
  },
  titleText: {
    padding: 10,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  text: {
    padding: 10,
    fontSize: 16,
    fontWeight: '300',
  },
  date: {
    padding: 10,
    marginTop: 5,
    fontSize: 14,
    fontWeight: '200',
    textAlign: 'right',
    borderTopWidth: 1,
    borderTopColor: 'purple',
  }
});

export default MediaListItem;
