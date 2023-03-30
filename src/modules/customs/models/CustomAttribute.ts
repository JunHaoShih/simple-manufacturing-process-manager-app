import { CustomizeInterface } from 'src/models/CustomizeInterface';

export interface CustomAttribute extends CustomizeInterface {
  attributeType: number,
  displayType: number,
  isDisabled: boolean,
}
