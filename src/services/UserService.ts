import HttpService from "./HttpService";

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
}

export const userService = new HttpService<User>("users");

// ponytail: instance covers 95% cases. Need custom User logic? Use:
// export class UserService extends HttpService<User> {
//   constructor() { super("users"); }
//   getByUsername(username: string) { ... }
// }
// export default new UserService();
