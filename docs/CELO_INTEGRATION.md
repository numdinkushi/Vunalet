# Celo Blockchain Integration Guide

This document provides a complete guide for the Celo blockchain payment integration in Vunalet.

## Overview

The Celo integration allows users to pay for orders using CELO cryptocurrency directly from their Web3 wallets. This is implemented alongside the existing Lisk ZAR stablecoin payment system, giving users multiple payment options.

## Features

- **Dual Payment System**: Users can choose between Lisk ZAR stablecoin or Celo blockchain payments
- **Smart Contract Integration**: Secure payment processing through a custom VunaletPayments smart contract
- **Security Verification**: Frontend-contract verification using secret hash mechanism
- **Flexible Withdrawals**: Multiple withdrawal methods including partial withdrawals and emergency functions
- **Wallet Support**: Compatible with MetaMask, Coinbase Wallet, and WalletConnect
- **Real-time Conversion**: Automatic ZAR to CELO conversion with configurable rates
- **Platform Fees**: Built-in platform fee collection (2.5% by default)
- **Payment Tracking**: Full transaction history and blockchain verification

## Architecture

### Smart Contract
- **Contract**: `VunaletPayments.sol`
- **Features**: Payment processing, fund distribution, platform fees, admin controls
- **Security**: ReentrancyGuard, Pausable, Ownable patterns

### Frontend Components
- **PaymentMethodSelector**: Allows users to choose payment method
- **CeloPayment**: Handles Celo blockchain payments
- **WalletConnect**: Web3 wallet connection interface
- **Web3Provider**: Wagmi configuration for Celo networks

### Database Schema
New fields added to orders table:
- `paymentMethod`: Extended to include 'celo'
- `celoTxHash`: Transaction hash for blockchain verification
- `celoBlockNumber`: Block number for transaction confirmation
- `celoFromAddress`: Wallet address that made the payment
- `celoAmountPaid`: Amount paid in CELO

## Setup Instructions

### 1. Install Dependencies

```bash
cd Vunalet
npm install viem wagmi @tanstack/react-query
```

### 2. Smart Contract Deployment

```bash
# Navigate to contracts directory
cd contracts

# Install contract dependencies
npm install

# Compile contracts
npm run compile

# Deploy to Alfajores testnet (for testing)
npm run deploy:alfajores

# Deploy to Celo mainnet (for production)
npm run deploy:celo
```

### 3. Environment Configuration

Update your `.env` file with the following variables:

```env
# Celo Blockchain Configuration
CELO_PRIVATE_KEY=your_wallet_private_key_for_deployment
CELOSCAN_API_KEY=your_celoscan_api_key_for_verification

# Contract Address (after deployment)
NEXT_PUBLIC_CELO_CONTRACT_ADDRESS=0x_your_deployed_contract_address

# Payment Authorization Secret (for frontend authorization)
NEXT_PUBLIC_PAYMENT_SECRET=your_secure_payment_secret_here

# Wallet Connect Project ID
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_wallet_connect_project_id

# Fee Recipient Address
FEE_RECIPIENT_ADDRESS=0x_your_fee_recipient_wallet_address

# App URL
NEXT_PUBLIC_URL=https://your-app-domain.com
```

### 4. Configuration

#### Conversion Rates
Update conversion rates in `constants/payments.ts`:

```typescript
export const CONVERSION_RATES = {
  ZAR_TO_CELO: 0.003, // 1 ZAR = 0.003 CELO
  CELO_TO_ZAR: 333.33, // 1 CELO = 333.33 ZAR
  PLATFORM_FEE_RATE_PERCENTAGE: 2.5, // 2.5% platform fee
} as const;
```

#### Network Configuration
Networks are configured in `constants/payments.ts`:

```typescript
export const CELO_NETWORKS = {
  MAINNET: {
    chainId: 42220,
    name: 'Celo Mainnet',
    rpcUrl: 'https://forno.celo.org',
    blockExplorer: 'https://celoscan.io',
  },
  ALFAJORES: {
    chainId: 44787,
    name: 'Celo Alfajores Testnet',
    rpcUrl: 'https://alfajores-forno.celo-testnet.org',
    blockExplorer: 'https://alfajores.celoscan.io',
  }
} as const;
```

## Usage

### For Users

1. **Connect Wallet**: Click the "Connect Wallet" button in the header
2. **Choose Payment Method**: During checkout, select between Lisk ZAR or Celo
3. **Confirm Payment**: Review amounts and confirm the blockchain transaction
4. **Track Status**: Monitor payment status in real-time

### For Developers

#### Using PaymentMethodSelector

```typescript
import { PaymentMethodSelector } from '@/components/payments/PaymentMethodSelector';
import { PaymentMethod } from '@/constants';

<PaymentMethodSelector
  zarAmount={100}
  orderId="order_123"
  farmerAddress="0x..."
  dispatcherAddress="0x..."
  farmerZarAmount={80}
  dispatcherZarAmount={15}
  onPaymentSuccess={(paymentId, method) => {
    console.log(`Payment successful: ${paymentId} via ${method}`);
  }}
  onPaymentError={(error) => {
    console.error('Payment failed:', error);
  }}
/>
```

#### Using Celo Payment Hook

```typescript
import { useCeloPayment } from '@/hooks/use-celo-payment';

const { processCeloPayment, handlePaymentError, isProcessing } = useCeloPayment({
  orderId: "cm5abc123",
  zarAmount: 100
});

// Process payment after transaction confirmation
const result = await processCeloPayment(txHash, blockNumber);
if (result.success) {
  console.log('Payment processed successfully');
} else {
  console.error('Payment failed:', result.error);
}
```

## Smart Contract Functions

### Main Functions

- `processOrderPayment()`: Process a payment and distribute funds (with frontend authorization)
- `getPayment()`: Get payment details for an order
- `getUserStats()`: Get user payment statistics

### Admin Functions

- `setPlatformFeeRate()`: Update platform fee rate
- `setFeeRecipient()`: Update fee recipient address
- `setSecretHash()`: Update the secret hash for frontend authorization
- `withdraw()`: Withdraw specific amount
- `withdrawTo()`: Withdraw to specific address
- `pause()/unpause()`: Emergency controls
- `emergencyWithdraw()`: Emergency fund withdrawal (full balance)

## Security Considerations

1. **Smart Contract Security**:
   - Uses OpenZeppelin security patterns
   - ReentrancyGuard prevents reentrancy attacks
   - Pausable for emergency stops
   - Ownable for admin controls

2. **Frontend Security**:
   - Input validation on all payment data
   - Proper error handling and user feedback
   - Secure environment variable handling

3. **Network Security**:
   - Network validation before transactions
   - Transaction confirmation waiting
   - Proper gas estimation

## Testing

### Local Testing

1. **Start local development**:
   ```bash
   npm run dev
   ```

2. **Test on Alfajores testnet**:
   - Get testnet CELO from faucet
   - Deploy contract to Alfajores
   - Test all payment flows

### Production Deployment

1. **Deploy to Celo mainnet**:
   ```bash
   npm run deploy:celo
   ```

2. **Verify contract**:
   ```bash
   npm run verify:celo
   ```

3. **Update environment variables** with production addresses

## Monitoring and Analytics

### Transaction Monitoring

- Monitor smart contract events for payment processing
- Track payment success/failure rates
- Monitor gas usage and optimization opportunities

### User Analytics

- Payment method preferences
- Conversion rates between payment methods
- User wallet adoption metrics

## Troubleshooting

### Common Issues

1. **"Contract address not configured"**:
   - Ensure `NEXT_PUBLIC_CELO_CONTRACT_ADDRESS` is set
   - Verify contract is deployed to the correct network

2. **"Please switch to Celo network"**:
   - User needs to add Celo network to their wallet
   - Provide network configuration details

3. **"Transaction failed"**:
   - Check user has sufficient CELO balance
   - Verify gas estimation is correct
   - Check network connectivity

### Support Resources

- [Celo Documentation](https://docs.celo.org/)
- [Wagmi Documentation](https://wagmi.sh/)
- [Viem Documentation](https://viem.sh/)

## Future Enhancements

1. **Multi-token Support**: Support for cUSD, cEUR, and other Celo assets
2. **Mobile Wallet Integration**: Better mobile wallet support
3. **Payment Scheduling**: Recurring payments and subscriptions
4. **Advanced Analytics**: Detailed payment analytics dashboard
5. **Cross-chain Support**: Integration with other blockchains

## Contributing

When contributing to the Celo integration:

1. Follow the existing code patterns and conventions
2. Use the established enums and constants
3. Add proper TypeScript types
4. Include comprehensive error handling
5. Update documentation for any new features

## License

This integration follows the same licensing terms as the main Vunalet project. 