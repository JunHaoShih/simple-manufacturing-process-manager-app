import { CustomizeInterface } from 'src/models/CustomizeInterface';
import { SelectOption } from 'src/models/SelectOption';

export enum DisplayType {
  Value = 0,
  SingleSelect = 1,
}

export enum AttributeType {
  String = 0,
}

export type AttributeTypeOption = SelectOption<AttributeType>

export type DisplayTypeOption = SelectOption<DisplayType>

export interface CustomAttribute extends CustomizeInterface {
  attributeType: AttributeType,
  displayType: DisplayType,
  isDisabled: boolean,
}
