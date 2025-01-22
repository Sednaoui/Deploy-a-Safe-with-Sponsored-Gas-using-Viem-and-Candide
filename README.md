# Setup a Safe Account and sponsor its Gas
## Viem, permissionless and Candide 

This is example showcase how to deploy a Safe account while sponsoring its transactions gas fees using a private gas policy with Candide Paymaster. This example uses Viem and permissionless.js.

## Getting Started

```bash
npm install
npm start
```

## Note on Gas Price Estimate

> Note: Viem tend to overestimate gas prices for AA User Operations. To get a more accurate estimate, we use the `estimateFeesPerGas` method to fetch the current gas prices and add them to the overrides when sending the user operation. This approach ensures you pay a fair block price for gas.

```ts
import { estimateFeesPerGas } from "viem/actions"

const {
    maxFeePerGas,
    maxPriorityFeePerGas
} = await estimateFeesPerGas(client);
```
