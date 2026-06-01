export const AppRoles = {
  Client: 'Client',
  Manufacturer: 'Manufacturer',
  ProductManager: 'ProductManager',
  Analyst: 'Analyst',
  SuperAdmin: 'SuperAdmin',
} as const;

export type UserRole = (typeof AppRoles)[keyof typeof AppRoles];
