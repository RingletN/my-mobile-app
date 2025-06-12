import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, StyleSheet } from 'react-native';
import { AuthContext } from '../context/AuthContext';

const MoodTrackerScreen = () => {
  const [mood, setMood] = useState(null);
  const [note, setNote] = useState('');
  const { user } = useContext(AuthContext);

  const moods = ['😊', '😐', '😢', '😡', '🥱'];
  
  const saveMood = () => {
    // Здесь будет логика сохранения
    alert(`Сохранено: ${mood} - ${note}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Привет, {user?.name}! Как твое настроение?</Text>
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.moodsContainer}>
        {moods.map((emoji) => (
          <TouchableOpacity 
            key={emoji}
            style={[styles.moodButton, mood === emoji && styles.selectedMood]}
            onPress={() => setMood(emoji)}
          >
            <Text style={styles.moodText}>{emoji}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TextInput
        style={styles.input}
        placeholder="Опиши подробнее..."
        value={note}
        onChangeText={setNote}
        multiline
      />

      <TouchableOpacity 
        style={styles.saveButton} 
        onPress={saveMood}
        disabled={!mood}
      >
        <Text style={styles.buttonText}>Сохранить</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  moodsContainer: {
    marginVertical: 15,
  },
  moodButton: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    borderRadius: 30,
    backgroundColor: '#f0f0f0',
  },
  selectedMood: {
    backgroundColor: '#5770C5',
  },
  moodText: {
    fontSize: 30,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 15,
    minHeight: 100,
    marginBottom: 20,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#5770C5',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default MoodTrackerScreen;