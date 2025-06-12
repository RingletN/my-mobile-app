import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [moods, setMoods] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Инициализация тестовых данных для нового пользователя
  const initializeTestData = async (userId) => {
    try {
      await AsyncStorage.clear();
      
      const moodsData = await AsyncStorage.getItem('userMoods');
      const existingMoods = moodsData ? JSON.parse(moodsData) : [];
      const userMoods = existingMoods.filter(m => m.userId === userId);

      if (userMoods.length === 0) {
        const testMoods = [
          { id: Date.now() - 86400000 * 2, emoji: '😊', note: 'Хороший день!', date: '11.06.2025', userId },
          { id: Date.now() - 86400000 * 1, emoji: '😐', note: 'Средний день', date: '12.06.2025', userId },
          { id: Date.now(), emoji: '😢', note: 'Плохое настроение', date: '13.06.2025', userId },
        ];
        const updatedMoods = [...existingMoods, ...testMoods];
        await AsyncStorage.setItem('userMoods', JSON.stringify(updatedMoods));
        console.log('Инициализированы тестовые данные для userId:', userId, updatedMoods);
        setMoods(testMoods); // Устанавливаем только тестовые данные для текущего пользователя
      } else {
        console.log('Данные для пользователя уже существуют:', userMoods);
        setMoods(userMoods); // Устанавливаем существующие данные
      }
    } catch (e) {
      console.error('Ошибка инициализации тестовых данных:', e);
    }
  };

  // Загрузка данных при старте
  useEffect(() => {
    const loadData = async () => {
      try {
        const userData = await AsyncStorage.getItem('currentUser');
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          // Загружаем настроения для пользователя
          const moodsData = await AsyncStorage.getItem('userMoods');
          if (moodsData) {
            const parsedMoods = JSON.parse(moodsData);
            const userMoods = parsedMoods.filter(m => m.userId === parsedUser.id);
            setMoods(userMoods);
          }
        }
      } catch (e) {
        console.error('Ошибка загрузки данных:', e);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []); // Пустая зависимость, чтобы выполнилось один раз при монтировании

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
      await initializeTestData(newUser.id); // Инициализируем тестовые данные для нового пользователя
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
      // Загружаем настроения для вошедшего пользователя
      const moodsData = await AsyncStorage.getItem('userMoods');
      if (moodsData) {
        const parsedMoods = JSON.parse(moodsData);
        const userMoods = parsedMoods.filter(m => m.userId === foundUser.id);
        setMoods(userMoods);
      }
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
      setMoods([]); // Очищаем настроения при выходе
    } catch (e) {
      console.error('Ошибка выхода:', e);
    }
  };

  // Добавление настроения
  const addMood = async (newMood) => {
    try {
      const moodWithUser = { ...newMood, userId: user?.id };
      const moodsData = await AsyncStorage.getItem('userMoods');
      const existingMoods = moodsData ? JSON.parse(moodsData) : [];
      const updatedMoods = [...existingMoods, moodWithUser];
      await AsyncStorage.setItem('userMoods', JSON.stringify(updatedMoods));
      setMoods(prevMoods => [...prevMoods, moodWithUser]); // Обновляем локальное состояние
    } catch (e) {
      console.error('Ошибка сохранения настроения:', e);
    }
  };

  // Экспорт данных в JSON
  const exportData = async () => {
    try {
      const moodsData = await AsyncStorage.getItem('userMoods');
      const userMoods = moodsData ? JSON.parse(moodsData).filter(mood => mood.userId === user?.id) : [];
      console.log('Экспортируемые данные:', userMoods);
      return userMoods;
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