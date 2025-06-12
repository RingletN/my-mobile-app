import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, useWindowDimensions } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { Table, TableRow } from '../components/TableComponent';

const StatsScreen = () => {
  const { moods } = useContext(AuthContext);
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  const moodStats = moods.reduce((acc, mood) => {
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

  return (
    <View style={[styles.container, isLandscape && styles.containerLandscape]}>
      <Text style={styles.title}>Статистика настроений</Text>

      <ScrollView horizontal>
        <Table>
          <TableRow>
            <Text style={[styles.cell, styles.headerCell]}>Дата</Text>
            <Text style={[styles.cell, styles.headerCell]}>😊 Радость</Text>
            <Text style={[styles.cell, styles.headerCell]}>😐 Нейтрально</Text>
            <Text style={[styles.cell, styles.headerCell]}>😢 Грусть</Text>
            <Text style={[styles.cell, styles.headerCell]}>😡 Злость</Text>
            <Text style={[styles.cell, styles.headerCell]}>🥱 Усталость</Text>
          </TableRow>
          {Object.entries(moodStats).map(([date, stats]) => (
            <TableRow key={date}>
              <Text style={styles.cell}>{date}</Text>
              <Text style={styles.cell}>{stats.happy}</Text>
              <Text style={styles.cell}>{stats.neutral}</Text>
              <Text style={styles.cell}>{stats.sad}</Text>
              <Text style={styles.cell}>{stats.angry}</Text>
              <Text style={styles.cell}>{stats.tired}</Text>
            </TableRow>
          ))}
        </Table>
      </ScrollView>

      <ScrollView style={styles.chartContainer}>
        {Object.entries(moodStats).map(([date, stats]) => (
          <View key={date} style={[styles.chartRow, isLandscape && styles.chartRowLandscape]}>
            <Text style={[styles.chartLabel, isLandscape && styles.chartLabelLandscape]}>{date}</Text>
            <View style={[styles.barContainer, isLandscape && styles.barContainerLandscape]}>
              <View style={[styles.bar, { flex: stats.happy, backgroundColor: '#4CAF50' }]} />
              <View style={[styles.bar, { flex: stats.neutral, backgroundColor: '#FFC107' }]} />
              <View style={[styles.bar, { flex: stats.sad, backgroundColor: '#F44336' }]} />
              <View style={[styles.bar, { flex: stats.angry, backgroundColor: '#FF5722' }]} />
              <View style={[styles.bar, { flex: stats.tired, backgroundColor: '#9E9E9E' }]} />
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#fff',
  },
  containerLandscape: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  cell: {
    padding: 12,
    width: 100,
    textAlign: 'center',
  },
  headerCell: {
    fontWeight: 'bold',
    backgroundColor: '#f5f5f5',
  },
  chartContainer: {
    marginTop: 20,
  },
  chartRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  chartRowLandscape: {
    flexDirection: 'column',
    flex: 1,
    marginHorizontal: 10,
  },
  chartLabel: {
    width: 80,
    fontSize: 12,
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
  },
  barContainerLandscape: {
    flexDirection: 'column',
    height: 100,
  },
  bar: {
    height: '100%',
  },
});

export default StatsScreen;