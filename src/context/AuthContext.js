import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    const loadUser = async () => {
      try {
        const shouldRemember = await AsyncStorage.getItem('rememberMe');
        if (shouldRemember === 'true') {
          const currentUser = await AsyncStorage.getItem('currentUser');
          if (currentUser) {
            setUser(JSON.parse(currentUser));
            // Автоматический вход - перенаправление будет в HomeScreen
          }
        }
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
  }, []);

  const register = async (name, email, password) => {
    try {
      // Проверяем существование пользователя
      const usersData = await AsyncStorage.getItem('users');
      const users = usersData ? JSON.parse(usersData) : [];
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!re.test(String(email).toLowerCase())) {
        return { success: false, error: 'Некорректный формат email' }};

      if (users.some(u => u.email === email)) {
        return { success: false, error: 'Email уже зарегистрирован' };
      }

      const newUser = { id: Date.now(), name, email, password };
      const updatedUsers = [...users, newUser];
      
      await AsyncStorage.setItem('users', JSON.stringify(updatedUsers));
      await AsyncStorage.setItem('currentUser', JSON.stringify(newUser));
      
      setUser(newUser);
    //   navigation.navigate('Home'); 
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Ошибка регистрации' };
    }
  };

  const login = async (email, password, rememberMe = true) => {
    try {
      const usersData = await AsyncStorage.getItem('users');
      const users = usersData ? JSON.parse(usersData) : [];
      
      const foundUser = users.find(u => 
        u.email === email && u.password === password
      );
      
      if (foundUser) {
        await AsyncStorage.setItem('currentUser', JSON.stringify(foundUser));
        await AsyncStorage.setItem('rememberMe', rememberMe.toString());
        setUser(foundUser);
        return { success: true };
      }
      return { success: false, error: 'Неверные данные' };
    } catch (error) {
      return { success: false, error: 'Ошибка входа' };
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('currentUser');
    await AsyncStorage.setItem('rememberMe', 'false'); // Отключаем автоматический вход
    setUser(null);
  };

  const getAllUsers = async () => {
    const usersData = await AsyncStorage.getItem('users');
    return usersData ? JSON.parse(usersData) : [];
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        register, 
        login, 
        logout, 
        getAllUsers 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};