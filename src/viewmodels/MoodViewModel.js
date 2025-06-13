import AsyncStorage from '@react-native-async-storage/async-storage';

class MoodViewModel {
  async fetchRandomQuote(updateCache, setQuote, setIsQuoteLoading, setQuoteError, cachedQuotes, setCachedQuotes) {
    setIsQuoteLoading(true);
    setQuoteError(null);
    try {
      let newQuote = '';
      if (!updateCache && cachedQuotes.length > 0) {
        const randomIndex = Math.floor(Math.random() * cachedQuotes.length);
        newQuote = cachedQuotes[randomIndex].q;
      } else {
        const response = await fetch('https://zenquotes.io/api/quotes/');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        if (data && data.length > 0) {
          newQuote = data[0].q;
          const updatedQuotes = [...data].slice(0, 10);
          setCachedQuotes(updatedQuotes);
          await AsyncStorage.setItem('cachedQuotes', JSON.stringify(updatedQuotes));
        } else {
          throw new Error('Нет данных в ответе API');
        }
      }
      setQuote(newQuote);
      return newQuote;
    } catch (err) {
      setQuoteError(`Ошибка загрузки цитаты: ${err.message}. Используется кэш, если доступен.`);
      if (cachedQuotes.length > 0) {
        const randomIndex = Math.floor(Math.random() * cachedQuotes.length);
        setQuote(cachedQuotes[randomIndex].q);
        return cachedQuotes[randomIndex].q;
      }
      return null;
    } finally {
      setIsQuoteLoading(false);
    }
  }
}

export default new MoodViewModel();