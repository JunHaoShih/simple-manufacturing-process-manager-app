/**
 * 可自定義類型
 */
export interface CustomizeInterface {
  id: number,
  number: string,
  name: string,
  isSystemDefault: boolean,
  createUser: string,
  createDate: Date,
  updateUser: string,
  updateDate: Date,
  remarks: string | null,
}
