import {Button, Card, Input} from '@rneui/base';
import {Controller, useForm} from 'react-hook-form';
import {useUser} from '../hooks/apiHooks';
import {RegisterCredentials} from '../types/LocalTypes';
import {Alert} from 'react-native';
import {Dispatch} from 'react';

const RegisterForm = ({
  setDisplayRegister,
}: {
  setDisplayRegister: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const {postRegister, getUsernameAvailable, getEmailAvailable} = useUser();
  const initValues: {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
  } = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  const doRegister = async (inputs: {
    username: string;
    email: string;
    password: string;
    confirmPassword?: string;
  }) => {
    try {
      delete inputs.confirmPassword;
      const registerResult = await postRegister(inputs as RegisterCredentials);
      console.log('doRegister result', registerResult);
      Alert.alert('User created');
      setDisplayRegister(false);
    } catch (error) {
      console.error((error as Error).message);
      Alert.alert('User not created', (error as Error).message);
    }
  };

  const {
    control,
    getValues,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: initValues,
  });

  return (
    <Card>
      <Card.Title>Register</Card.Title>
      <Controller
        control={control}
        rules={{
          pattern: {
            value: /^[a-zA-Z0-9._-]+$/,
            message: 'not a valid username',
          },
          minLength: {value: 3, message: 'minimum length is 3'},
          maxLength: 50,
          required: {value: true, message: 'is required'},
          validate: async (value) => {
            try {
              const {available} = await getUsernameAvailable(value);
              console.log('username available?: ', available);
              return available ? true : 'username not available';
            } catch (error) {
              console.error((error as Error).message);
            }
          },
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <Input
            placeholder="Username"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            autoCapitalize="none"
            errorMessage={errors.username?.message}
          />
        )}
        name="username"
      />
      <Controller
        control={control}
        rules={{
          pattern: {
            value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
            message: 'not a valid email',
          },
          minLength: {value: 3, message: 'minimum length is 3'},
          maxLength: 50,
          required: {value: true, message: 'is required'},
          validate: async (value) => {
            try {
              const {available} = await getEmailAvailable(value);
              console.log('email available?: ', available);
              return available ? true : 'email not available';
            } catch (error) {
              console.error((error as Error).message);
            }
          },
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <Input
            placeholder="Email"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            errorMessage={errors.email?.message}
          />
        )}
        name="email"
      />
      <Controller
        control={control}
        rules={{
          minLength: {value: 5, message: 'minimum length is 5'},
          maxLength: 50,
          required: {value: true, message: 'is required'},
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <Input
            placeholder="password"
            secureTextEntry
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            errorMessage={errors.password?.message}
          />
        )}
        name="password"
      />

      <Controller
        control={control}
        rules={{
          minLength: {value: 5, message: 'minimum length is 5'},
          maxLength: 50,
          required: {value: true, message: 'is required'},
          validate: (value) => {
            return value === getValues().password
              ? true
              : 'passwords do not match';
          },
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <Input
            placeholder="confirm password"
            secureTextEntry
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            errorMessage={errors.confirmPassword?.message}
          />
        )}
        name="confirmPassword"
      />
      <Button title="Register" onPress={handleSubmit(doRegister)} />
    </Card>
  );
};

export default RegisterForm;
