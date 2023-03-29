import { SelectOption } from 'src/models/SelectOption';

export enum ViewType {
  Design = 'Design',
  Manufacturing = 'Manufacturing',
}

export type ViewTypeOption = SelectOption<ViewType>

export interface PartVersion {
  id: number,
  masterId: number,
  iteration: number,
  revision: number,
  checkout: boolean,
  createUser: string,
  createDate: Date,
  updateUser: string,
  updateDate: Date,
  remarks: string | null,
}

export interface Part {
  id: number,
  number: string,
  name: string,
  isEndItem: boolean,
  isPhantom: boolean,
  viewType: ViewType,
  viewSubtypeId: number,
  checkout: boolean,
  checkoutId: number | null,
  createUser: string,
  createDate: Date,
  updateUser: string,
  updateDate: Date,
  remarks: string | null,
  version: PartVersion,
}
