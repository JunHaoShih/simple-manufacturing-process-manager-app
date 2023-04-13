import { ReturnBase } from 'src/models/ReturnBase';
import { Part } from 'src/modules/parts/models/Part';

export interface PartUsageUses extends ReturnBase {
  usedBy: number,
  uses: Part,
}
