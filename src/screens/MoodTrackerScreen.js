// MoodTrackerScreen.js
import React, { useState, useContext } from 'react';
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
} from 'react-native';
import { AuthContext } from '../context/AuthContext';

const MoodTrackerScreen = () => {
  const { user, addMood } = useContext(AuthContext);
  const [mood, setMood] = useState(null);
  const [note, setNote] = useState('');
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

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
        <TouchableOpacity style={styles.helpButton} onPress={() => Alert.alert('Помощь', 'Выберите эмодзи и добавьте заметку')}>
          <Text style={styles.helpText}>?</Text>
        </TouchableOpacity>
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
    maxHeight: 80,
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
    width: 60, // Вернул меньший размер
    height: 60, // Вернул меньший размер
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    borderRadius: 30,
    backgroundColor: '#f0f0f0',
    padding: 10,
  },
  selectedMood: {
    backgroundColor: '#5770C5',
    // transform: [{ scale: 1.05 }], // Уменьшил масштаб
  },
  moodText: {
    fontSize: 22, // Уменьшил размер текста
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
});

export default MoodTrackerScreen;