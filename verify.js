/**
 * Verification proof for contract 0x020522bf9b8ed6ff41e2fa6765a17e20e2767d64
 * EarlyChainLetter100ETH - 100 ETH chain-letter investment contract from Aug 2015.
 *
 * Compiles MyScheme.sol with soljson v0.1.1+commit.6ff4cd6 (optimizer ON)
 * and compares against on-chain creation bytecode.
 *
 * Usage:
 *   curl -o soljson-v0.1.1.js https://binaries.soliditylang.org/bin/soljson-v0.1.1+commit.6ff4cd6.js
 *   npm install solc
 *   node verify.js
 */

const fs = require("fs");
const path = require("path");

const soljson = require(path.join(__dirname, "soljson-v0.1.1.js"));
const compile = soljson.cwrap("compileJSON", "string", ["string", "number"]);

const onchainHex = fs
  .readFileSync(path.join(__dirname, "onchain-creation.hex"), "utf8")
  .trim();

const source = fs.readFileSync(path.join(__dirname, "MyScheme.sol"), "utf8");

// Compile with optimizer ON
const output = JSON.parse(compile(source, 1));

if (output.errors) {
  console.error("Compilation errors:", output.errors);
  process.exit(1);
}

const key = Object.keys(output.contracts)[0];
const compiled = output.contracts[key].bytecode;
const hashes = output.contracts[key].functionHashes;

console.log("Contract:", key);
console.log("Function hashes:", JSON.stringify(hashes, null, 2));
console.log("Compiled length:", compiled.length / 2, "bytes");
console.log("On-chain length:", onchainHex.length / 2, "bytes");

if (compiled === onchainHex) {
  console.log("\n✅ EXACT MATCH — creation bytecode verified!");
} else {
  console.log("\n❌ MISMATCH");
  // Find first difference
  for (let i = 0; i < Math.min(compiled.length, onchainHex.length); i += 2) {
    if (compiled.slice(i, i + 2) !== onchainHex.slice(i, i + 2)) {
      console.log(
        `First diff at byte ${i / 2}: compiled=${compiled.slice(i, i + 2)} onchain=${onchainHex.slice(i, i + 2)}`
      );
      break;
    }
  }
  process.exit(1);
}
