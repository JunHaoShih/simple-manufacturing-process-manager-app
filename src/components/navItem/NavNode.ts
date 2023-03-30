export interface NavNode{
  title: string,
  caption: string,
  icon?: string,
  to?: string,
  children?: NavNode[],
}
