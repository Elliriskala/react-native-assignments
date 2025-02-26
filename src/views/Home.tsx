import {FlatList, View} from 'react-native';
import {useMedia} from '../hooks/apiHooks';
import MediaListItem from '../components/MediaListItem';
import {NavigationProp, ParamListBase} from '@react-navigation/native';

const Home = ({navigation}: {navigation: NavigationProp<ParamListBase>}) => {
  const {mediaArray} = useMedia();

  return (
    <View>
      <FlatList
        data={mediaArray}
        renderItem={({item}) => (
          <MediaListItem item={item} navigation={navigation} />
        )}
      />
    </View>
  );
};

export default Home;
