import { ViewType } from '../models/Part';

export interface CreatePartDTO {
  number: string,
  name: string,
  remarks: string,
  isEndItem: boolean,
  isPhantom: boolean,
  viewType: ViewType,
  viewSubtypeId: number,
  sourceId: number,
  unitId: number,
}
