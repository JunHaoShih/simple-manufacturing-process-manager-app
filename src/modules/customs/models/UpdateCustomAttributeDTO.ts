import { AttributeType, CustomOption, DisplayType } from './CustomAttribute';

export interface UpdateCustomAttributeDTO {
  number: string,
  name: string,
  attributeType: AttributeType,
  displayType: DisplayType,
  isDisabled: boolean,
  languages: Record<string, string>,
  /**
   * 自訂選項清單
   */
  options: CustomOption[],
  remarks: string | null,
}
