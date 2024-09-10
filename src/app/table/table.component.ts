import { Component, OnInit } from '@angular/core';
import { PeriodicElement } from '../periodic-element/periodic-element';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'}, 
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'}, 
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'}, 
  {position: 4, name: ' Beryllium', weight: 9.0122, symbol: 'Be'}, 
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'}, 
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'}, 
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
];

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [MatTableModule, MatFormFieldModule, MatInputModule, MatDialogModule, ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css'
})
export class TableComponent {

  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  clickedRows = new Set<PeriodicElement>();
  filterSubject = new Subject<string>();

  constructor(private matDialog: MatDialog) {
    
  }

  ngAfterViewInit(): void{
    this.filterSubject.pipe(
      debounceTime(2000),
      distinctUntilChanged()
    ).subscribe(filterValue => {
      this.dataSource.filter = filterValue.trim().toLowerCase();
    });
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filterSubject.next(filterValue);
  }

  onRowSelect(row: any) {
    const dialogRef = this.matDialog.open(DialogComponent, {
      width: "50%",
      height: "50%",
      data: row
    })

    dialogRef.afterClosed().subscribe(data => {

        if (data) {

          const index = ELEMENT_DATA.findIndex(element => element.position === data.position);

          if (index !== -1) {
            ELEMENT_DATA[index] = { ...ELEMENT_DATA[index], ...data };
            this.dataSource.data = ELEMENT_DATA.slice();
          }

        }

    })
  }
  
}
