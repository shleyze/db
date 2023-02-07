import { Component, EventEmitter, Input, Output } from '@angular/core';

import type { ISelect } from './types';
@Component({
  selector: 'ui-select',
  templateUrl: './select.component.html',
})
export class SelectComponent implements ISelect {
  @Input() label: ISelect['label'] = '';
  @Input() options: ISelect['options'] = [];
  @Input() disabled: ISelect['disabled'] = false;
  @Output() onChange: ISelect['onChange'] = new EventEmitter();

  get getOptions() {
    return this.options;
  }

  handleChange(event: Event) {
    this.onChange.emit((event.target as HTMLSelectElement).value);
  }
}
