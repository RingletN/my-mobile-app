import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [moods, setMoods] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [quote, setQuote] = useState('');
  const [isQuoteLoading, setIsQuoteLoading] = useState(false);
  const [quoteError, setQuoteError] = useState(null);
  const [cachedQuotes, setCachedQuotes] = useState([]);

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
        const cachedData = await AsyncStorage.getItem('cachedQuotes');
        if (cachedData) {
          const parsedQuotes = JSON.parse(cachedData);
          setCachedQuotes(parsedQuotes);
          setQuote(parsedQuotes[0]?.q || '');
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

  const value = {
    user,
    setUser,
    moods,
    setMoods,
    isLoading,
    setIsLoading,
    quote,
    setQuote,
    isQuoteLoading,
    setIsQuoteLoading,
    quoteError,
    setQuoteError,
    cachedQuotes,
    setCachedQuotes,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};