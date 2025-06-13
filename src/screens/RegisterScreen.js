import React, { useState, useContext } from 'react';
import { Alert } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { AuthForm } from '../components/AuthForm';
import AuthViewModel from '../viewmodels/AuthViewModel';

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const { setUser, setMoods, setIsLoading } = useContext(AuthContext);

  const handleRegister = async () => {
    setIsLoading(true);
    if (!name || !email || !password) {
      Alert.alert('Ошибка', 'Заполните все поля');
      setIsLoading(false);
      return;
    }
    const result = await AuthViewModel.register(name, email, password, setUser, setMoods);
    setIsLoading(false);
    if (result.success) {
      navigation.replace('Main');
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