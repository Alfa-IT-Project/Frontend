import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 30,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 5,
  },
  section: {
    marginBottom: 15,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  label: {
    width: '40%',
    fontSize: 12,
  },
  value: {
    width: '60%',
    fontSize: 12,
  },
  total: {
    marginTop: 10,
    paddingTop: 10,
    borderTop: 1,
  },
});

const SalarySheetPDF = ({ record }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Salary Sheet</Text>
          <Text style={styles.subtitle}>
            {record.user?.name} - {record.month}/{record.year}
          </Text>
        </View>

        <View style={styles.section}>
          <View style={styles.row}>
            <Text style={styles.label}>Basic Salary:</Text>
            <Text style={styles.value}>${record.basicSalary.toFixed(2)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Allowances:</Text>
            <Text style={styles.value}>${record.allowances.toFixed(2)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Deductions:</Text>
            <Text style={styles.value}>${record.deductions.toFixed(2)}</Text>
          </View>
          <View style={[styles.row, styles.total]}>
            <Text style={styles.label}>Net Salary:</Text>
            <Text style={styles.value}>${record.netSalary.toFixed(2)}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.row}>
            <Text style={styles.label}>Status:</Text>
            <Text style={styles.value}>{record.status}</Text>
          </View>
          {record.paymentDate && (
            <View style={styles.row}>
              <Text style={styles.label}>Payment Date:</Text>
              <Text style={styles.value}>
                {new Date(record.paymentDate).toLocaleDateString()}
              </Text>
            </View>
          )}
        </View>
      </Page>
    </Document>
  );
};

export default SalarySheetPDF; 