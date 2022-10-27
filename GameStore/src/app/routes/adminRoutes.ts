export const adminRoutes = {
  deleteUser: (userId: string) => `admin/user/${userId}`,
  allRoles: 'admin/allRoles',
  updateUserRole: 'admin/editUserRole',
  getAllUsers: 'admin/allUsers',
};
