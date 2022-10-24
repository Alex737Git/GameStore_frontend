export const commentsRoutes = {
  getComments: (id: string) => `comments/game/${id}`,
  getComment: (id: string) => `comments/${id}`,
  createComment: 'comments',
  updateComment: `comments`,
  deleteComment: (id: string) => `comments/${id}`,
};
