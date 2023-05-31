import { Injectable, Res } from '@nestjs/common';
import Stripe from 'stripe';
import { AccountDto } from './dtos/account.dto';
import 'dotenv/config';

@Injectable()
export class AppService {
  stripe = new Stripe(process.env.STRIPE_SECRET, {
    apiVersion: '2022-11-15',
  });

  calculateChargeInCents = (items): number => {
    let total = items.map((item) => {
      return item.unitPrice * item.quantity; // considering unitPrice in USD
    });
    const getSum = (total, value) => {
      return total + value;
    };

    let totalAmount = total.reduce(getSum);
    console.log(totalAmount);
    let commission = 4 / 100;
    let charge = totalAmount * commission * 100;

    return charge;
  };

  getHello(): string {
    return 'Hello from stripe payment';
  }

  createAccount = async () => {
    const account = await this.stripe.accounts.create({
      country: 'US',
      type: 'custom',
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
    });
    return account;
  };

  async updateAccount(accId: string) {
    const account = await this.stripe.accounts.update(accId, {
      tos_acceptance: { date: 1609798905, ip: '8.8.8.8' },
    });

    return account;
  }

  async createAccountLink(acc_id: string) {
    const accountLink = await this.stripe.accountLinks.create({
      account: acc_id,
      refresh_url: 'http://localhost:8008/api/v1/stripe/reauth',
      return_url: 'http://localhost:8008/api/v1/stripe/return',
      type: 'account_onboarding',
    });

    console.log(accountLink);
    return accountLink;
  }

  async doPayment() {
    const items = [
      {
        id: 1,
        name: 'Every Padel Åby Arena, GOTHENBURG, SWEDEN',
        description:
          "Play padel at Every Padel in Gothenburg, Sweden in one of the world's finest padel facilities. Every Padel's newly opened padel centre in Gothenburg offers a total of 25 top-class padel courts.",
        images: [
          'https://www.padelrumors.com/wp-content/uploads/2022/01/everypadel.jpg',
        ],
        quantity: 1, // we may set 1 match
        unitPrice: 380, // per match
      },
    ];

    const session = await this.stripe.checkout.sessions.create({
      line_items: items.map((item) => {
        return {
          quantity: item.quantity,
          price_data: {
            currency: 'usd',
            unit_amount: item.unitPrice * 100,
            product_data: {
              name: item.name,
              description: item.description,
              images: item.images,
            },
          },
        };
      }),
      mode: 'payment',
      success_url: 'http://localhost:8008/api/v1/stripe/payment/success',
      cancel_url: 'http://localhost:8008/api/v1/stripe/payment/cancel',
      payment_intent_data: {
        application_fee_amount: this.calculateChargeInCents(items),
        transfer_data: {
          destination: 'acct_1M7ZGND76FV95Zzs',
        },
      },
    });

    return session;
  }

  async getAccounts() {
    const response = await this.stripe.accounts.list();
    return response;
  }

  async getAccount(accId) {
    const response = await this.stripe.accounts.list();
    return response.data.filter((acc) => acc.id === accId)[0];
  }

  // creating acc with all info
  createNewAccount = async () => {
    const account = await this.stripe.accounts.create({
      country: 'US',
      type: 'custom',
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
      business_type: 'individual',
      individual: {
        first_name: 'Charles',
        last_name: 'Jerde',
        email: 'karson87@yahoo.com',
        dob: {
          day: 24,
          month: 6,
          year: 1953,
        },
        address: {
          line1: '215 Gusikowski Flats',
          city: 'Jonesboro',
          postal_code: '76538',
          state: 'TX', // see documentation must cause state shorthand
          country: 'US',
        },
        phone: '+1-907-677-6064',
        ssn_last_4: '0000',
      },
      email: 'karson87@yahoo.com',
      external_account: {
        object: 'bank_account',
        account_number: '000999999991',
        routing_number: '110000000',
        country: 'US',
        currency: 'usd',
      },
      business_profile: {
        mcc: '7997', // see documentation; this code is for country club
        support_url: 'www.xyz.com',
        url: 'www.xyz.com',
      },
      tos_acceptance: {
        date: 1609798905,
        ip: '8.8.8.8',
      },
    });
    return account;
  };
}
