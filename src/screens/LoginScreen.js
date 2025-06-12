import React, { useState, useContext } from 'react';
import { Alert, ActivityIndicator } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { AuthForm } from '../components/AuthForm';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const { login, isLoading } = useContext(AuthContext);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Ошибка', 'Заполните все поля');
      return;
    }
    const result = await login(email, password, rememberMe);
    if (result.success) {
      navigation.replace('Main');
    } else {
      Alert.alert('Ошибка', result.error);
    }
  };

  if (isLoading) {
    return (
      <ActivityIndicator size="large" color="#5770C5" style={{ flex: 1, justifyContent: 'center' }} />
    );
  }

  return (
    <AuthForm
      navigation={navigation}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      isLoading={isLoading}
      handleSubmit={handleLogin}
      submitText="Войти"
      linkText="Нет аккаунта? Зарегистрироваться"
      linkNavigateTo="Register"
      isRegister={false}
      rememberMe={rememberMe}
      setRememberMe={setRememberMe}
    />
  );
};

export default LoginScreen;