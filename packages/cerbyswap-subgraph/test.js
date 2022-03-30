const web3 = require('web3');
const fs = require('fs');


web3.extend({
  property: 'evm',
  methods: [new web3._extend.Method({
      name: 'snapshot',
      call: 'evm_snapshot',
      params: 0,
      outputFormatter: toIntVal
  })]
});

web3.extend({
  property: 'evm',
  methods: [new web3._extend.Method({
      name: 'revert',
      call: 'evm_revert',
      params: 1,
      inputFormatter: [toIntVal]
  })]
});

let provider = new web3('http://10.8.0.1:8545/');


(async () => {
    // console.log(await provider.eth.getTransaction('0x2b49dd1aa26dbd25b34e7467e2d835a3e463ec03c5a559c0fb93e84911aea95b'));
    // let contract = new provider.eth.Contract(JSON.parse(fs.readFileSync('./abis/ERC20.json')), "0x3b1dd4b62c04e92789aafef24af74beeb5006395");
    // console.log(await getTokenInfo(contract))
    console.log(await provider.eth.sendAsync('evm_snapshot'))
})()

async function getTokenInfo(tokenContract) {
    const [decimals, name, symbol] = await Promise.all([
      tokenContract.methods.decimals().call(),
      tokenContract.methods.name().call(),
      tokenContract.methods.symbol().call(),
    ]);
    return { decimals, name, symbol };
}