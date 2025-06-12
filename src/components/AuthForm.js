import React from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { StyleSheet } from 'react-native';

export const AuthForm = ({
  navigation,
  email,
  setEmail,
  password,
  setPassword,
  name,
  setName,
  isLoading,
  handleSubmit,
  submitText,
  linkText,
  linkNavigateTo,
  isRegister = false,
  rememberMe,
  setRememberMe,
}) => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.formContainer}>
        {/* Логотип */}
        <View style={styles.logoContainer}>
          <Image source={require('../assets/logo.png')} style={styles.logo} />
        </View>

        {/* Поле имени (для регистрации) */}
        {isRegister && (
          <TextInput
            style={styles.input}
            placeholder="Имя"
            placeholderTextColor="#aaa"
            value={name}
            onChangeText={setName}
          />
        )}

        {/* Поле email */}
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#aaa"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        {/* Поле пароля */}
        <TextInput
          style={styles.input}
          placeholder="Пароль"
          placeholderTextColor="#aaa"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {/* Чекбокс "Запомнить меня" (для входа) */}
        {!isRegister && (
          <View style={styles.rememberMeContainer}>
            <TouchableOpacity onPress={() => setRememberMe(!rememberMe)}>
              <View style={[
                styles.checkbox,
                rememberMe && styles.checkedCircle,
              ]} />
            </TouchableOpacity>
            <Text style={styles.rememberMeText}>Запомнить меня</Text>
          </View>
        )}

        {/* Кнопка submit */}
        {isLoading ? (
          <ActivityIndicator size="large" color="#5770C5" />
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>{submitText}</Text>
          </TouchableOpacity>
        )}

        {/* Ссылка на другой экран */}
        <TouchableOpacity
          onPress={() => {
            Keyboard.dismiss();
            setTimeout(() => navigation.navigate(linkNavigateTo), 100);
          }}
          style={styles.linkContainer}
        >
          <Text style={styles.link}>{linkText}</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  formContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logoContainer: {
    marginBottom: 30,
    alignItems: 'center',
  },
  logo: {
    width: 600, 
    resizeMode: 'contain',
  },
  input: {
    width: '80%',
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
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  linkContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  link: {
    color: '#5770C5',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    width: '80%',
    justifyContent: 'center', // Центрируем чекбокс и текст
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#5770C5',
    borderRadius: 10,
    marginRight: 10,
  },
  checkedCircle: {
    backgroundColor: '#5770C5',
  },
  rememberMeText: {
    color: '#333',
  },
});

export default AuthForm;