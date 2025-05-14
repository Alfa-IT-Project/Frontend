import React, { useState } from 'react';
import { Button } from '../ui/button';
import { formatCurrency } from '../../utils/format';
import Modal from '../ui/modal';

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

const PrintCheck = ({ record, isOpen, onClose }) => {
  const [isPrinting, setIsPrinting] = useState(false);
  const paymentDate = record.paymentDate 
    ? new Date(record.paymentDate) 
    : new Date();
  const formattedDate = paymentDate.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  const checkNumber = generateCheckNumber();

  const handlePrint = () => {
    setIsPrinting(true);
    const printContent = document.getElementById('check-to-print');
    if (printContent) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Payroll Check</title>
              <style>
                body { 
                  font-family: Arial, sans-serif; 
                  margin: 0; 
                  padding: 20px; 
                }
                .check-container {
                  border: 2px solid #000;
                  padding: 20px;
                  margin-bottom: 30px;
                  position: relative;
                  max-width: 800px;
                  margin: 0 auto;
                }
                .check-header {
                  display: flex;
                  justify-content: space-between;
                  margin-bottom: 20px;
                }
                .company-info {
                  width: 50%;
                }
                .company-name {
                  font-size: 18px;
                  font-weight: bold;
                }
                .company-address {
                  font-size: 12px;
                  color: #444;
                }
                .check-number {
                  font-size: 14px;
                  text-align: right;
                }
                .date-line {
                  display: flex;
                  justify-content: flex-end;
                  margin-bottom: 20px;
                }
                .date {
                  font-size: 14px;
                  text-decoration: underline;
                }
                .pay-to-line {
                  margin-bottom: 15px;
                }
                .payee-label {
                  font-size: 12px;
                  margin-bottom: 5px;
                }
                .payee-name {
                  font-size: 16px;
                  text-decoration: underline;
                  font-weight: bold;
                }
                .amount-line {
                  display: flex;
                  margin-bottom: 20px;
                }
                .amount-box {
                  border: 1px solid #000;
                  padding: 5px 10px;
                  min-width: 150px;
                  text-align: center;
                }
                .amount-in-numbers {
                  font-size: 16px;
                  font-weight: bold;
                }
                .amount-words {
                  font-size: 14px;
                  margin-left: 15px;
                  max-width: 70%;
                }
                .memo {
                  font-size: 12px;
                  margin-top: 10px;
                  color: #666;
                }
                .signature {
                  margin-top: 50px;
                  border-top: 1px solid #000;
                  padding-top: 5px;
                  width: 200px;
                  text-align: center;
                  margin-left: auto;
                }
                .signature-label {
                  font-size: 12px;
                }
                .payroll-details {
                  margin-top: 40px;
                  border-top: 1px dashed #000;
                  padding-top: 20px;
                }
                .details-title {
                  font-size: 16px;
                  font-weight: bold;
                  margin-bottom: 15px;
                }
                .detail-row {
                  display: flex;
                  margin-bottom: 8px;
                }
                .detail-label {
                  width: 40%;
                  font-size: 12px;
                }
                .detail-value {
                  width: 60%;
                  font-size: 12px;
                }
                .detail-total {
                  margin-top: 10px;
                  border-top: 1px solid #000;
                  padding-top: 5px;
                  font-weight: bold;
                }
                .footer {
                  margin-top: 30px;
                  text-align: center;
                  font-size: 12px;
                  color: #666;
                }
                @media print {
                  body { 
                    -webkit-print-color-adjust: exact; 
                    print-color-adjust: exact; 
                  }
                  button { 
                    display: none; 
                  }
                }
              </style>
            </head>
            <body>
              ${printContent.innerHTML}
            </body>
          </html>
        `);
        
        printWindow.document.close();
        setTimeout(() => {
          printWindow.print();
          setTimeout(() => {
            setIsPrinting(false);
          }, 1000);
        }, 500);
      } else {
        setIsPrinting(false);
      }
    } else {
      setIsPrinting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Payroll Check">
      <div className="flex flex-col gap-4">
        <div
          id="check-to-print"
          className="border border-gray-300 rounded-lg p-6 overflow-auto max-h-[60vh]">
          <div className="border-2 border-gray-800 p-6 mb-8 relative">
            <div className="flex justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold">Staff Management Inc.</h2>
                <p className="text-sm text-gray-600">123 Business Avenue, Suite 500</p>
                <p className="text-sm text-gray-600">Corporate City, ST 12345</p>
              </div>
              <div>
                <p className="text-right text-sm">Check No: {checkNumber}</p>
              </div>
            </div>
            
            <div className="flex justify-end mb-6">
              <p className="underline">{formattedDate}</p>
            </div>
            
            <div className="mb-4">
              <p className="text-xs mb-1">PAY TO THE ORDER OF:</p>
              <p className="text-base font-bold underline">{record.user?.name || 'Employee'}</p>
            </div>
            
            <div className="flex mb-6">
              <div className="border border-gray-800 p-2 min-w-[150px] text-center">
                <p className="font-bold">${record.netSalary.toFixed(2)}</p>
              </div>
              <p className="ml-4 text-sm max-w-[70%]">{convertToWords(record.netSalary)}</p>
            </div>
            
            <p className="text-xs text-gray-600 mt-4">Memo: Salary payment for {record.month}/{record.year}</p>
            
            <div className="mt-12 border-t border-gray-800 pt-1 w-48 ml-auto text-center">
              <p className="text-xs">Authorized Signature</p>
            </div>
          </div>
          
          <div className="border-t border-dashed border-gray-400 pt-6 mt-8">
            <h3 className="text-lg font-bold mb-4">Payroll Details</h3>
            
            <div className="grid grid-cols-2 gap-2 mb-2">
              <p className="text-sm">Employee:</p>
              <p className="text-sm">{record.user?.name || 'Employee'}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-2 mb-2">
              <p className="text-sm">Department:</p>
              <p className="text-sm">{record.user?.department || 'N/A'}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-2 mb-2">
              <p className="text-sm">Pay Period:</p>
              <p className="text-sm">{record.month}/{record.year}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-2 mb-2">
              <p className="text-sm">Basic Salary:</p>
              <p className="text-sm">{formatCurrency(record.basicSalary)}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-2 mb-2">
              <p className="text-sm">Allowances:</p>
              <p className="text-sm">{formatCurrency(record.allowances)}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-2 mb-2">
              <p className="text-sm">Deductions:</p>
              <p className="text-sm">{formatCurrency(record.deductions)}</p>
            </div>
            
            <div
              className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-300 font-bold">
              <p className="text-sm">Net Pay:</p>
              <p className="text-sm">{formatCurrency(record.netSalary)}</p>
            </div>
          </div>
          
          <p className="text-center text-xs text-gray-500 mt-8">
            This is an official payment document. Please retain for your records.
          </p>
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <Button
            onClick={handlePrint}
            disabled={isPrinting}
            className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2">
            {isPrinting ? (
              <>
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Printing...
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="feather feather-printer">
                  <polyline points="6 9 6 2 18 2 18 9"></polyline>
                  <path
                    d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                  <rect x="6" y="14" width="12" height="8"></rect>
                </svg>
                Print Check
              </>
            )}
          </Button>
          
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default PrintCheck; 