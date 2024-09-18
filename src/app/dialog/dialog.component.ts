import { Component, inject, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatListModule } from '@angular/material/list';
import { PeriodicElement } from '../periodic-element/periodic-element';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [MatDialogModule, FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatListModule, MatButtonModule, MatIconModule, CommonModule],
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent {

  dialogPositionColumn: any;
  dialogNameColumn = new FormControl('', [Validators.required, Validators.pattern('^[A-Za-z ]+$')]);
  dialogWeightColumn = new FormControl('', [Validators.required, Validators.pattern('^[0-9]*[.]?[0-9]+$')]);
  dialogSymbolColumn = new FormControl('', [Validators.required, Validators.pattern('^[A-Za-z0-9]+$')]);

  private _snackBar = inject(MatSnackBar);

  constructor(private matDialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) private dialogData: PeriodicElement) {
      
      this.dialogPositionColumn = this.dialogData.position;
      this.dialogNameColumn.setValue(this.dialogData.name);
      this.dialogWeightColumn.setValue(this.dialogData.weight.toString());
      this.dialogSymbolColumn.setValue(this.dialogData.symbol);
    }

  onSubmit(): void {
    if (this.dialogNameColumn.valid && 
      this.dialogWeightColumn.valid && 
      this.dialogSymbolColumn.valid) {
      
        this.matDialogRef.close({
        position: this.dialogPositionColumn,
        name: this.dialogNameColumn.value,
        weight: this.dialogWeightColumn.value,
        symbol: this.dialogSymbolColumn.value
      
      });

      this.snackBarMessage('Update was successful', 'Close');

    }
    else {
      this.snackBarMessage('Invalid Input', 'Close');
    }
  }

  snackBarMessage(message: string, action: string): void {
    this._snackBar.open(message, action, {
      horizontalPosition: 'right',
      verticalPosition: 'top',
      duration: 5000
    });
  }

}
