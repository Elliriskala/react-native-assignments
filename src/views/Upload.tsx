import {Controller, useForm} from 'react-hook-form';
import {Button, Card, Image} from '@rneui/base';
import {Input} from '@rneui/themed';
import {Alert, StyleSheet} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import {useEffect, useState} from 'react';
import VideoPlayer from '../components/VideoPlayer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFile, useMedia} from '../hooks/apiHooks';
import {useNavigation} from '@react-navigation/native';
import {NavigatorType} from '../types/LocalTypes';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useUpdateContext} from '../hooks/contextHooks';

type UploadInputs = {
  title: string;
  description: string;
};

const Upload = () => {
  const {postExpoFile, loading} = useFile();
  const {postMedia} = useMedia();
  const navigation = useNavigation<NativeStackNavigationProp<NavigatorType>>();
  const {triggerUpdate} = useUpdateContext();
  const [image, setImage] = useState<ImagePicker.ImagePickerResult | null>(
    null,
  );
  const initValues: UploadInputs = {title: '', description: ''};
  const {
    control,
    handleSubmit,
    formState: {errors, isValid},
    reset,
  } = useForm({
    defaultValues: initValues,
  });

  const resetForm = () => {
    setImage(null);
    reset(initValues);
  };

  const doUpload = async (inputs: UploadInputs) => {
    if (!image || !image.assets) {
      Alert.alert('Please choose a file.');
      return;
    }

    const token = await AsyncStorage.getItem('token');
    if (!token) {
      Alert.alert('Error', 'No token found, please login.');
      return;
    }

    const fileResponse = await postExpoFile(image.assets[0].uri, token);
    if (!fileResponse) {
      Alert.alert('Upload failed');
      return;
    }

    const mediaResponse = await postMedia(fileResponse, inputs, token);
    if (!mediaResponse) {
      Alert.alert('Upload failed');
      return;
    }

    reset(initValues);

    triggerUpdate();
    Alert.alert('Upload successful', mediaResponse.message);
    navigation.navigate('All Media');
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.4,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      resetForm();
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <Card>
      <Controller
        control={control}
        rules={{
          required: {value: true, message: 'is required'},
          maxLength: {value: 25, message: 'maximum 25 characters'},
          minLength: {value: 3, message: 'minimum 3 characters'},
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <Input
            placeholder="Title"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            autoCapitalize="none"
            errorMessage={errors.title?.message}
          />
        )}
        name="title"
      />

      <Controller
        control={control}
        rules={{
          maxLength: {value: 100, message: 'maximum 100 characters'},
          required: false,
          minLength: {value: 5, message: 'minimum 5 characters'},
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <Input
            placeholder="description"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            errorMessage={errors.description?.message}
          />
        )}
        name="description"
      />
      {image?.assets && image.assets[0].type === 'video' ? (
        <VideoPlayer videoFile={image.assets[0].uri} style={styles.image} />
      ) : (
        <Image
          source={{
            uri:
              image?.assets![0].uri ||
              'https://placehol.co/500x200@2x/gray/white/png?text=Choose+File',
          }}
          style={styles.image}
          onPress={pickImage}
        />
      )}
      <Button
        title="Upload"
        onPress={handleSubmit(doUpload)}
        loading={loading}
        disabled={!isValid || image === null || loading}
      />
      <Button title="Reset" color="warning" onPress={resetForm} />
    </Card>
  );
};

const styles = StyleSheet.create({
  image: {
    height: 200,
  },
});

export default Upload;
