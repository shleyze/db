import type { EventEmitter } from '@angular/core';

export interface ISelectOption {
  id: string;
  label: string;
}

export interface ISelect {
  label?: string | null;
  options: ISelectOption[] | null;
  disabled?: boolean;
  onChange: EventEmitter<string>;
}
