# Setup a Safe Account and pay gas in ERC-20 tokens 
## Candide, Viem, and permissionless.js 

This is example showcase how to deploy a Safe account while sponsoring its transactions gas fees using erc-20 token paymaster with Candide Paymaster.

### Getting Started

#### Setup
- Create an API key on Candide's [Dashboard](https://dashboard.candide.dev)
- Create a .env file from .env.example
```
cp .env.example .env
```

#### Running

```bash
npm install
npm start
```

### Note on Gas Price Estimate

> Note: Viem tend to overestimate gas prices for AA User Operations. To get a more accurate estimate, we use the `estimateFeesPerGas` method to fetch the current gas prices and add them to the overrides when sending the user operation. This approach ensures you pay a fair block price for gas.

```ts
import { estimateFeesPerGas } from "viem/actions"

const {
    maxFeePerGas,
    maxPriorityFeePerGas
} = await estimateFeesPerGas(client);
```
