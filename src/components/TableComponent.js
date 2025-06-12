import React from 'react';
import { View, StyleSheet } from 'react-native';

const TableComponent = ({ children }) => {
  return <View style={styles.table}>{children}</View>;
};

const TableRow = ({ children }) => {
  return <View style={styles.row}>{children}</View>;
};

const styles = StyleSheet.create({
  table: {
    borderWidth: 1,
    borderColor: '#ddd',
    margin: 10,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
});

export { TableComponent as Table, TableRow };