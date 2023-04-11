import { ReturnBase } from 'src/models/ReturnBase';
import { ViewType } from './Part';

export interface PartMaster {
  id: number,
  number: string,
  name: string,
  isEndItem: boolean,
  isPhantom: boolean,
  viewType: ViewType,
  viewSubtypeId: number,
}

export interface PartVersion extends ReturnBase {
  iteration: number,
  revision: number,
  checkout: boolean,
  master: PartMaster,
  customValues: Record<string, string>,
}
