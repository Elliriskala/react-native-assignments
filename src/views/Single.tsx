import {MediaItemWithOwner} from 'hybrid-types/DBTypes';
import {Image, Platform, StyleSheet, Text, View} from 'react-native';
import {Video} from 'expo-av';

const Single = ({route}: any) => {
  const item: MediaItemWithOwner = route.params.item;
  console.log(item.filename);

  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>{item.title}</Text>
      {item.media_type.includes('image') ? (
        <Image style={styles.image} src={item.filename} />
      ) : (
        <Video
        style={styles.image}
        source={{uri: item.filename}}
        useNativeControls
        />
      )}
      <Text style={styles.text}>Owner: {item.username}</Text>
      <Text style={styles.mediatype}>{item.media_type}</Text>
      <Text style={styles.text}>{item.description}</Text>
      <Text style={styles.date}>
        Date created: {new Date(item.created_at).toLocaleString('fi-FI')}
      </Text>
    </View>
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
    position: 'relative',
  },
  image: {
    height: 300,
  },
  titleText: {
    padding: 10,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'purple',
  },
  text: {
    padding: 10,
    fontSize: 16,
    fontWeight: '300',
  },
  mediatype: {
    paddingLeft: 10,
    paddingBottom: 10,
    marginBottom: 5,
    fontSize: 16,
    fontWeight: '200',
    borderBottomWidth: 1,
    borderBottomColor: 'purple',
  },
  date: {
    padding: 10,
    marginTop: 20,
    fontSize: 14,
    fontWeight: '200',
    textAlign: 'right',
    borderTopWidth: 1,
    borderTopColor: 'purple',
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: '100%',
  },
});

export default Single;
