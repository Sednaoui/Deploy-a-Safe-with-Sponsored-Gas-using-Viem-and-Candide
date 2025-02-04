import "dotenv/config"
import axios from 'axios';
import { createPublicClient, http, parseAbi, zeroAddress, maxUint256, getAddress } from "viem"
import { privateKeyToAccount } from "viem/accounts"
import { baseSepolia } from "viem/chains"
import { createBundlerClient, entryPoint07Address, createPaymasterClient } from "viem/account-abstraction"
import { estimateFeesPerGas } from "viem/actions"
import { toSafeSmartAccount } from "permissionless/accounts"

async function main() {
	const nodeUrl = process.env.NODE_URL as string;
	const bundlerUrl = process.env.BUNDLER_URL;
	const candidePaymasterUrl = process.env.PAYMASTER_URL as string;
	const privateKey = process.env.PRIVATE_KEY as `0x${string}`;

	const publicClient = createPublicClient({
		chain: baseSepolia,
		transport: http(nodeUrl),
	});

	const paymasterClient = createPaymasterClient({
		transport: http(candidePaymasterUrl),
	});

	const bundlerClient = createBundlerClient({
		client: publicClient,
		transport: http(bundlerUrl),
		paymaster: paymasterClient,
	});

	// fetch supported erc-20 tokens by the paymaster, its exchange rates, and the paymaster metadata
	const fetchSupportedTokensAndPaymasterData = await axios.post(candidePaymasterUrl, {
		method: 'pm_supportedERC20Tokens',
		params: [entryPoint07Address],
		id: 1,
		jsonrpc: '2.0',
	});
	const supportedTokensAndPaymasterData = fetchSupportedTokensAndPaymasterData.data.result;
	const cttToken = supportedTokensAndPaymasterData.tokens.find((token: any) => token.symbol === 'CTT');
	const paymasterAddress = supportedTokensAndPaymasterData.paymasterMetadata.address;

	const account = await toSafeSmartAccount({
		client: publicClient,
		owners: [privateKeyToAccount(privateKey)],
		entryPoint: {
			address: entryPoint07Address,
			version: "0.7",
		},
		version: "1.4.1",
	});

	console.log(`Smart account address: ${account.address}`);
	console.log("Fund the accout with one of the supported ERC20 Token.This example uses CTT");

	const { maxFeePerGas, maxPriorityFeePerGas } = await estimateFeesPerGas(publicClient);

	// give allowance for the paymaster to spend the erc20 tokens for gas payments
	const userOpHash = await bundlerClient.sendUserOperation({
		maxFeePerGas,
		maxPriorityFeePerGas,
		paymasterContext: {
			token: cttToken.address,
		},
		account,
		calls: [{
			to: cttToken.address,
			abi: parseAbi(["function approve(address,uint)"]),
			functionName: "approve",
			args: [getAddress(paymasterAddress), maxUint256], // max allowance is give to demo a simple example
		},
		{
			to: zeroAddress,
			data: "0x", // a random transaction
		}],
	});
	console.log("Transaction submitted. Waiting for receipt...")

	const receipt = await bundlerClient.waitForUserOperationReceipt({ hash: userOpHash });
	console.log("Transaction executed. Here is the tx hash: ", receipt.userOpHash);
}

main()