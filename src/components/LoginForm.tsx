import {Controller, useForm} from 'react-hook-form';
import {useUserContext} from '../hooks/contextHooks';
import {Credentials} from '../types/LocalTypes';
import {Button, Card} from '@rneui/base';
import {Input} from '@rneui/themed';

const LoginForm = () => {
  const {handleLogin} = useUserContext();
  const initValues: Credentials = {username: '', password: ''};
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: initValues,
  });

  const doLogin = async (inputs: Credentials) => {
    handleLogin(inputs);
  };

  return (
    <Card>
      <Controller
        control={control}
        rules={{
          minLength: 3,
          maxLength: 50,
          required: {value: true, message: 'is required'},
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
          minLength: 5,
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
      <Button title="Login" onPress={handleSubmit(doLogin)} />
    </Card>
  );
};

export default LoginForm;
