# Verification Proof: EarlyChainLetter100ETH

**Contract:** [`0x020522bf9b8ed6ff41e2fa6765a17e20e2767d64`](https://etherscan.io/address/0x020522bf9b8ed6ff41e2fa6765a17e20e2767d64)
**Block:** 60,143 (August 8, 2015)
**Deployer:** `0xa14cf6cec1c6aae4b608458f6e14692863a937aa`

## What is this?

One of the earliest chain-letter investment contracts on Ethereum, deployed just 8 days after mainnet launch. Accepts 100 ETH per entry and redistributes funds to earlier participants in a tree structure. Currently holds ~400 ETH.

The contract uses a tree-based payout scheme: as the tree grows, payouts of 50 ETH per investor go to the newest level, then remaining balance is distributed proportionally up the tree. Unlike its 10 ETH sibling, this version does NOT pay out to the root during the first 3 investments — it only sets the tree depth.

## Source Code

```solidity
contract MyScheme {
    uint treeBalance;
    uint numInvestorsMinusOne;
    uint treeDepth;
    address[] myTree;

    function MyScheme() {
        treeBalance = 0;
        myTree.length = 6;
        myTree[0] = msg.sender;
        numInvestorsMinusOne = 0;
    }

    function getContractBalance() constant returns (uint a) {
        return treeBalance;
    }

    function getNumInvestors() constant returns (uint a) {
        return numInvestorsMinusOne + 1;
    }

    function getNumNextLevel() constant returns (uint a) {
        return myTree.length - numInvestorsMinusOne - 1;
    }

    function() {
        uint amount = msg.value;
        if (amount >= 100000000000000000000) {
            numInvestorsMinusOne += 1;
            myTree[numInvestorsMinusOne] = msg.sender;
            amount -= 100000000000000000000;
            treeBalance += 100000000000000000000;
            if (numInvestorsMinusOne <= 2) {
                treeDepth = 1;
            } else if (numInvestorsMinusOne + 1 == myTree.length) {
                for (uint i = myTree.length - 3 * (treeDepth + 1); i < myTree.length - treeDepth - 2; i++) {
                    myTree[i].send(50000000000000000000);
                    treeBalance -= 50000000000000000000;
                }
                uint eachLevelGets = treeBalance / (treeDepth + 1) - 1;
                uint numInLevel = 1;
                for (i = 0; i < myTree.length - treeDepth - 2; i++) {
                    myTree[i].send(eachLevelGets / numInLevel - 1);
                    treeBalance -= eachLevelGets / numInLevel - 1;
                    if (numInLevel * (numInLevel + 1) / 2 - 1 == i) {
                        numInLevel += 1;
                    }
                }
                myTree.length += treeDepth + 3;
                treeDepth += 1;
            }
        }
        treeBalance += amount;
    }
}
```

## Compiler

- **Version:** soljson v0.1.1+commit.6ff4cd6
- **Binary:** [soljson-v0.1.1+commit.6ff4cd6.js](https://binaries.soliditylang.org/bin/soljson-v0.1.1+commit.6ff4cd6.js)
- **Optimizer:** ON
- **Match:** Byte-for-byte identical, all 903 bytes of creation bytecode

## Verification

```bash
curl -o soljson-v0.1.1.js https://binaries.soliditylang.org/bin/soljson-v0.1.1+commit.6ff4cd6.js
npm install solc
node verify.js
```

## Function Selectors

| Selector | Function | Description |
|----------|----------|-------------|
| `0x6f9fb98a` | `getContractBalance()` | Returns accumulated tree balance |
| `0x72ea4b8c` | `getNumInvestors()` | Returns number of investors |
| `0xb521a81d` | `getNumNextLevel()` | Returns slots remaining until next payout |

## Files

- `MyScheme.sol` - Source code
- `verify.js` - Verification script
- `onchain-creation.hex` - Creation bytecode from deployment tx

## Differences from 10 ETH Version

This contract is a variant of the [EarlyChainLetter10ETH](https://github.com/cartoonitunes/chainletter-verification) contract, with these differences:

| Feature | 10 ETH Version | 100 ETH Version |
|---------|---------------|-----------------|
| Entry cost | 10 ETH | 100 ETH |
| Payout per node | 5 ETH | 50 ETH |
| Early investor payout | Sends balance to root | Only sets tree depth |
| Additional getters | None | `getContractBalance()`, `getNumNextLevel()` |
| Return style | Named returns (`a = x`) | Explicit returns (`return x`) |
| Deployer | `0x881b0A...` | `0xa14cf6...` |

## On-chain Data

- **Creation tx:** [`0xb8b74ca2056ab50a7d90b05abdc87a90f8be02b7c5ae98a4d36dc4afd78163c3`](https://etherscan.io/tx/0xb8b74ca2056ab50a7d90b05abdc87a90f8be02b7c5ae98a4d36dc4afd78163c3)
- **Entry cost:** 100 ETH per investor
- **Current balance:** ~400 ETH (frozen — tree never filled)

## Context

Chain-letter and pyramid contracts were among the earliest "applications" deployed on Ethereum. Before DeFi, before NFTs, before DAOs — people were experimenting with financial incentive structures on-chain. This contract holds ~400 ETH that has been locked since 2015, a testament to both the ambition and the naivety of early Ethereum experimentation.

Part of the [Ethereum History](https://ethereumhistory.com) verification effort — [awesome-ethereum-proofs](https://github.com/cartoonitunes/awesome-ethereum-proofs).
