import {FlatList, View} from 'react-native';
import MediaListItem from '../components/MediaListItem';
import {useMedia} from '../hooks/apiHooks';
import {NavigationProp, ParamListBase} from '@react-navigation/native';
import {useUpdateContext, useUserContext} from '../hooks/contextHooks';

const MyFiles = ({navigation}: {navigation: NavigationProp<ParamListBase>}) => {
  const {user} = useUserContext();
  const {mediaArray, loading} = useMedia(user?.user_id);
  const {triggerUpdate} = useUpdateContext();
  console.log('mediaArray', mediaArray);
  return (
    <View>
      <FlatList
        data={mediaArray}
        renderItem={({item}) => (
          <MediaListItem item={item} navigation={navigation} />
        )}
        onRefresh={triggerUpdate}
        refreshing={loading}
      />
    </View>
  );
};

export default MyFiles;
