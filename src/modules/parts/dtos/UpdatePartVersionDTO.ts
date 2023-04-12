export interface UpdatePartVersionDTO {
  customValues: Record<string, string>,
  remarks: string | null,
  sourceId: number,
  unitId: number,
}
