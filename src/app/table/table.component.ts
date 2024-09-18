import { Component, OnInit, ChangeDetectionStrategy, inject, ViewChild } from '@angular/core';
import { PeriodicElement } from '../periodic-element/periodic-element';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { RxState } from '@rx-angular/state';
import { rxEffects } from '@rx-angular/state/effects';
import { map, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { TableState } from '../table-state/table-state';
import { FormControl } from '@angular/forms';

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
];

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [MatTableModule, MatFormFieldModule, MatInputModule, MatDialogModule],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RxState]
})
export class TableComponent implements OnInit {

  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  state = inject(RxState<TableState>);
  filterControl = new FormControl('');

  constructor(private matDialog: MatDialog) {
    this.state.set({ filterValue: '', data: ELEMENT_DATA });

    const effects = rxEffects();

    effects.register(
      this.state.select('filterValue').pipe(
        debounceTime(2000),
        distinctUntilChanged(),
        map(filterValue => filterValue.trim().toLowerCase())
      ),
      filterValue => {
        this.state.set('filterValue', () => filterValue);
        this.filterData();
      }
    );
  }

  ngOnInit(): void {

    this.state
      .select('data')
      .subscribe(data => {
        this.dataSource.data = data;
      });

  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.state.set('filterValue', () => filterValue);
  }

  filterData(): void {
    const filterValue = this.state.get('filterValue');
    this.dataSource.filter = filterValue;
  }

  onRowSelect(row: PeriodicElement): void {
    const dialogRef = this.matDialog.open(DialogComponent, {
      width: "50%",
      height: "50%",
      data: row
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        const updatedData = this.state.get('data').map((element: { position: any; }) =>
          element.position === data.position ? { ...element, ...data } : element
        );
        this.state.set('data', () => updatedData);
      }
    });
  }
}
