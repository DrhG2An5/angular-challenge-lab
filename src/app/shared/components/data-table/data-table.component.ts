import { Component, input, output, TemplateRef, contentChild, ContentChild } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';

export interface TableColumn {
  key: string;
  header: string;
  sortable?: boolean;
}

// 🐛 CHALLENGE 18 (Content Projection - ngTemplateOutlet with context):
// This data table accepts a cell template via ContentChild and should
// render each cell using ngTemplateOutlet with a context containing
// the row data and column key. But the context object is malformed.
// HINT: ngTemplateOutlet context needs `$implicit` for the default
// let-variable, and explicit keys for named let-variables.

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [MatTableModule, MatSortModule, MatPaginatorModule, CommonModule],
  template: `
    <div class="table-container">
      <table mat-table [dataSource]="data()" matSort (matSortChange)="sortChange.emit($event)">

        @for (col of columns(); track col.key) {
          <ng-container [matColumnDef]="col.key">
            <th mat-header-cell *matHeaderCellDef mat-sort-header [disabled]="!col.sortable">
              {{ col.header }}
            </th>
            <td mat-cell *matCellDef="let row">
              @if (cellTemplate()) {
                <!-- 🐛 BUG: Context is wrong — should be { $implicit: row[col.key], row: row, column: col } -->
                <ng-container *ngTemplateOutlet="cellTemplate()!; context: { value: row[col.key] }">
                </ng-container>
              } @else {
                {{ row[col.key] }}
              }
            </td>
          </ng-container>
        }

        <tr mat-header-row *matHeaderRowDef="columnKeys()"></tr>
        <tr mat-row *matRowDef="let row; columns: columnKeys()" (click)="rowClick.emit(row)"></tr>
      </table>

      @if (paginate()) {
        <mat-paginator
          [length]="data().length"
          [pageSize]="10"
          [pageSizeOptions]="[5, 10, 25]"
          (page)="pageChange.emit($event)">
        </mat-paginator>
      }
    </div>
  `,
  styles: [`
    .table-container { width: 100%; overflow-x: auto; }
    table { width: 100%; }
    tr.mat-mdc-row:hover { background-color: #f5f5f5; cursor: pointer; }
  `]
})
export class DataTableComponent {
  data = input<any[]>([]);
  columns = input<TableColumn[]>([]);
  paginate = input(true);

  cellTemplate = contentChild<TemplateRef<any>>('cellTemplate');

  columnKeys = input<string[]>([]);

  sortChange = output<Sort>();
  pageChange = output<PageEvent>();
  rowClick = output<any>();
}
