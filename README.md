# Bytecode Verification: EarlyChainLetter100ETH

**Contract**: [0x020522bf9b8ed6ff41e2fa6765a17e20e2767d64](https://etherscan.io/address/0x020522bf9b8ed6ff41e2fa6765a17e20e2767d64)
**Deployed**: August 9, 2015 (block 60,143)
**Deployer**: `0xa14cf6cec1c6aae4b608458f6e14692863a937aa`
**Creation tx**: `0xb8b74ca2056ab50a7d90b05abdc87a90f8be02b7c5ae98a4d36dc4afd78163c3`
**Balance**: ~400 ETH (dormant since deployment)

## Result

✅ **Exact bytecode match** — 744 bytes

## Compiler

- **Solidity**: `soljson-v0.1.1+commit.6ff4cd6` (JavaScript build)
- **Optimizer**: ON

## Source

`MyScheme.sol` — a 100 ETH chain-letter Ponzi using a binary tree payout structure.

Three public read functions:
- `getContractBalance()` — returns `treeBalance` (storage slot 0)
- `getNumInvestors()` — returns `numInvestorsMinusOne + 1` (slot 1)
- `getNumNextLevel()` — returns `myTree.length - numInvestorsMinusOne - 1` (available tree slots)

The fallback function accepts 100 ETH deposits, inserts the sender into the tree, and executes
the payout algorithm when a tree level fills up.

**Key difference from the 10 ETH variant** (`0xa327075a`): when `numInvestorsMinusOne <= 2`,
the 100 ETH version simply sets `treeDepth = 1` (no immediate send to `myTree[0]`). The 10 ETH
version sends the entire balance to `myTree[0]` at that point.

## Verification

```bash
node verify.js
```

## Related

- [10 ETH variant](https://github.com/cartoonitunes/chainletter-verification) — `0xa327075af2a223a1c83a36ada1126afe7430f955`
- [EthereumHistory page](https://ethereumhistory.com/contract/0x020522bf9b8ed6ff41e2fa6765a17e20e2767d64)
- [awesome-ethereum-proofs](https://github.com/cartoonitunes/awesome-ethereum-proofs)
