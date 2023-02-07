export interface ITable {
  data?: any[];
  columns: {
    header?: string;
    cellField?: string;
    renderField?: (data: any) => string;
  }[];
}
