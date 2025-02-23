import { Injectable } from '@angular/core';
import JsBarcode from 'jsbarcode';

@Injectable({
  providedIn: 'root'
})
export class BarcodeService {

  constructor() { }

  generateBarcode(value: string) {
    JsBarcode('#generateBarcodeSection', value, {
      format: 'CODE128', // Barcode format
      lineColor: '#000',
      width: 2,
      height: 50,
      displayValue: true,
    });
  }

  printBarcode(value: string) {
    this.generateBarcode(value)
    const printContent = document.getElementById('printBarcodeSection')?.innerHTML;
    const printWindow = window.open('', '', 'width=600,height=400');
    
    if (printWindow && printContent) {
      // <head><title>Print Barcode</title></head>
      printWindow.document.write('<html><body style="text-align:center;">');
      printWindow.document.write(printContent);
      printWindow.document.write('</body></html>');
      printWindow.document.close();
      printWindow.print();
    }
  }

}
