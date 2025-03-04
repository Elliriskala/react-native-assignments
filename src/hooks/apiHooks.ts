import {
  Comment,
  Like,
  MediaItem,
  MediaItemWithOwner,
  UserWithNoPassword,
} from 'hybrid-types/DBTypes';
import {useEffect, useState} from 'react';
import {fetchData} from '../lib/functions';
import {Credentials, RegisterCredentials} from '../types/LocalTypes';
import {
  AvailableResponse,
  LoginResponse,
  MessageResponse,
  UploadResponse,
  UserResponse,
} from 'hybrid-types/MessageTypes';
import * as FileSystem from 'expo-file-system';

const useMedia = (id?: number) => {
  const [mediaArray, setMediaArray] = useState<MediaItemWithOwner[]>([]);
  const url = id ? '/media/byuser/' + id : '/media';

  useEffect(() => {
    const getMedia = async () => {
      try {
        const media = await fetchData<MediaItem[]>(
          process.env.EXPO_PUBLIC_MEDIA_API + url,
        );
        const mediaWithOwner: MediaItemWithOwner[] = await Promise.all(
          media.map(async (item) => {
            const owner = await fetchData<UserWithNoPassword>(
              process.env.EXPO_PUBLIC_AUTH_API + '/users/' + item.user_id,
            );

            const mediaItem: MediaItemWithOwner = {
              ...item,
              username: owner.username,
            };
            return mediaItem;
          }),
        );

        console.log(mediaWithOwner);

        mediaWithOwner.reverse();

        setMediaArray(mediaWithOwner);
      } catch (error) {
        console.error((error as Error).message);
      }
    };

    getMedia();
  }, []);

  const postMedia = async (
    file: UploadResponse,
    inputs: Record<string, string>,
    token: string,
  ) => {
    const media: Omit<
      MediaItem,
      'media_id' | 'user_id' | 'thumbnail' | 'created_at' | 'screenshots'
    > = {
      title: inputs.title,
      description: inputs.description,
      filename: file.data.filename,
      media_type: file.data.media_type,
      filesize: file.data.filesize,
    };
    console.log('posting media', media);
    // post the data to Media API and get the data as MessageResponse
    const options = {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-type': 'application/json',
      },
      body: JSON.stringify(media),
    };
    return await fetchData<MessageResponse>(
      process.env.EXPO_PUBLIC_MEDIA_API + '/media',
      options,
    );
  };

  return {mediaArray, postMedia};
};

const useFile = () => {
  const [loading, setLoading] = useState(false);

  const postExpoFile = async (
    imageUri: string,
    token: string,
  ): Promise<UploadResponse> => {
    setLoading(true);
    const fileResult = await FileSystem.uploadAsync(
      process.env.EXPO_PUBLIC_UPLOAD_API + '/upload',
      imageUri,
      {
        httpMethod: 'POST',
        uploadType: FileSystem.FileSystemUploadType.MULTIPART,
        fieldName: 'file',
        headers: {
          Authorization: 'Bearer ' + token,
        },
      },
    );
    setLoading(false);
    return fileResult.body ? JSON.parse(fileResult.body) : null;
  };

  return {postExpoFile, loading};
};

const useAuthentication = () => {
  const postLogin = async (credentials: Credentials) => {
    const options = {
      method: 'POST',
      body: JSON.stringify(credentials),
      headers: {'Content-Type': 'application/json'},
    };
    try {
      return await fetchData<LoginResponse>(
        process.env.EXPO_PUBLIC_AUTH_API + '/auth/login',
        options,
      );
    } catch (error) {
      throw new Error((error as Error).message);
    }
  };

  return {postLogin};
};

const useUser = () => {
  const getUserByToken = async (token: string) => {
    const options = {
      headers: {Authorization: 'Bearer ' + token},
    };
    try {
      return await fetchData<UserResponse>(
        process.env.EXPO_PUBLIC_AUTH_API + '/users/token',
        options,
      );
    } catch (error) {
      throw error as Error;
    }
  };

  const postRegister = async (credentials: RegisterCredentials) => {
    const options = {
      method: 'POST',
      body: JSON.stringify(credentials),
      headers: {'Content-Type': 'application/json'},
    };
    try {
      return await fetchData<UserResponse>(
        process.env.EXPO_PUBLIC_AUTH_API + '/users',
        options,
      );
    } catch (error) {
      throw new Error((error as Error).message);
    }
  };

  const getUsernameAvailable = async (username: string) => {
    return await fetchData<AvailableResponse>(
      process.env.EXPO_PUBLIC_AUTH_API + '/users/username/' + username,
    );
  };

  const getEmailAvailable = async (email: string) => {
    return await fetchData<AvailableResponse>(
      process.env.EXPO_PUBLIC_AUTH_API + '/users/email/' + email,
    );
  };

  const getUserById = async (user_id: number) => {
    return await fetchData<UserWithNoPassword>(
      process.env.EXPO_PUBLIC_AUTH_API + '/users/' + user_id,
    );
  };

  return {
    getUserByToken,
    postRegister,
    getUsernameAvailable,
    getEmailAvailable,
    getUserById,
  };
};

const useComment = () => {
  const {getUserById} = useUser();

  const postComment = async (
    comment_text: string,
    media_id: number,
    token: string,
  ) => {
    const options = {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-type': 'application/json',
      },
      body: JSON.stringify({media_id, comment_text}),
    };
    return await fetchData<MessageResponse>(
      process.env.EXPO_PUBLIC_MEDIA_API + '/comments',
      options,
    );
  };

  const getCommentsByMediaId = async (media_id: number) => {
    // Send a GET request to /comments/bymedia/:media_id to get the comments.
    const comments = await fetchData<Comment[]>(
      process.env.EXPO_PUBLIC_MEDIA_API + '/comments/bymedia/' + media_id,
    );
    // Send a GET request to auth api and add username to all comments
    const commentsWithUsername = await Promise.all<
      Comment & {username: string}
    >(
      comments.map(async (comment) => {
        const user = await getUserById(comment.user_id);
        return {...comment, username: user.username};
      }),
    );
    return commentsWithUsername;
  };

  return {postComment, getCommentsByMediaId};
};

const useLike = () => {
  const postLike = async (media_id: number, token: string) => {
    const options = {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-type': 'application/json',
      },
      body: JSON.stringify({media_id}),
    };
    return await fetchData<MessageResponse>(
      process.env.EXPO_PUBLIC_MEDIA_API + '/likes',
      options,
    );
  };

  const deleteLike = async (like_id: number, token: string) => {
    const options = {
      method: 'DELETE',
      headers: {
        Authorization: 'Bearer ' + token,
      },
    };
    return await fetchData<MessageResponse>(
      process.env.EXPO_PUBLIC_MEDIA_API + '/likes/' + like_id,
      options,
    );
  };

  const getCountByMediaId = async (media_id: number) => {
    return await fetchData<{count: number}>(
      process.env.EXPO_PUBLIC_MEDIA_API + '/likes/count/' + media_id,
    );
  };

  const getUserLike = async (media_id: number, token: string) => {
    const options = {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + token,
      },
    };
    return await fetchData<Like>(
      process.env.EXPO_PUBLIC_MEDIA_API + '/likes/bymedia/user/' + media_id,
      options,
    );
  };

  return {postLike, deleteLike, getCountByMediaId, getUserLike};
};

export {useMedia, useFile, useAuthentication, useUser, useComment, useLike};
