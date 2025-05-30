import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  Alert,
  Image,
  ActivityIndicator,
  Keyboard 
} from 'react-native';
import { AuthContext } from '../context/AuthContext';



// ---------------ВЫВОД АККАУНТОВ---------------------------
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const showStorageData = async () => {
//   try {
//     // Получаем данные пользователей из AsyncStorage
//     const usersData = await AsyncStorage.getItem('users');
//     const currentUser = await AsyncStorage.getItem('currentUser');
    
//     // Форматируем данные для отображения
//     let message = '=== Все пользователи ===\n';
    
//     if (usersData) {
//       const users = JSON.parse(usersData);
//       users.forEach(user => {
//         message += `\nИмя: ${user.name}\nEmail: ${user.email}\nID: ${user.id}\n`;
//       });
//     } else {
//       message += '\nНет зарегистрированных пользователей';
//     }
    
//     message += '\n\n=== Текущий пользователь ===\n';
//     if (currentUser) {
//       const user = JSON.parse(currentUser);
//       message += `\nИмя: ${user.name}\nEmail: ${user.email}`;
//     } else {
//       message += '\nНе авторизован';
//     }
    
//     // Показываем alert
//     Alert.alert(
//       'Данные хранилища',
//       message,
//       [
//         { 
//           text: 'OK', 
//           style: 'cancel' 
//         }
//       ]
//     );
//   } catch (error) {
//     Alert.alert('Ошибка', error.message);
//   }
// };
// ---------------КОНЕЦ ВЫВОДА АККАУНТОВ---------------------------

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true); // По умолчанию true
  const { login, isLoading } = useContext(AuthContext);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Ошибка', 'Заполните все поля');
      return;
    }
    const result = await login(email, password, rememberMe);
    if (result.success) navigation.navigate('Home');
    else Alert.alert('Ошибка', result.error);
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
    
      <View style={styles.logoContainer}>
        <Image source={require('../assets/logo.png')} style={styles.logo} />
      </View>

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

      <View style={styles.rememberMeContainer}>
        <TouchableOpacity onPress={() => setRememberMe(!rememberMe)}>
          <View style={[
            styles.checkbox,
            rememberMe && styles.checkedCircle // Добавляем стиль для отмеченного состояния
          ]}>
            {rememberMe }
          </View>
        </TouchableOpacity>
        <Text style={styles.rememberMeText}>Запомнить меня</Text>
      </View>

      {isLoading ? (
  <ActivityIndicator size="large" />
) : (
  <TouchableOpacity style={styles.button} onPress={handleLogin}>
    <Text style={styles.buttonText}>Войти</Text>
  </TouchableOpacity>
)}

<TouchableOpacity 
  onPress={() => {
    Keyboard.dismiss();
    setTimeout(() => navigation.navigate('Register'), 100);
  }}
  style={styles.linkContainer}
>
  <Text style={styles.link}>Нет аккаунта? Зарегистрироваться</Text>
</TouchableOpacity>

{/* <TouchableOpacity 
  style={styles.button} 
  onPress={async () => {
    await Keyboard.dismiss();
    requestAnimationFrame(() => {
      showStorageData();
    });
  }}
>
  <Text style={styles.buttonText}>Показать хранилище</Text>
</TouchableOpacity> */}

    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#5770C5',
    borderRadius: 10,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkedCircle: {
    backgroundColor: '#5770C5', // Заливка при активации
  },
  checkmark: {
    color: 'white', // Белая галочка на синем фоне
    fontWeight: 'bold',
    fontSize: 12,
  },
  checkmark: {
    color: '#5770C5',
    fontWeight: 'bold',
  },
  rememberMeText: {
    color: '#333',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
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

export default LoginScreen;