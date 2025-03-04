import * as bcrypt from 'bcrypt';
import moment from 'moment';
import { aesDecode, aesEncode } from 'src/utils';
import jwt from 'jsonwebtoken';
import { BadRequestException } from '@nestjs/common';

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
  createToken(text: string, expiresIn: string) {
    const accessToken = jwt.sign(
      {
        ctx: text,
      },
      String(process.env.JWT_SECRET_KEY),
      { expiresIn },
    );
    return accessToken;
  }
  async verifyToken(token: string) {
    let payload;
    jwt.verify(
      token,
      String(process.env.JWT_SECRET_KEY),
      async (error, jwtDecode) => {
        if (error) return;
        payload = jwtDecode;
      },
    );
    return payload;
  }
  async getEmail(token: string) {
    let email;
    try {
      email = aesDecode((await this.verifyToken(token)).ctx);
    } catch (error) {
      throw new BadRequestException('Invalid verification token');
    }
    if (!email) throw new BadRequestException('Invalid verification token');
    return email;
  }
}
