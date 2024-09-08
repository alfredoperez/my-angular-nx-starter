import { ColDef } from 'ag-grid-community';

// TODO: move this to data viewer
function dateFormatter(params: { value: string }) {
  return new Date(params.value).toLocaleDateString();
}

// TODO: move this to data viewer
export const columnDefs: Array<ColDef> = [
  { field: 'name' },
  { field: 'age' },
  { field: 'createdAt', valueFormatter: dateFormatter },
  { field: 'email' },
  { field: 'company' },
  { field: 'title' },
  { field: 'updatedAt', valueFormatter: dateFormatter }
];
