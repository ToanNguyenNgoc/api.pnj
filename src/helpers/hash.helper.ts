import * as bcrypt from 'bcrypt';

export class HashHelper {
  async hash(password: string) {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    return passwordHash;
  }
  async compare(bodyPassword: string, userPassword: string) {
    const matched = await bcrypt.compare(bodyPassword, userPassword);
    return matched;
  }
}
