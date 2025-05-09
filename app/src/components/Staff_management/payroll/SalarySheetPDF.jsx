import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { format } from 'date-fns';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 20,
    textAlign: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 10,
    borderBottom: '1pt solid #000',
    paddingBottom: 5,
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
    paddingTop: 5,
    borderTop: '1pt solid #000',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 10,
    color: '#666',
  },
});

export const SalarySheetPDF = ({ record }) => {
  const date = new Date(parseInt(record.year), parseInt(record.month) - 1);
  const formattedDate = format(date, 'MMMM yyyy');

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Salary Sheet</Text>
          <Text style={styles.subtitle}>{formattedDate}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Employee Information</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.value}>{record.user?.name || 'N/A'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{record.user?.email || 'N/A'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Department:</Text>
            <Text style={styles.value}>{record.user?.department || 'N/A'}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Salary Details</Text>
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
          <Text style={styles.sectionTitle}>Payment Information</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Status:</Text>
            <Text style={styles.value}>{record.status}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Payment Date:</Text>
            <Text style={styles.value}>
              {record.paymentDate ? format(new Date(record.paymentDate), 'MMM dd, yyyy') : 'Not Paid'}
            </Text>
          </View>
        </View>

        <Text style={styles.footer}>
          This is a computer-generated document and does not require a signature.
        </Text>
      </Page>
    </Document>
  );
}; 