export class AccountDto {
  business_type: string;
  individual: {
    first_name: string;
    last_name: string;
    email: string;
    dob: {
      day: number;
      month: number;
      year: number;
    };
    address: {
      line1: string;
      city: string;
      postal_code: string;
      state: string; // see documentation must cause state shorthand, such as Texas == TX
      country: string;
    };
    phone: string;
    ssn_last_4: string;
  };
  email: string;
  external_account: {
    object: string;
    account_number: string;
    routing_number: string;
    country: string;
    currency: string;
  };
  business_profile: {
    mcc: string; // see documentation; this code is for country club
    support_url: string;
    url: string;
  };
}
