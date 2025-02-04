# Setup a Safe Account and Sponsor its Gas
## Viem, permissionless.js and Candide 

## Examples

These examples showcase how using Candide Bundler and Paymaster API using [Viem AA](https://viem.sh/account-abstraction) and [permissionless.js](https://docs.pimlico.io/permissionless) supported smart accounts.

### Setup your .env

Get your Bundler and Paymaster endpoints from [dashboard.candide.dev](https://dashboard.candide.dev)
```
cp .env.example .env
```

### Install dependencies and run

```bash
npm install
npm start
```

> [!TIP]
> Viem tend to overestimate gas prices for AA User Operations. To get a more accurate estimate, we use the `estimateFeesPerGas` method to fetch the current gas prices and add them to the overrides when sending the user operation. This approach ensures you pay a fair block price for gas.

```ts
import { estimateFeesPerGas } from "viem/actions"

const {
    maxFeePerGas,
    maxPriorityFeePerGas
} = await estimateFeesPerGas(client);
```
