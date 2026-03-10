const fs = require('fs');
const solc = require('/tmp/soljson/soljson-v0.1.1+commit.6ff4cd6.js');

const src = fs.readFileSync(__dirname + '/MyScheme.sol', 'utf8');
const compile = solc.cwrap('compileJSON', 'string', ['string', 'number']);
const out = JSON.parse(compile(src, 1));
const bin = out.contracts['MyScheme'].bytecode;

// Runtime starts at byte offset 159 (after 159-byte init code), size 744 bytes
const runtime = bin.slice(159 * 2, (159 + 744) * 2);
const onchain = fs.readFileSync(__dirname + '/onchain-runtime.hex', 'utf8').trim();

console.log('Compiled runtime:', runtime.length / 2, 'bytes');
console.log('On-chain runtime:', onchain.length / 2, 'bytes');
console.log('Match:', runtime === onchain ? '✅ EXACT MATCH' : '❌ NO MATCH');
