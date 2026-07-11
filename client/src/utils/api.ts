const BILLS = "/api/bills";
const AUTH = "/api/auth";
const USERS = "/api/users";

export const API = {
  bills: {
    list: () => BILLS,
    details: (billId: string) => `${BILLS}/${billId}`,
    members: (billId: string) => `${BILLS}/${billId}/members`,
    reminders: (billId: string) => `${BILLS}/${billId}/reminders`,
  },
  auth: {
    login: () => `${AUTH}/login`,
    refresh: () => `${AUTH}/refresh`,
    revoke: () => `${AUTH}/revoke`,
  },
  users: {
    base: () => USERS, // POST to create, PUT to update — same URL, different method
  }
};