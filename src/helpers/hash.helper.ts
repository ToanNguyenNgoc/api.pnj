import * as bcrypt from 'bcrypt';
import moment from 'moment';
import { aesDecode, aesEncode } from 'src/utils';

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
  createVerificationCode(email: string) {
    return aesEncode(
      JSON.stringify({
        email,
        expired_at: moment().add(2, 'minutes'),
      }),
    );
  }
  compareVerificationCode(code: string) {
    let data;
    let dateValid = false;
    try {
      data = JSON.parse(aesDecode(code));
    } catch (error) {}
    if (data?.expired_at) {
      dateValid = moment().isBefore(data.expired_at);
    }
    return {
      data,
      dateValid,
    };
  }
}
