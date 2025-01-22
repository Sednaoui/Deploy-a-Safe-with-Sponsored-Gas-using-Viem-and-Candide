import "dotenv/config"
import { createPublicClient, http, zeroAddress } from "viem"
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts"
import { sepolia } from "viem/chains"
import { createBundlerClient, entryPoint07Address, createPaymasterClient } from "viem/account-abstraction"
import { estimateFeesPerGas } from "viem/actions"
import { toSafeSmartAccount } from "permissionless/accounts"

async function main() {
	const nodeUrl = process.env.NODE_URL as string;
	const bundlerUrl = process.env.BUNDLER_URL;
	const candidePaymasterUrl = process.env.PAYMASTER_URL;

	const client = createPublicClient({
		chain: sepolia,
		transport: http(nodeUrl),
	})

	const paymasterClient = createPaymasterClient({
		transport: http(candidePaymasterUrl),
	});

	const bundlerClient = createBundlerClient({
		client,
		transport: http(bundlerUrl),
		paymaster: paymasterClient,
		paymasterContext: {
			sponsorshipPolicyId: process.env.SPONSORSHIP_POLICY_ID,
		}
	})

	const account = await toSafeSmartAccount({
		client,
		owners: [privateKeyToAccount(generatePrivateKey())],
		entryPoint: {
			address: entryPoint07Address,
			version: "0.7",
		},
		version: "1.4.1",
	})

	console.log(`Smart account address: ${account.address}`);

	const {
		maxFeePerGas,
		maxPriorityFeePerGas
	} = await estimateFeesPerGas(client);

	const userOpHash = await bundlerClient.sendUserOperation({
		account,
		calls: [{
			to: zeroAddress,
			value: 0n,
			data: "0x",
		}],
		maxFeePerGas,
		maxPriorityFeePerGas,
	});

	const receipt = await bundlerClient.waitForUserOperationReceipt({ hash: userOpHash })
	console.log(receipt, "receipt");
}

main()