import hre from "hardhat";
import { keccak256, toBytes } from "viem";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

async function main() {
    // Get the fee recipient address from environment or use a default
    const feeRecipient = process.env.FEE_RECIPIENT_ADDRESS || "0x0000000000000000000000000000000000000000";

    if (feeRecipient === "0x0000000000000000000000000000000000000000") {
        throw new Error("FEE_RECIPIENT_ADDRESS must be set in environment variables");
    }

    // Generate secret hash for frontend authorization
    const secret = process.env.NEXT_PUBLIC_PAYMENT_SECRET || "vunalet_secure_payments";
    const secretHash = keccak256(toBytes(secret));

    console.log("Deploying VunaletPayments contract...");
    console.log("Fee recipient:", feeRecipient);
    console.log("Secret hash:", secretHash);

    const VunaletPayments = await hre.viem.deployContract("VunaletPayments", [
        feeRecipient as `0x${string}`,
        secretHash
    ]);

    const address = VunaletPayments.address;
    console.log(`VunaletPayments deployed to: ${address}`);

    // Log important information
    console.log("\n=== Deployment Summary ===");
    console.log(`Contract Address: ${address}`);
    console.log(`Fee Recipient: ${feeRecipient}`);
    console.log(`Platform Fee Rate: 2.5% (250 basis points)`);
    console.log(`Network: ${process.env.HARDHAT_NETWORK || 'localhost'}`);

    console.log("\n=== Next Steps ===");
    console.log(`1. Update NEXT_PUBLIC_CELO_CONTRACT_ADDRESS in your .env file:`);
    console.log(`   NEXT_PUBLIC_CELO_CONTRACT_ADDRESS=${address}`);
    console.log(`2. Verify the contract on the block explorer if deploying to mainnet`);
    console.log(`3. Test the contract with small amounts first`);

    return address;
}

main()
    .then((address) => {
        console.log(`\nDeployment successful! Contract address: ${address}`);
        process.exit(0);
    })
    .catch((error) => {
        console.error("Deployment failed:", error);
        process.exit(1);
    }); 