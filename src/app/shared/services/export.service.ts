import { Injectable, ElementRef } from '@angular/core';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import { autoTable } from 'jspdf-autotable';
import 'jspdf-autotable';

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  constructor() { }

  ExportTOExcel( HtmlElement: ElementRef,title: string ) {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(HtmlElement );
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet( wb, ws, 'Sheet1' );

    XLSX.writeFile( wb, title + '.xlsx' );
  }

  ExportTOPDF( idElement: string, title: string, fileName: string ) {
    const doc = new jsPDF( 'p', 'mm', 'a4' );
    doc.text( title, 11, 8 );
    
    ( doc as any ).autoTable( { html: idElement } );

    doc.save( fileName +'.pdf' );
  }
}
