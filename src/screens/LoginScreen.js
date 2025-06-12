import React, { useState, useContext } from 'react';
import { Alert } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { AuthForm } from '../components/AuthForm';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const { login } = useContext(AuthContext); // Убрали isLoading, так как он не используется здесь

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Ошибка', 'Заполните все поля');
      return;
    }
    const result = await login(email, password, rememberMe);
    if (result.success) {
      navigation.replace('Main'); // Переход на экран с табами
    } else {
      Alert.alert('Ошибка', result.error);
    }
  };

  return (
    <AuthForm
      navigation={navigation}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      isLoading={false} // Теперь isLoading управляется в AuthProvider
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