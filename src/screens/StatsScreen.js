// StatsScreen.js
import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, useWindowDimensions, Modal, TextInput } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { Table, TableRow } from '../components/TableComponent';
import * as Clipboard from 'expo-clipboard';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

const StatsScreen = () => {
  const { moods, exportData, addMood, user } = useContext(AuthContext);
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const [exportModalVisible, setExportModalVisible] = useState(false);
  const [importModalVisible, setImportModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [exportedData, setExportedData] = useState('');
  const [importedJson, setImportedJson] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [dateDetails, setDateDetails] = useState([]);

  // Сортировка и статистика
  const sortedMoods = [...moods].sort((a, b) => new Date(b.date.split('.').reverse().join('-')) - new Date(a.date.split('.').reverse().join('-')));
  const moodStats = sortedMoods.reduce((acc, mood) => {
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

  const handleExport = async () => {
    const data = await exportData();
    if (data.length > 0) {
      const filteredData = data.map(({ id, ...rest }) => rest);
      setExportedData(JSON.stringify(filteredData, null, 2));
      setExportModalVisible(true);
    } else {
      Alert.alert('Ошибка', 'Нет данных для экспорта');
    }
  };

  const handleCopy = async () => {
    await Clipboard.setStringAsync(exportedData);
    Alert.alert('Успех', 'Данные скопированы в буфер обмена');
  };

  const handleImport = async () => {
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
      Alert.alert('Успех', 'Данные импортированы');
    } catch (e) {
      Alert.alert('Ошибка', `Ошибка при импорте: ${e.message}`);
    }
  };

  const handleDatePress = (date) => {
    const details = sortedMoods.filter(mood => mood.date === date);
    setDateDetails(details);
    setSelectedDate(date);
    setDetailModalVisible(true);
  };

  const getMaxValue = (stats) => Math.max(...Object.values(stats).filter(v => typeof v === 'number'));
  const normalizeValue = (value, max) => (max > 0 ? value / max : 0);

  return (
    <View style={[styles.container, isLandscape && styles.containerLandscape]}>
      <Animated.View entering={FadeIn} exiting={FadeOut}>
        <Text style={styles.title}>Статистика настроений</Text>
        <TouchableOpacity style={styles.exportButton} onPress={handleExport}>
          <Text style={styles.buttonText}>Экспортировать данные</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.exportButton} onPress={() => setImportModalVisible(true)}>
          <Text style={styles.buttonText}>Импортировать данные</Text>
        </TouchableOpacity>

        {/* Таблица */}
        // Изменения в рендере таблицы
<ScrollView style={styles.tableContainer}>
  <Table style={styles.table}>
    <TableRow>
      {['Дата', '😊', '😐', '😢', '😡', '🥱'].map((header, index) => (
        <Text key={index} style={[styles.cell, styles.headerCell, { flex: 1, minWidth: 0 }]}>{header}</Text>
      ))}
    </TableRow>
    {Object.entries(moodStats).map(([date, stats]) => (
      <TableRow key={date}>
        <TouchableOpacity onPress={() => handleDatePress(date)} style={[styles.cell, { flex: 1, minWidth: 0 }]}>
          <Text style={styles.cellText}>{date}</Text>
        </TouchableOpacity>
        <Text style={[styles.cell, styles.cellText, { flex: 1, minWidth: 0 }]}>{stats.happy}</Text>
        <Text style={[styles.cell, styles.cellText, { flex: 1, minWidth: 0 }]}>{stats.neutral}</Text>
        <Text style={[styles.cell, styles.cellText, { flex: 1, minWidth: 0 }]}>{stats.sad}</Text>
        <Text style={[styles.cell, styles.cellText, { flex: 1, minWidth: 0 }]}>{stats.angry}</Text>
        <Text style={[styles.cell, styles.cellText, { flex: 1, minWidth: 0 }]}>{stats.tired}</Text>
      </TableRow>
    ))}
  </Table>
</ScrollView>

        {/* Графики */}
        <ScrollView style={styles.chartContainer}>
          {Object.entries(moodStats).map(([date, stats]) => {
            const maxValue = getMaxValue(stats);
            return (
              <TouchableOpacity key={date} onPress={() => handleDatePress(date)} style={[styles.chartRow, isLandscape && styles.chartRowLandscape]}>
                <Text style={[styles.chartLabel, isLandscape && styles.chartLabelLandscape]}>{date}</Text>
                <View style={[styles.barContainer, isLandscape && styles.barContainerLandscape]}>
                  <View style={[styles.bar, { flex: normalizeValue(stats.happy, maxValue), backgroundColor: '#4CAF50' }]} />
                  <View style={[styles.bar, { flex: normalizeValue(stats.neutral, maxValue), backgroundColor: '#FFC107' }]} />
                  <View style={[styles.bar, { flex: normalizeValue(stats.sad, maxValue), backgroundColor: '#F44336' }]} />
                  <View style={[styles.bar, { flex: normalizeValue(stats.angry, maxValue), backgroundColor: '#FF5722' }]} />
                  <View style={[styles.bar, { flex: normalizeValue(stats.tired, maxValue), backgroundColor: '#9E9E9E' }]} />
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Модальное окно для экспорта */}
        <Modal animationType="slide" transparent={true} visible={exportModalVisible} onRequestClose={() => setExportModalVisible(false)}>
          <View style={styles.modalContainer}>
            <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.modalContent}>
              <Text style={styles.modalTitle}>Экспортированные данные</Text>
              <TextInput style={styles.modalTextInput} value={exportedData} multiline editable={false} selectTextOnFocus={true} />
              <TouchableOpacity style={styles.copyButton} onPress={handleCopy}>
                <Text style={styles.buttonText}>Копировать</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.closeButton} onPress={() => setExportModalVisible(false)}>
                <Text style={styles.buttonText}>Закрыть</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </Modal>

        {/* Модальное окно для импорта */}
        <Modal animationType="slide" transparent={true} visible={importModalVisible} onRequestClose={() => setImportModalVisible(false)}>
          <View style={styles.modalContainer}>
            <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.modalContent}>
              <Text style={styles.modalTitle}>Импортировать данные</Text>
              <TextInput
                style={styles.modalTextInput}
                value={importedJson}
                onChangeText={setImportedJson}
                multiline
                placeholder="Вставьте JSON данные..."
                placeholderTextColor="#aaa"
              />
              <TouchableOpacity style={styles.importButton} onPress={handleImport}>
                <Text style={styles.buttonText}>Импортировать</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.closeButton} onPress={() => setImportModalVisible(false)}>
                <Text style={styles.buttonText}>Закрыть</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </Modal>

        {/* Модальное окно для подробностей дня */}
        <Modal animationType="slide" transparent={true} visible={detailModalVisible} onRequestClose={() => setDetailModalVisible(false)}>
          <View style={styles.modalContainer}>
            <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.modalContent}>
              <Text style={styles.modalTitle}>Подробности за {selectedDate}</Text>
              <View style={styles.detailStats}>
                <Text style={styles.detailText}>😊 Радость: {moodStats[selectedDate]?.happy || 0}</Text>
                <Text style={styles.detailText}>😐 Нейтрально: {moodStats[selectedDate]?.neutral || 0}</Text>
                <Text style={styles.detailText}>😢 Грусть: {moodStats[selectedDate]?.sad || 0}</Text>
                <Text style={styles.detailText}>😡 Злость: {moodStats[selectedDate]?.angry || 0}</Text>
                <Text style={styles.detailText}>🥱 Усталость: {moodStats[selectedDate]?.tired || 0}</Text>
              </View>
              <ScrollView style={styles.notesContainer}>
                {dateDetails.map((mood, index) => (
                  <View key={index} style={styles.noteItem}>
                    <Text style={styles.noteTime}>{mood.time}</Text>
                    <Text style={styles.noteEmoji}>{mood.emoji}</Text>
                    <Text style={styles.noteText}>{mood.note || 'Без заметки'}</Text>
                  </View>
                ))}
              </ScrollView>
              <TouchableOpacity style={styles.closeButton} onPress={() => setDetailModalVisible(false)}>
                <Text style={styles.buttonText}>Закрыть</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </Modal>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#F5F7FA',
  },
  containerLandscape: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  exportButton: {
    backgroundColor: '#5770C5',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  tableContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    width: '100%',
  },
  table: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cell: {
    padding: 12,
    textAlign: 'center',
    borderRightWidth: 1,
    borderRightColor: '#E0E0E0',
    flex: 1,
    minWidth: 0, // Убирает лишнее пространство
  },
  headerCell: {
    fontWeight: '700',
    backgroundColor: '#F0F4F8',
    color: '#333',
  },
  cellText: {
    fontSize: 14,
    color: '#333',
  },
  chartContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  chartRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  chartRowLandscape: {
    flexDirection: 'column',
    flex: 1,
    marginHorizontal: 10,
  },
  chartLabel: {
    width: 100,
    fontSize: 14,
    fontWeight: '500',
    color: '#5770C5',
  },
  chartLabelLandscape: {
    width: '100%',
    textAlign: 'center',
    marginBottom: 5,
  },
  barContainer: {
    flexDirection: 'row',
    height: 20,
    flex: 1,
    borderRadius: 4,
    overflow: 'hidden',
  },
  barContainerLandscape: {
    flexDirection: 'column',
    height: 100,
  },
  bar: {
    height: '100%',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    width: '90%',
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 15,
    textAlign: 'center',
    color: '#333',
  },
  modalTextInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    minHeight: 120,
    maxHeight: 300,
    fontSize: 14,
    color: '#333',
    backgroundColor: '#F9F9F9',
  },
  copyButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  importButton: {
    backgroundColor: '#5770C5',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  closeButton: {
    backgroundColor: '#FF4444',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  detailStats: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#F0F4F8',
    borderRadius: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  notesContainer: {
    maxHeight: 200,
  },
  noteItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  noteTime: {
    width: 60,
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  noteEmoji: {
    fontSize: 20,
    marginRight: 10,
  },
  noteText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
});

export default StatsScreen;