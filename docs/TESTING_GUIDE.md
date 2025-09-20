# Celo Integration Testing Guide

This guide walks you through testing the Celo payment integration from local development to production deployment.

## Prerequisites

Before testing, ensure you have:
- Node.js installed
- A Celo wallet (MetaMask or Coinbase Wallet)
- Some test CELO tokens for Alfajores testnet

## Testing Phases

### Phase 1: Local Contract Testing

#### 1.1 Compile Contracts
```bash
cd contracts
npm install
npx hardhat compile
```

#### 1.2 Run Local Tests (Optional)
```bash
# Run contract unit tests
npx hardhat test
```

### Phase 2: Alfajores Testnet Deployment

#### 2.1 Get Test Tokens
1. **Get Alfajores CELO**: Visit [Celo Faucet](https://faucet.celo.org/)
2. **Connect your wallet** to Alfajores testnet
3. **Request test CELO** (you'll need ~1 CELO for testing)

#### 2.2 Set Up Environment Variables
Create a `.env` file in the root directory:

```bash
# Required for deployment
CELO_PRIVATE_KEY=0x_your_wallet_private_key_here
FEE_RECIPIENT_ADDRESS=0x_your_wallet_address_here
NEXT_PUBLIC_PAYMENT_SECRET=vunalet_secure_payments_2024

# Optional but recommended
CELOSCAN_API_KEY=your_celoscan_api_key
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_wallet_connect_project_id
NEXT_PUBLIC_URL=http://localhost:3000

# Divvi (optional)
NEXT_PUBLIC_DIVVI_CONSUMER_ADDRESS=0x_your_divvi_consumer_address
```

**Important Security Notes:**
- Never commit your private key to version control
- Use a separate wallet for testing, not your main wallet
- The private key should be for the wallet that will deploy the contract

#### 2.3 Deploy to Alfajores Testnet
```bash
cd contracts
npx hardhat run scripts/deploy.ts --network alfajores
```

Expected output:
```
Deploying VunaletPayments contract...
Fee recipient: 0x_your_address
Secret hash: 0x_hash_value
VunaletPayments deployed to: 0x_contract_address

=== Deployment Summary ===
Contract Address: 0x_contract_address
Fee Recipient: 0x_your_address
Platform Fee Rate: 2.5% (250 basis points)
Network: alfajores
```

#### 2.4 Update Frontend Configuration
Copy the deployed contract address and update your `.env`:
```bash
NEXT_PUBLIC_CELO_CONTRACT_ADDRESS=0x_your_deployed_contract_address
```

### Phase 3: Frontend Integration Testing

#### 3.1 Start Development Server
```bash
cd .. # Back to main Vunalet directory
npm run dev
```

#### 3.2 Test Wallet Connection
1. **Open your app** in browser (usually http://localhost:3000)
2. **Navigate to a product** and try to make a purchase
3. **Select Celo payment** method
4. **Connect your wallet** - should show Alfajores network
5. **Verify network detection** - should show "Alfajores" badge

#### 3.3 Test Payment Flow
1. **Select a product** and add to cart
2. **Choose Celo payment** method
3. **Review payment details**:
   - ZAR amount should convert to CELO
   - Platform fee should be calculated
   - Farmer/dispatcher amounts should be shown
4. **Click "Pay with Celo"**
5. **Approve transaction** in your wallet
6. **Wait for confirmation** - should show success message
7. **Check transaction** on [Alfajores Explorer](https://explorer.celo.org/alfajores)

#### 3.4 Test Error Scenarios
- **Insufficient balance**: Try payment with low CELO balance
- **Wrong network**: Switch to Ethereum mainnet and try payment
- **Rejected transaction**: Cancel the transaction in wallet
- **Disconnected wallet**: Disconnect wallet during payment

### Phase 4: Production Deployment

#### 4.1 Get Real CELO Tokens
- Buy CELO from exchanges (Coinbase, Binance, etc.)
- Transfer to your deployment wallet

#### 4.2 Update Environment for Mainnet
```bash
# Use mainnet configuration
CELO_PRIVATE_KEY=0x_your_mainnet_private_key
FEE_RECIPIENT_ADDRESS=0x_your_mainnet_fee_address
```

#### 4.3 Deploy to Celo Mainnet
```bash
cd contracts
npx hardhat run scripts/deploy.ts --network celo
```

#### 4.4 Update Production Environment
Update your production `.env` with the mainnet contract address.

## Testing Checklist

### Smart Contract ✅
- [ ] Contract compiles without errors
- [ ] Deployment succeeds on testnet
- [ ] Contract functions work as expected
- [ ] Fee calculations are correct
- [ ] Withdrawal functions work (owner only)

### Frontend Integration ✅
- [ ] Wallet connection works
- [ ] Network detection is accurate
- [ ] Payment amounts display correctly
- [ ] Transaction flow completes successfully
- [ ] Error handling works properly
- [ ] Success/failure states show correctly

### Security ✅
- [ ] Secret verification prevents unauthorized calls
- [ ] Only owner can call admin functions
- [ ] Platform fees are calculated correctly
- [ ] Funds are distributed properly

### Divvi Integration ✅
- [ ] Referral tracking works after successful payments
- [ ] Fails gracefully if Divvi is unavailable
- [ ] Doesn't break payment flow

## Troubleshooting

### Common Issues

**Contract Deployment Fails**
- Check you have enough CELO for gas
- Verify private key is correct (64 characters without 0x)
- Ensure fee recipient address is valid

**Frontend Can't Connect**
- Verify contract address in environment
- Check wallet is on correct network
- Ensure RPC endpoints are accessible

**Payment Fails**
- Check wallet has sufficient CELO
- Verify contract address is correct
- Ensure payment secret matches deployed contract

**Network Issues**
- Switch to correct network in wallet
- Check RPC endpoint configuration
- Verify chain ID matches

### Getting Help

1. **Check browser console** for error messages
2. **Verify transaction** on block explorer
3. **Test with small amounts** first
4. **Use testnet** for debugging

## Next Steps

After successful testing:
1. **Monitor transactions** on mainnet
2. **Set up monitoring** for contract events
3. **Test edge cases** with real users
4. **Implement analytics** for payment tracking
5. **Consider upgradeability** for future improvements

## Resources

- [Celo Documentation](https://docs.celo.org/)
- [Alfajores Faucet](https://faucet.celo.org/)
- [Celo Explorer](https://explorer.celo.org/)
- [WalletConnect](https://cloud.walletconnect.com/)
- [Divvi Documentation](https://docs.divvi.io/) 