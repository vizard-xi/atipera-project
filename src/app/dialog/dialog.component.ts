import { Component, inject, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {MatListModule} from '@angular/material/list';
import { PeriodicElement } from '../periodic-element/periodic-element';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [MatDialogModule, FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatListModule, MatButtonModule, MatIconModule ],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.css'
})
export class DialogComponent {

  dialogPositionColumn: any;
  dialogNameColumn: any;
  dialogWeightColumn: any = new FormControl('', [Validators.required, Validators.pattern('^[0-9]+$')]);
  dialogSymbolColumn: any;
  private _snackBar = inject(MatSnackBar);

  constructor(private matDialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) private dialogData: PeriodicElement) {
      this.dialogPositionColumn = this.dialogData.position;
      this.dialogNameColumn = this.dialogData.name;
      this.dialogWeightColumn = this.dialogData.weight;
      this.dialogSymbolColumn = this.dialogData.symbol;      
    }

    onSubmit() {
      this.matDialogRef.close({
        position: this.dialogPositionColumn,
        name: this.dialogNameColumn,
        weight: this.dialogWeightColumn,
        symbol: this.dialogSymbolColumn
      })
    }

    submitNotification() {
      this._snackBar.open('Update was successfully', 'Ok', {
        horizontalPosition: "right",
        verticalPosition: "top",
        duration: 5000,
      });
    }
}
