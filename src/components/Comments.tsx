import {MediaItemWithOwner} from 'hybrid-types/DBTypes';
import {useUserContext} from '../hooks/contextHooks';
import {useCommentStore} from '../store';
import {useEffect} from 'react';
import {useComment} from '../hooks/apiHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Controller, useForm} from 'react-hook-form';
import {Button, Card, Input, ListItem, Text} from '@rneui/base';
import {StyleSheet, View} from 'react-native';

const Comments = ({item}: {item: MediaItemWithOwner}) => {
  const user = useUserContext();
  const {comments, setComments} = useCommentStore();
  const {getCommentsByMediaId} = useComment();
  const {postComment} = useComment();
  const {control, handleSubmit} = useForm({
    defaultValues: {comment_text: ''},
  });

  const doComment = async (inputs: {comment_text: string}) => {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      return;
    }
    await postComment(inputs.comment_text, item.media_id, token);
    getComments();
  };

  const getComments = async () => {
    try {
      const comments = await getCommentsByMediaId(item.media_id);
      setComments(comments);
    } catch (error) {
      setComments([]);
      console.error((error as Error).message);
    }
  };

  useEffect(() => {
    getComments();
  }, []);

  return (
    <>
      {user && (
        <View>
          <Controller
            control={control}
            rules={{
              maxLength: {
                value: 50,
                message: 'comment too long',
              },
            }}
            render={({field: {onChange, value}}) => (
              <Input
                placeholder="Comment"
                onChangeText={onChange}
                value={value}
                inputContainerStyle={styles.input}
              />
            )}
            name="comment_text"
          />
          <Button title="Comment" onPress={handleSubmit(doComment)} />
        </View>
      )}
      {comments.length > 0 && (
        <>
        <Card>

          <Text style={styles.commentsTitle}>Comments</Text>
          {comments.map((comment) => (
            <ListItem key={comment.comment_id}>
              <ListItem.Content>
                <ListItem.Title>{comment.username}</ListItem.Title>
                <Text>{comment.comment_text}</Text>
                <ListItem.Subtitle>
                  ({new Date(comment.created_at || '').toLocaleString('fi-FI')})
                </ListItem.Subtitle>
              </ListItem.Content>
            </ListItem>
          ))}
        </Card>
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({

  input: {
    marginTop: 20,
    borderBottomWidth: 0,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    paddingHorizontal: 10,
  },

  commentsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default Comments;
