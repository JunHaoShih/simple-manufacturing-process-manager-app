import { ReturnBase } from 'src/models/ReturnBase';
import { SelectOption } from 'src/models/SelectOption';

export enum ViewType {
  Design = 0,
  Manufacturing = 1,
}

export type ViewTypeOption = SelectOption<ViewType>

export interface PartVersionInfo extends ReturnBase {
  masterId: number,
  iteration: number,
  revision: number,
  checkout: boolean,
  sourceId: number,
  unitId: number,
}

export interface Part extends ReturnBase {
  number: string,
  name: string,
  isEndItem: boolean,
  isPhantom: boolean,
  viewType: ViewType,
  viewSubtypeId: number,
  checkout: boolean,
  checkoutId: number | null,
  version: PartVersionInfo,
  customValues: Record<string, string>,
}
