import {Like, MediaItemWithOwner} from 'hybrid-types/DBTypes';
import {View} from 'react-native';
import {useEffect, useReducer} from 'react';
import {useLike} from '../hooks/apiHooks';
import {Button, ListItem, Text} from '@rneui/base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';

type LikeState = {
  count: number;
  userLike: Like | null;
};

type LikeAction = {
  type: 'setLikeCount' | 'like';
  like?: Like | null;
  count?: number;
};

const likeInitialState: LikeState = {
  count: 0,
  userLike: null,
};

const likeReducer = (state: LikeState, action: LikeAction): LikeState => {
  switch (action.type) {
    case 'setLikeCount':
      return {...state, count: action.count ?? 0};
    case 'like':
      return {...state, userLike: action.like ?? null};
    default:
      return state;
  }
};

const Likes = ({item}: {item: MediaItemWithOwner}) => {
  const [likeState, likeDispatch] = useReducer(likeReducer, likeInitialState);
  const {postLike, deleteLike, getCountByMediaId, getUserLike} = useLike();

  // get user like
  const getLikes = async () => {
    const token = await AsyncStorage.getItem('token');
    if (!item || !token) {
      return;
    }
    try {
      const userLike = await getUserLike(item.media_id, token);
      likeDispatch({type: 'like', like: userLike});

    } catch (e) {
      likeDispatch({type: 'like', like: null});
      console.error('get user like error', (e as Error).message);
    }
  };

  // get like count
  const getLikeCount = async () => {
    try {
      const countResponse = await getCountByMediaId(item.media_id);
      likeDispatch({type: 'setLikeCount', count: countResponse.count});
    } catch (error) {
      console.error('get user like error', (error as Error).message);
    }
  };

  useEffect(() => {
    getLikes();
    getLikeCount();
  }, [item]);

  const handleLike = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!item || !token) {
        return;
      }
      if (likeState.userLike) {
        await deleteLike(likeState.userLike.like_id, token);
        likeDispatch({type: 'like', like: null});
        likeDispatch({type: 'setLikeCount', count: likeState.count - 1});
      } else {
        await postLike(item.media_id, token);
        getLikes();
        getLikeCount();
      }
    } catch (e) {
      console.log('like error', (e as Error).message);
    }
  };

  return (
    <>
      <View>
        <ListItem>
          <Ionicons name="heart" size={20} />
          <Text>{likeState.count} likes</Text>
        </ListItem>
        <Button
          onPress={handleLike}
          title={likeState.userLike ? 'Unlike' : 'Like'}
          icon={
            <Ionicons
              name={likeState.userLike ? 'heart' : 'heart-outline'}
              size={20}
              color="white"
            />
          }
        />
      </View>
    </>
  );
};

export default Likes;
