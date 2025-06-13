// MoodTrackerScreen.js
import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
  Alert,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

const MoodTrackerScreen = () => {
  const { user, addMood, fetchRandomQuote, quote, isQuoteLoading, quoteError } = useContext(AuthContext);
  const [mood, setMood] = useState(null);
  const [note, setNote] = useState('');
  const [quoteModalVisible, setQuoteModalVisible] = useState(false);
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  useEffect(() => {
    // Опциональная загрузка цитаты при старте
    fetchRandomQuote();
  }, [fetchRandomQuote]);

  const moods = ['😊', '😐', '😢', '😡', '🥱'];

  const saveMood = async () => {
    if (!mood) {
      Alert.alert('Ошибка', 'Выберите настроение');
      return;
    }
    const newMood = {
      id: Date.now(),
      emoji: mood,
      note,
      date: new Date().toLocaleDateString('ru-RU'),
      time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
    };
    await addMood(newMood);
    setNote('');
    setMood(null);
    Alert.alert('Успех', 'Настроение сохранено');
  };

  const loadQuote = async () => {
    await fetchRandomQuote(); // Дожидаемся загрузки цитаты
    setQuoteModalVisible(true); // Открываем модальное окно только после получения цитаты
  };

  const addQuoteToNote = () => {
    if (quote && note.indexOf(quote) === -1) { // Проверяем, чтобы цитата не дублировалась
      setNote(prevNote => (prevNote ? `${prevNote}\n\n${quote}` : quote));
    }
    setQuoteModalVisible(false); // Закрываем модальное окно после добавления
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <View style={[styles.relativeContainer, isLandscape && styles.relativeContainerLandscape]}>
        <Text style={styles.title}>Как вы себя чувствуете, {user?.name}?</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={[styles.moodsScroll, isLandscape && styles.moodsScrollLandscape]}>
          {moods.map((emoji) => (
            <TouchableOpacity key={emoji} style={[styles.moodButton, mood === emoji && styles.selectedMood]} onPress={() => setMood(emoji)}>
              <Text style={styles.moodText}>{emoji}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <TextInput
          style={[styles.input, isLandscape && styles.inputLandscape]}
          placeholder="Опишите подробнее..."
          value={note}
          onChangeText={setNote}
          multiline
        />
        <TouchableOpacity style={[styles.saveButton, isLandscape && styles.saveButtonLandscape]} onPress={saveMood} disabled={!mood}>
          <Text style={styles.buttonText}>Сохранить настроение</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.quoteButton, isLandscape && styles.quoteButtonLandscape]} onPress={loadQuote} disabled={isQuoteLoading}>
          <Text style={styles.buttonText}>{isQuoteLoading ? 'Загрузка...' : 'Получить цитату'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.helpButton} onPress={() => Alert.alert('Помощь', 'Выберите эмодзи и добавьте заметку')}>
          <Text style={styles.helpText}>?</Text>
        </TouchableOpacity>

        <Modal animationType="slide" transparent={true} visible={quoteModalVisible} onRequestClose={() => setQuoteModalVisible(false)}>
          <View style={styles.modalContainer}>
            <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.modalContent}>
              <Text style={styles.modalTitle}>Вдохновляющая цитата</Text>
              {isQuoteLoading ? (
                <ActivityIndicator size="large" color="#5770C5" />
              ) : quoteError ? (
                <Text style={styles.modalText}>{quoteError}</Text>
              ) : (
                <Text style={styles.modalText}>{quote || 'Нажмите, чтобы загрузить цитату'}</Text>
              )}
              <TouchableOpacity style={styles.addButton} onPress={addQuoteToNote} disabled={!quote || isQuoteLoading}>
                <Text style={styles.buttonText}>Добавить цитату</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.closeButton} onPress={() => setQuoteModalVisible(false)}>
                <Text style={styles.buttonText}>Закрыть</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </Modal>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  relativeContainer: {
    flex: 1,
    padding: 20,
    position: 'relative',
  },
  relativeContainerLandscape: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    position: 'absolute',
    top: 20,
    left: 20,
    right: 60,
  },
  moodsScroll: {
    marginVertical: 15,
    maxHeight: 70,
    position: 'absolute',
    top: 80,
    left: 20,
    right: 20,
  },
  moodsScrollLandscape: {
    maxHeight: 100,
    position: 'relative',
    marginHorizontal: 10,
    flex: 1,
  },
  moodButton: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    borderRadius: 25,
    backgroundColor: '#f0f0f0',
    padding: 2,
  },
  selectedMood: {
    backgroundColor: '#5770C5',
  },
  moodText: {
    fontSize: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    minHeight: 100,
    marginBottom: 20,
    textAlignVertical: 'top',
    fontSize: 16,
    position: 'absolute',
    top: 170,
    left: 20,
    right: 20,
  },
  inputLandscape: {
    position: 'relative',
    flex: 1,
    marginHorizontal: 10,
    minHeight: 80,
  },
  saveButton: {
    backgroundColor: '#5770C5',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
  },
  saveButtonLandscape: {
    position: 'relative',
    flex: 1,
    marginHorizontal: 10,
  },
  quoteButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
  },
  quoteButtonLandscape: {
    position: 'relative',
    flex: 1,
    marginHorizontal: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  helpButton: {
    position: 'absolute',
    right: 20,
    top: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#5770C5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  helpText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
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
  modalText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: '#FF4444',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
});

export default MoodTrackerScreen;