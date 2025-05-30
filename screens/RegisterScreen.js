import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Image,
  Keyboard 
} from 'react-native';
import { AuthContext } from '../context/AuthContext';

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register, isLoading } = useContext(AuthContext);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert('Ошибка', 'Заполните все поля');
      return;
    }
    const result = await register(name, email, password);
    if (result.success) navigation.navigate('Home');
    else Alert.alert('Ошибка', result.error);
  };

  return (
    <KeyboardAvoidingView
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.logoContainer}>
        <Image source={require('../assets/logo.png')} style={styles.logo} />
      </View>

      <TextInput
        style={styles.input}
        placeholder="Имя"
        placeholderTextColor="#aaa"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#aaa"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Пароль"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

{isLoading ? (
  <ActivityIndicator size="large" />
) : (
  <TouchableOpacity style={styles.button} onPress={handleRegister}>
    <Text style={styles.buttonText}>Зарегистрироваться</Text>
  </TouchableOpacity>
)}

<TouchableOpacity 
  onPress={() => {
    Keyboard.dismiss();
    setTimeout(() => navigation.navigate('Login'), 100);
  }}
  style={styles.linkContainer}
>
  <Text style={styles.link}>Уже есть аккаунт? Войти</Text>
</TouchableOpacity>

    </KeyboardAvoidingView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  linkContainer: {
    marginTop: 10
  },
    logoContainer: {
    marginBottom: 30,
  },
  logo: {
    width: 600,
    height: 200,
    resizeMode: 'contain',
  },
  input: {
    width: '70%',
    height: 50,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#f9f9f9',
    color: '#333',
  },
  button: {
    backgroundColor: '#5770C5',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
    marginVertical: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  link: {
    color:  '#5770C5',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});

export default RegisterScreen;