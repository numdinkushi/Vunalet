import hre from "hardhat";
import { stringToBytes, keccak256 } from "viem";

async function main() {
    console.log("Deploying VunaletPayments contract...");

    // Set deployment parameters
    const feeRecipient = process.env.FEE_RECIPIENT_ADDRESS || process.env.NEXT_PUBLIC_PLATFORM_CELO_ADDRESS;
    const secret = process.env.NEXT_PUBLIC_PAYMENT_SECRET || "vunalet_secure_payments";
    
    if (!feeRecipient) {
        throw new Error("FEE_RECIPIENT_ADDRESS or NEXT_PUBLIC_PLATFORM_CELO_ADDRESS environment variable is required");
    }

    // Create secret hash using viem
    const secretHash = keccak256(stringToBytes(secret));

    console.log("Fee recipient:", feeRecipient);
    console.log("Secret hash:", secretHash);

    // Deploy the contract with constructor arguments
    const vunaletPayments = await hre.viem.deployContract("VunaletPayments", [
        feeRecipient,
        secretHash
    ]);

    const contractAddress = vunaletPayments.address;
    console.log("VunaletPayments deployed to:", contractAddress);

    // Get platform fee rate
    const platformFeeRate = await vunaletPayments.read.platformFeeRate();
    console.log("Platform fee rate:", platformFeeRate.toString(), "basis points");

    console.log("\n=== Deployment Summary ===");
    console.log("Contract Address:", contractAddress);
    console.log("Fee Recipient:", feeRecipient);
    console.log("Platform Fee Rate:", (Number(platformFeeRate) / 100).toFixed(1) + "%");
    console.log("Network:", hre.network.name);
    console.log("Secret Hash:", secretHash);

    // Wait for contract to be mined before verification
    console.log("\nWaiting for contract to be mined...");
    await new Promise(resolve => setTimeout(resolve, 30000)); // Wait 30 seconds

    // Verify contract on CeloScan
    console.log("Verifying contract on CeloScan...");
    try {
        await hre.run("verify:verify", {
            address: contractAddress,
            constructorArguments: [feeRecipient, secretHash],
        });
        console.log("✅ Contract verified successfully on CeloScan!");
    } catch (error) {
        console.log("❌ Verification failed:", error);
        console.log("You can verify manually at: https://celoscan.io/verifyContract");
    }

    console.log("\n=== Next Steps ===");
    console.log("1. Update your .env file with:");
    console.log(`   NEXT_PUBLIC_CELO_CONTRACT_ADDRESS=${contractAddress}`);
    console.log("2. Update your frontend configuration");
    console.log("3. Test the contract on CeloScan:", `https://celoscan.io/address/${contractAddress}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    }); 
