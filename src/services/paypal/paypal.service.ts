import { ForbiddenException } from '@nestjs/common';
import axios from 'axios';

type ResCreateTokenType = {
  scope: string;
  access_token: string;
  token_type: string;
  app_id: string;
  expires_in: string;
  nonce: string;
};

export class PaypalService {
  private PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
  private PAYPAL_SECRET_KEY = process.env.PAYPAL_SECRET_KEY;
  private PAYPAL_PAY_URL = process.env.PAYPAL_PAY_URL;
  async createToken() {
    let responseToken: ResCreateTokenType = null;
    try {
      const response = await axios<ResCreateTokenType>({
        url: `${this.PAYPAL_PAY_URL}/v1/oauth2/token`,
        method: 'post',
        data: 'grant_type=client_credentials',
        auth: {
          username: this.PAYPAL_CLIENT_ID,
          password: this.PAYPAL_SECRET_KEY,
        },
      });
      responseToken = response.data;
    } catch (error) {}
    return responseToken;
  }
  async createOrder() {
    const responseToken = await this.createToken();
    if (!responseToken.access_token) {
      throw new ForbiddenException('Cannot create paypal token');
    }
    const responseOrder = await axios({
      url: `${this.PAYPAL_PAY_URL}/v2/checkout/orders`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${responseToken.token_type} ${responseToken.access_token}`,
      },
      data: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            items: [
              {
                name: 'Node.js Complete Course',
                description: 'Node.js Complete Course with Express and MongoDB',
                quantity: 1,
                unit_amount: {
                  currency_code: 'USD',
                  value: '100.00',
                },
              },
            ],

            amount: {
              currency_code: 'USD',
              value: '100.00',
              breakdown: {
                item_total: {
                  currency_code: 'USD',
                  value: '100.00',
                },
              },
            },
          },
        ],

        application_context: {
          return_url: 'https://beautyx.vn',
          cancel_url: 'https://beautyx.vn',
          shipping_preference: 'NO_SHIPPING',
          user_action: 'PAY_NOW',
          brand_name: 'manfra.io',
        },
      }),
    });
    return responseOrder.data;
  }
  async capturePayment(orderId: string) {
    const responseToken = await this.createToken();
    if (!responseToken.access_token) {
      throw new ForbiddenException('Cannot create paypal token');
    }
    try {
      const responsePayment = await axios({
        url: `${this.PAYPAL_PAY_URL}/v2/checkout/orders/${orderId}/capture`,
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${responseToken.token_type} ${responseToken.access_token}`,
        },
      });
      return responsePayment.data;
    } catch (error) {
      console.log(JSON.stringify(error.response.data));
    }
    return;
  }
}
