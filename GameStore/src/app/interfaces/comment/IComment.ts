export interface IComment {
  id: string;
  body: string;
  isDeleted: boolean;
  commentDate: string;
  level: number;
  firstName: string;
  lastName: string;
  userId: string;
  avatarUrl: string;
  parentId?: string;
  children: IComment[];
}
