import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BarcodeService {

  value: string = '';

  constructor() { }

  generateBarcode(value: string) {
    this.value = value;
    // import JsBarcode from 'jsbarcode';
    // JsBarcode('#generateBarcodeSection', value, {
    //   format: 'CODE128', // Barcode format
    //   lineColor: '#000',
    //   width: 2,
    //   height: 50,
    //   displayValue: true,
    // });
  }

  printBarcode(value: string) {
    this.generateBarcode(value);
    setTimeout(() => {
      const printContent = document.getElementById('printBarcodeSection')?.innerHTML;
      const printWindow = window.open('', '', 'width=600,height=400');

      if (printWindow && printContent) {
        printWindow.document.write('<html><body style="text-align:center;">');
        printWindow.document.write(printContent);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.print();
      }
    }, 100);
  }

}
