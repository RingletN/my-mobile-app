import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const StatsScreen = () => {
  // Временные данные для графика
  const stats = [
    { day: 'Пн', value: 70 },
    { day: 'Вт', value: 30 },
    { day: 'Ср', value: 50 },
    { day: 'Чт', value: 80 },
    { day: 'Пт', value: 40 },
    { day: 'Сб', value: 90 },
    { day: 'Вс', value: 60 },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Статистика настроения</Text>
      
      <View style={styles.chartContainer}>
        {stats.map((item, index) => (
          <View key={index} style={styles.chartItem}>
            <View 
              style={[styles.chartBar, { height: item.value }]} 
            />
            <Text style={styles.chartLabel}>{item.day}</Text>
          </View>
        ))}
      </View>
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
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 200,
    marginTop: 30,
  },
  chartItem: {
    flex: 1,
    alignItems: 'center',
  },
  chartBar: {
    width: 30,
    backgroundColor: '#5770C5',
    marginHorizontal: 5,
    borderRadius: 5,
  },
  chartLabel: {
    marginTop: 5,
  },
});

export default StatsScreen;