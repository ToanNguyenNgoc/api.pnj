import axios from 'axios';

export class CurrencyHelp {
  private baseURL = 'https://api.fastforex.io';
  private apiKey = process.env.EXCHANGE_RATE_CURRENCY_API_KEY;

  async convertVNDToUSD(amountVND: number) {
    const response = await axios.get(
      `${this.baseURL}/fetch-one?api_key=${this.apiKey}&from=USD&to=VND`,
    );
    let amount = amountVND;
    if (response.data?.result?.VND) {
      amount = Number((amount / response.data?.result?.VND).toFixed(2));
    }
    return amount;
  }
}
