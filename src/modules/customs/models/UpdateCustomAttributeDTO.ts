import { AttributeType, DisplayType } from './CustomAttribute';

export interface UpdateCustomAttributeDTO {
  number: string,
  name: string,
  attributeType: AttributeType,
  displayType: DisplayType,
  isDisabled: boolean,
  languages: Record<string, string>,
  remarks: string | null,
}
