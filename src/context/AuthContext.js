// AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [moods, setMoods] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const initializeTestData = async (userId) => {
    try {
      const moodsData = await AsyncStorage.getItem('userMoods');
      const existingMoods = moodsData ? JSON.parse(moodsData) : [];
      const userMoods = existingMoods.filter(m => m.userId === userId);

      if (userMoods.length === 0) {
        const testMoods = [
          { id: Date.now() - 86400000 * 2, emoji: '😊', note: 'Хороший день!', date: '11.06.2025', time: '09:00', userId },
          { id: Date.now() - 86400000 * 1, emoji: '😐', note: 'Средний день', date: '12.06.2025', time: '14:30', userId },
          { id: Date.now(), emoji: '😢', note: 'Плохое настроение', date: '13.06.2025', time: '18:45', userId },
        ];
        const updatedMoods = [...existingMoods, ...testMoods];
        await AsyncStorage.setItem('userMoods', JSON.stringify(updatedMoods));
        console.log('Инициализированы тестовые данные для userId:', userId, updatedMoods);
        setMoods(testMoods);
      } else {
        console.log('Данные для пользователя уже существуют:', userMoods);
        setMoods(userMoods);
      }
    } catch (e) {
      console.error('Ошибка инициализации тестовых данных:', e);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const userData = await AsyncStorage.getItem('currentUser');
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          const moodsData = await AsyncStorage.getItem('userMoods');
          if (moodsData) {
            let parsedMoods = JSON.parse(moodsData);
            parsedMoods = parsedMoods.map(mood => ({
              ...mood,
              time: mood.time || '00:00',
            }));
            await AsyncStorage.setItem('userMoods', JSON.stringify(parsedMoods));
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
  }, []);

  useEffect(() => {
    if (user) {
      const loadUserMoods = async () => {
        try {
          const moodsData = await AsyncStorage.getItem('userMoods');
          if (moodsData) {
            const parsedMoods = JSON.parse(moodsData);
            const userMoods = parsedMoods.filter(m => m.userId === user.id);
            setMoods(userMoods);
          } else {
            setMoods([]);
          }
        } catch (e) {
          console.error('Ошибка загрузки настроений:', e);
        }
      };
      loadUserMoods();
    } else {
      setMoods([]);
    }
  }, [user]);

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
      await initializeTestData(newUser.id);
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Ошибка регистрации' };
    }
  };

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

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('currentUser');
      await AsyncStorage.setItem('rememberMe', 'false');
      setUser(null);
      setMoods([]);
    } catch (e) {
      console.error('Ошибка выхода:', e);
    }
  };

  const addMood = async (newMood) => {
    try {
      const moodWithUser = { ...newMood, userId: user?.id };
      const moodsData = await AsyncStorage.getItem('userMoods');
      const existingMoods = moodsData ? JSON.parse(moodsData) : [];
      const updatedMoods = [...existingMoods, moodWithUser];
      await AsyncStorage.setItem('userMoods', JSON.stringify(updatedMoods));
      setMoods(prevMoods => [...prevMoods, moodWithUser]);
    } catch (e) {
      console.error('Ошибка сохранения настроения:', e);
    }
  };

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
    <AuthContext.Provider value={{ user, moods, isLoading, register, login, logout, addMood, exportData }}>
      {children}
    </AuthContext.Provider>
  );
};