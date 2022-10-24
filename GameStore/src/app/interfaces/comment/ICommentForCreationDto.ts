export interface ICommentForCreationDto {
  body: string;
  level: number;
  parentId?: string;
  gameId: string;
}
