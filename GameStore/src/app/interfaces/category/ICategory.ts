export interface ICategory {
  id: string;
  title: string | undefined;
  body: string | undefined;
  level: number;
  children: ICategory[];
}
