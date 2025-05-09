import React, { useState } from 'react';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import PayrollCheck from './PayrollCheck';
import { Button } from '../ui/button';
import Modal from '../ui/modal';

const PrintablePayrollCheck = ({ 
  record, 
  isOpen, 
  onClose 
}) => {
  const [showPrintPreview, setShowPrintPreview] = useState(true);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Payroll Check">
      <div className="flex flex-col gap-4">
        {showPrintPreview ? (
          <div className="h-[70vh] overflow-y-auto border rounded">
            <PDFViewer width="100%" height="100%" className="border-0">
              <PayrollCheck record={record} />
            </PDFViewer>
          </div>
        ) : (
          <div className="flex justify-center items-center h-[70vh] bg-gray-100 rounded">
            <p>Click "Print Check" or "Download Check" below</p>
          </div>
        )}

        <div className="flex justify-end gap-3 mt-4">
          <Button variant="outline" onClick={() => setShowPrintPreview(!showPrintPreview)}>
            {showPrintPreview ? "Hide Preview" : "Show Preview"}
          </Button>
          
          <PDFDownloadLink
            document={<PayrollCheck record={record} />}
            fileName={`payroll-check-${record.user?.name || 'employee'}-${record.month}-${record.year}.pdf`}
            className="inline-block">
            {({ loading }) => (
              <Button variant="outline" disabled={loading}>
                {loading ? 'Preparing...' : 'Download Check'}
              </Button>
            )}
          </PDFDownloadLink>
          
          <Button
            onClick={() => {
              const printWindow = window.open('', '_blank');
              if (printWindow) {
                printWindow.document.write(`
                  <html>
                    <head>
                      <title>Payroll Check Print</title>
                      <style>
                        body { margin: 0; }
                        iframe { border: none; width: 100%; height: 100vh; }
                      </style>
                      <script>
                        function onLoadHandler() {
                          setTimeout(() => {
                            window.print();
                          }, 1000);
                        }
                      </script>
                    </head>
                    <body onload="onLoadHandler()">
                      <iframe src="data:application/pdf;base64,LOADING_PDF" onload="onLoadHandler()"></iframe>
                    </body>
                  </html>
                `);
                
                // Force the print dialog to open
                printWindow.document.close();
              }
            }}>
            Print Check
          </Button>
          
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default PrintablePayrollCheck; 