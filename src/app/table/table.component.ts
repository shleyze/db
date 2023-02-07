import { Component, Input } from '@angular/core';

import type { ITable } from './types';
@Component({
  selector: 'ui-table',
  templateUrl: './table.component.html',
})
export class TableComponent implements ITable {
  @Input() data: ITable['data'] = [];
  @Input() columns: ITable['columns'] = [];
}
