export interface CreateCustomAttributeDTO {
  number: string,
  name: string,
  attributeType: number,
  displayType: number,
  isDisabled: boolean,
  languages: Record<string, string>,
}
