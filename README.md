# Stripe API For Payment Processing

This project is a NestJS application that integrates with the Stripe API to handle payment processing. It provides endpoints for creating payment intents and handling webhooks.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Running the Application](#running-the-application)
- [Contributing](#contributing)
- [License](#license)

## Features

- Create payment intents
- Handle Stripe webhooks
- Configurable environment variables for sensitive data

## Technologies Used

- [NestJS](https://nestjs.com/)
- [Stripe](https://stripe.com/docs/api)
- [TypeScript](https://www.typescriptlang.org/)
- [Node.js](https://nodejs.org/)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/etanami/stripe-backend
   cd stripe-backend
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add your Stripe secret key:
   ```plaintext
   STRIPE_SECRET_KEY=your_stripe_secret_key
   ```

## Configuration

Make sure to set up the following environment variables in your `.env` file:

- `STRIPE_SECRET_KEY`: Your Stripe secret key, which you can find in your Stripe dashboard.

## Usage

### API Endpoints

- **Create Payment Intent**

  - **Endpoint**: `POST /payments/create-payment-intent`
  - **Request Body**:
    ```json
    {
      "amount": 4999,
      "currency": "usd"
    }
    ```
  - **Response**: Returns the payment intent object.

- **Webhook Endpoint**
  - **Endpoint**: `POST /payments/webhook`
  - **Request Body**: Raw JSON body from Stripe.
  - **Response**: Acknowledges receipt of the webhook.

## Running the Application

To start the application, run the following command:

```
npm run start:dev
```

The application will be running on `http://localhost:4242`.

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
