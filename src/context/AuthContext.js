import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [moods, setMoods] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Загрузка данных при старте
  useEffect(() => {
    const loadData = async () => {
      try {
        const userData = await AsyncStorage.getItem('currentUser');
        const moodsData = await AsyncStorage.getItem('userMoods');
        if (userData) setUser(JSON.parse(userData));
        if (moodsData) setMoods(JSON.parse(moodsData));
      } catch (e) {
        console.error('Ошибка загрузки данных:', e);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // Регистрация
  const register = async (name, email, password) => {
    try {
      const usersData = await AsyncStorage.getItem('users');
      const users = usersData ? JSON.parse(usersData) : [];
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!re.test(String(email).toLowerCase())) {
        return { success: false, error: 'Некорректный формат email' };
      }
      if (users.some(u => u.email === email)) {
        return { success: false, error: 'Email уже зарегистрирован' };
      }

      const newUser = { id: Date.now(), name, email, password };
      const updatedUsers = [...users, newUser];
      await AsyncStorage.setItem('users', JSON.stringify(updatedUsers));
      await AsyncStorage.setItem('currentUser', JSON.stringify(newUser));
      setUser(newUser);
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Ошибка регистрации' };
    }
  };

  // Вход
  const login = async (email, password, rememberMe) => {
    try {
      const usersData = await AsyncStorage.getItem('users');
      const users = usersData ? JSON.parse(usersData) : [];
      const foundUser = users.find(u => u.email === email && u.password === password);
      if (!foundUser) {
        return { success: false, error: 'Неверные данные' };
      }
      await AsyncStorage.setItem('currentUser', JSON.stringify(foundUser));
      await AsyncStorage.setItem('rememberMe', rememberMe.toString());
      setUser(foundUser);
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Ошибка входа' };
    }
  };

  // Выход
  const logout = async () => {
    try {
      await AsyncStorage.removeItem('currentUser');
      await AsyncStorage.setItem('rememberMe', 'false');
      setUser(null);
    } catch (e) {
      console.error('Ошибка выхода:', e);
    }
  };

  // Добавление настроения
  const addMood = async (newMood) => {
    try {
      const moodWithUser = { ...newMood, userId: user.id };
      const updatedMoods = [...moods, moodWithUser];
      setMoods(updatedMoods);
      await AsyncStorage.setItem('userMoods', JSON.stringify(updatedMoods));
    } catch (e) {
      console.error('Ошибка сохранения настроения:', e);
    }
  };

  // Экспорт данных в JSON
  const exportData = async () => {
    try {
      const moodsData = await AsyncStorage.getItem('userMoods');
      return moodsData ? JSON.parse(moodsData).filter(mood => mood.userId === user.id) : [];
    } catch (e) {
      console.error('Ошибка экспорта:', e);
      return [];
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        moods,
        isLoading,
        register,
        login,
        logout,
        addMood,
        exportData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};