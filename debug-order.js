// Debug script to check order data
// Run this in your browser console when viewing an order

// Check if the order has CELO addresses
console.log('=== ORDER DEBUG INFO ===');
console.log('Order ID:', window.currentOrder?._id);
console.log('Payment Method:', window.currentOrder?.paymentMethod);
console.log('CELO Farmer Address:', window.currentOrder?.celoFarmerAddress);
console.log('CELO Dispatcher Address:', window.currentOrder?.celoDispatcherAddress);
console.log('CELO Platform Address:', window.currentOrder?.celoPlatformAddress);
console.log('Total Cost:', window.currentOrder?.totalCost);
console.log('Farmer Amount:', window.currentOrder?.farmerAmount);
console.log('Dispatcher Amount:', window.currentOrder?.dispatcherAmount);

// Check contract configuration
console.log('=== CONTRACT DEBUG INFO ===');
console.log('Contract Address:', process.env.NEXT_PUBLIC_CELO_CONTRACT_ADDRESS);
console.log('Payment Secret:', process.env.NEXT_PUBLIC_PAYMENT_SECRET);

// Check if addresses are valid
const hasValidAddresses = window.currentOrder?.celoFarmerAddress && 
                         window.currentOrder?.celoDispatcherAddress && 
                         window.currentOrder?.celoPlatformAddress;

console.log('Has Valid CELO Addresses:', hasValidAddresses);

if (!hasValidAddresses) {
    console.error('❌ MISSING CELO ADDRESSES - This will cause payment to fail!');
} else {
    console.log('✅ CELO addresses are present');
}
