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
import { authStyles } from '../styles/authStyles';

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
      style={authStyles.container}
    >
      <View style={authStyles.logoContainer}>
        <Image source={require('../assets/logo.png')} style={authStyles.logo} />
      </View>

      {isRegister && (
        <TextInput
          style={authStyles.input}
          placeholder="Имя"
          placeholderTextColor="#aaa"
          value={name}
          onChangeText={setName}
        />
      )}

      <TextInput
        style={authStyles.input}
        placeholder="Email"
        placeholderTextColor="#aaa"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={authStyles.input}
        placeholder="Пароль"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {!isRegister && (
        <View style={authStyles.rememberMeContainer}>
          <TouchableOpacity onPress={() => setRememberMe(!rememberMe)}>
            <View style={[
              authStyles.checkbox,
              rememberMe && authStyles.checkedCircle
            ]} />
          </TouchableOpacity>
          <Text style={authStyles.rememberMeText}>Запомнить меня</Text>
        </View>
      )}

      {isLoading ? (
        <ActivityIndicator size="large" />
      ) : (
        <TouchableOpacity style={authStyles.button} onPress={handleSubmit}>
          <Text style={authStyles.buttonText}>{submitText}</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        onPress={() => {
          Keyboard.dismiss();
          setTimeout(() => navigation.navigate(linkNavigateTo), 100);
        }}
        style={authStyles.linkContainer}
      >
        <Text style={authStyles.link}>{linkText}</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};