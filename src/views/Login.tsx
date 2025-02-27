import {useEffect, useState} from 'react';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import {Button} from '@rneui/base';
import { useUserContext } from '../hooks/contextHooks';

const Login = () => {
  const [displayRegister, setDisplayRegister] = useState(false);
  const {handleAutoLogin} = useUserContext();

  const toggleRegister = () => {
    setDisplayRegister(!displayRegister);
  };

  useEffect(() => {
    handleAutoLogin();
  }, []);

  return (
    <>
      {displayRegister ? <RegisterForm setDisplayRegister={setDisplayRegister} /> : <LoginForm />}
      <Button onPress={toggleRegister}>
        or {displayRegister ? 'login' : 'register'}?
      </Button>
    </>
  );
};

export default Login;
