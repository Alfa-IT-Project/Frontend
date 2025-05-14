import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { format } from 'date-fns';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
  },
  checkContainer: {
    border: '1pt solid #000',
    padding: 20,
    marginBottom: 30,
    position: 'relative',
  },
  checkHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  companyInfo: {
    width: '50%',
  },
  companyName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  companyAddress: {
    fontSize: 10,
    color: '#444',
  },
  checkNumber: {
    fontSize: 12,
    textAlign: 'right',
  },
  dateLine: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 20,
  },
  date: {
    fontSize: 12,
    textDecoration: 'underline',
  },
  payToLine: {
    marginBottom: 15,
  },
  payeeLabel: {
    fontSize: 10,
    marginBottom: 2,
  },
  payeeName: {
    fontSize: 12,
    textDecoration: 'underline',
    fontWeight: 'bold',
  },
  amountLine: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  amountBox: {
    border: '1pt solid #000',
    padding: 5,
    width: 150,
    textAlign: 'center',
  },
  amountInNumbers: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  amountWords: {
    fontSize: 12,
    marginLeft: 10,
    width: '65%',
  },
  memo: {
    fontSize: 10,
    marginTop: 10,
    color: '#666',
  },
  signature: {
    marginTop: 50,
    borderTop: '1pt solid #000',
    paddingTop: 5,
    width: 200,
    textAlign: 'center',
    alignSelf: 'flex-end',
  },
  signatureLabel: {
    fontSize: 10,
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
  payrollDetails: {
    marginTop: 40,
    borderTop: '1pt dashed #000',
    paddingTop: 20,
  },
  detailsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  label: {
    width: '40%',
    fontSize: 10,
  },
  value: {
    width: '60%',
    fontSize: 10,
  },
  total: {
    marginTop: 5,
    borderTop: '1pt solid #000',
    paddingTop: 5,
    fontWeight: 'bold',
  },
});

// Helper function to convert numbers to words
const convertToWords = num => {
  const units = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
  const teens = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
  const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
  
  const convert = n => {
    if (n < 10) return units[n];
    if (n < 20) return teens[n - 10];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 === 0 ? '' : '-' + units[n % 10]);
    if (n < 1000) return units[Math.floor(n / 100)] + ' hundred' + (n % 100 === 0 ? '' : ' ' + convert(n % 100));
    if (n < 1000000) return convert(Math.floor(n / 1000)) + ' thousand' + (n % 1000 === 0 ? '' : ' ' + convert(n % 1000));
    return convert(Math.floor(n / 1000000)) + ' million' + (n % 1000000 === 0 ? '' : ' ' + convert(n % 1000000));
  };
  
  const dollars = Math.floor(num);
  const cents = Math.round((num - dollars) * 100);
  
  let result = convert(dollars) + ' dollars';
  if (cents > 0) {
    result += ' and ' + convert(cents) + ' cents';
  }
  
  return result.charAt(0).toUpperCase() + result.slice(1);
};

// Generate a random check number
const generateCheckNumber = () => {
  return (Math.floor(Math.random() * 10000000) + 10000000).toString();
};

const PayrollCheck = ({ record }) => {
  const paymentDate = record.paymentDate 
    ? new Date(record.paymentDate) 
    : new Date();
  const formattedDate = format(paymentDate, 'MMMM dd, yyyy');
  const checkNumber = generateCheckNumber();
  const period = `${record.month}/${record.year}`;
  
  // Calculate the net salary if needed
  const netSalary = typeof record.netSalary === 'number' 
    ? record.netSalary 
    : typeof record.basicSalary === 'number' && typeof record.allowances === 'number' && typeof record.deductions === 'number'
      ? record.basicSalary + record.allowances - record.deductions
      : 0;
  
  // Format the display values
  const netSalaryDisplay = netSalary.toFixed(2);
  const basicSalaryDisplay = typeof record.basicSalary === 'number' ? record.basicSalary.toFixed(2) : '0.00';
  const allowancesDisplay = typeof record.allowances === 'number' ? record.allowances.toFixed(2) : '0.00';
  const deductionsDisplay = typeof record.deductions === 'number' ? record.deductions.toFixed(2) : '0.00';

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.checkContainer}>
          <View style={styles.checkHeader}>
            <View style={styles.companyInfo}>
              <Text style={styles.companyName}>Staff Management Inc.</Text>
              <Text style={styles.companyAddress}>123 Business Avenue, Suite 500</Text>
              <Text style={styles.companyAddress}>Corporate City, ST 12345</Text>
            </View>
            <View>
              <Text style={styles.checkNumber}>Check No: {checkNumber}</Text>
            </View>
          </View>
          
          <View style={styles.dateLine}>
            <Text style={styles.date}>{formattedDate}</Text>
          </View>
          
          <View style={styles.payToLine}>
            <Text style={styles.payeeLabel}>PAY TO THE ORDER OF:</Text>
            <Text style={styles.payeeName}>{record.user?.name || 'Employee'}</Text>
          </View>
          
          <View style={styles.amountLine}>
            <View style={styles.amountBox}>
              <Text style={styles.amountInNumbers}>${netSalaryDisplay}</Text>
            </View>
            <Text style={styles.amountWords}>{convertToWords(netSalary)}</Text>
          </View>
          
          <Text style={styles.memo}>Memo: Salary payment for {period}</Text>
          
          <View style={styles.signature}>
            <Text style={styles.signatureLabel}>Authorized Signature</Text>
          </View>
        </View>
        
        <View style={styles.payrollDetails}>
          <Text style={styles.detailsTitle}>Payroll Details</Text>
          
          <View style={styles.row}>
            <Text style={styles.label}>Employee:</Text>
            <Text style={styles.value}>{record.user?.name || 'Employee'}</Text>
          </View>
          
          <View style={styles.row}>
            <Text style={styles.label}>Department:</Text>
            <Text style={styles.value}>{record.user?.department || 'N/A'}</Text>
          </View>
          
          <View style={styles.row}>
            <Text style={styles.label}>Pay Period:</Text>
            <Text style={styles.value}>{period}</Text>
          </View>
          
          <View style={styles.row}>
            <Text style={styles.label}>Basic Salary:</Text>
            <Text style={styles.value}>${basicSalaryDisplay}</Text>
          </View>
          
          <View style={styles.row}>
            <Text style={styles.label}>Allowances:</Text>
            <Text style={styles.value}>${allowancesDisplay}</Text>
          </View>
          
          <View style={styles.row}>
            <Text style={styles.label}>Deductions:</Text>
            <Text style={styles.value}>${deductionsDisplay}</Text>
          </View>
          
          <View style={[styles.row, styles.total]}>
            <Text style={styles.label}>Net Pay:</Text>
            <Text style={styles.value}>${netSalaryDisplay}</Text>
          </View>
        </View>
        
        <Text style={styles.footer}>
          This is an official payment document. Please retain for your records.
        </Text>
      </Page>
    </Document>
  );
};

export default PayrollCheck; 