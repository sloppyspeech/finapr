import { Injectable } from '@angular/core';
import * as FileSaver  from 'file-saver';
import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root'
})
export class ExpexcelService {
  //
  fileExtension='.xlsx';
  fileType='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  //

  constructor() { }

  public exportToExcel(jsonData:any[],excelFileName:string):void{
    console.log('In Export To Excel');
    console.log(jsonData);
    const worksheet:XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonData);
    const workbook:XLSX.WorkBook = {Sheets : {'ExpenseData':worksheet},SheetNames:['ExpenseData']}; //'ExpenseData' should be same name as sheet names
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveExcelFile(excelBuffer, excelFileName);
  }

  private saveExcelFile(buffer:any,excelFileName:String):void{
    const data: Blob = new Blob([buffer], {type: this.fileType});
    FileSaver.saveAs(data, excelFileName + this.fileExtension);
  }

}

