import React, { useState, useContext } from 'react';
import { Alert } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { AuthForm } from '../components/AuthForm';

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register } = useContext(AuthContext); // Убрали isLoading
  const [rememberMe, setRememberMe] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert('Ошибка', 'Заполните все поля');
      return;
    }
    const result = await register(name, email, password);
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
      name={name}
      setName={setName}
      isLoading={false}
      handleSubmit={handleRegister}
      submitText="Зарегистрироваться"
      linkText="Уже есть аккаунт? Войти"
      linkNavigateTo="Login"
      isRegister={true}
      rememberMe={rememberMe}
      setRememberMe={setRememberMe}
    />
  );
};

export default RegisterScreen;