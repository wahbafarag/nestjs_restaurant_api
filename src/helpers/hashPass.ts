import * as bcrypt from 'bcrypt';

export default class Helpers {
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }
}
