export const ADMIN_ROLE = 'Admin';
export const MEDSISTER_ROLE = 'Medsister';
export const USER_ROLE = 'User';

export const getRole = (index) => {
  if (index == 0) return ADMIN_ROLE;
  else if (index == 1) return MEDSISTER_ROLE;
  else return USER_ROLE;
};