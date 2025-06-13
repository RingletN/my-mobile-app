// MoodViewModel.js
import axios from 'axios';

class MoodViewModel {
  constructor() {
    this.quote = '';
    this.isLoading = false;
    this.error = null;
  }

  async fetchRandomQuote() {
    this.isLoading = true;
    this.error = null;
    try {
      const response = await axios.get('https://zenquotes.io/api/random');
      this.quote = response.data[0].q; // Текст цитаты
    } catch (err) {
      this.error = 'Не удалось загрузить цитату. Проверьте интернет.';
      console.error(err);
    } finally {
      this.isLoading = false;
    }
  }

  getQuote() {
    return this.quote;
  }

  getIsLoading() {
    return this.isLoading;
  }

  getError() {
    return this.error;
  }
}

export default new MoodViewModel();