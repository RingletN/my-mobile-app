import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import MoodTrackerScreen from './MoodTrackerScreen';
import StatsScreen from './StatsScreen';
import ProfileScreen from './ProfileScreen';

const Tab = createBottomTabNavigator();

const TabsNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          
          if (route.name === 'MoodTracker') {
            iconName = 'mood';
          } else if (route.name === 'Stats') {
            iconName = 'bar-chart';
          } else if (route.name === 'Profile') {
            iconName = 'person';
          }
          
          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#5770C5',
        tabBarInactiveTintColor: '#aaa',
        headerShown: false,
      })}
    >
      <Tab.Screen name="MoodTracker" component={MoodTrackerScreen} options={{ title: 'Настроение' }} />
      <Tab.Screen name="Stats" component={StatsScreen} options={{ title: 'Статистика' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Профиль' }} />
    </Tab.Navigator>
  );
};

export default TabsNavigator;