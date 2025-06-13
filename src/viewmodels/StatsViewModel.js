import * as Clipboard from 'expo-clipboard';
import AuthViewModel from './AuthViewModel';

class StatsViewModel {
  getSortedMoods(moods) {
    return [...moods].sort((a, b) => new Date(b.date.split('.').reverse().join('-')) - new Date(a.date.split('.').reverse().join('-')));
  }

  getMoodStats(moods) {
    return this.getSortedMoods(moods).reduce((acc, mood) => {
      const date = mood.date;
      if (!acc[date]) {
        acc[date] = { happy: 0, neutral: 0, sad: 0, angry: 0, tired: 0 };
      }
      if (mood.emoji === '😊') acc[date].happy++;
      else if (mood.emoji === '😐') acc[date].neutral++;
      else if (mood.emoji === '😢') acc[date].sad++;
      else if (mood.emoji === '😡') acc[date].angry++;
      else if (mood.emoji === '🥱') acc[date].tired++;
      return acc;
    }, {});
  }

  async handleExport(user, setExportedData, setExportModalVisible) {
    const data = await AuthViewModel.exportData(user);
    if (data.length > 0) {
      const filteredData = data.map(({ id, ...rest }) => rest);
      setExportedData(JSON.stringify(filteredData, null, 2));
      setExportModalVisible(true);
    } else {
      return { success: false, error: 'Нет данных для экспорта' };
    }
    return { success: true };
  }

  async handleCopy(exportedData) {
    await Clipboard.setStringAsync(exportedData);
    return { success: true, message: 'Данные скопированы в буфер обмена' };
  }

  async handleImport(importedJson, setImportedJson, setImportModalVisible, addMood) {
    try {
      const parsedData = JSON.parse(importedJson);
      if (!Array.isArray(parsedData)) {
        throw new Error('Данные должны быть массивом');
      }
      const dateRegex = /^\d{2}\.\d{2}\.\d{4}$/;
      for (const mood of parsedData) {
        if (!mood.emoji || !mood.date || !dateRegex.test(mood.date)) {
          throw new Error('Некорректный формат данных: отсутствует emoji или date (ожидается DD.MM.YYYY)');
        }
        await addMood({
          id: Date.now() + Math.random(),
          emoji: mood.emoji,
          note: mood.note || '',
          date: mood.date,
          time: mood.time || '00:00',
        });
      }
      setImportedJson('');
      setImportModalVisible(false);
      return { success: true, message: 'Данные импортированы' };
    } catch (e) {
      return { success: false, error: `Ошибка при импорте: ${e.message}` };
    }
  }

  getMaxValue(stats) {
    return Math.max(...Object.values(stats).filter(v => typeof v === 'number'));
  }

  normalizeValue(value, max) {
    return max > 0 ? value / max : 0;
  }
}

export default new StatsViewModel();