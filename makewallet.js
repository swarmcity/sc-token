var lightwallet = require('eth-lightwallet');
var HookedWeb3Provider = require("hooked-web3-provider");
var fs = require('fs');

var commandLineArgs = require('command-line-args');

var cli = commandLineArgs([{
  name: 'help',
  alias: 'h',
  type: Boolean
}, {
  name: 'password',
  alias: 'p',
  type: String
}, {
  name: 'walletfile',
  alias: 'w',
  type: String
}, ]);
var cliOptions = cli.parse();
if (cliOptions.help) {
  console.log(cli.getUsage());
} else {
  if (!cliOptions.password) {
    console.log('need password !');
    console.log(cli.getUsage());
    process.exit();
  }
  if (!cliOptions.walletfile) {
    console.log('need walletfile file!');
    console.log(cli.getUsage());
    process.exit();
  }

  if (!fs.existsSync(cliOptions.walletfile)) {
    console.log('file', cliOptions.walletfile, 'not found..');

    // maak nieuwe wallet en exit
    var secretSeed = lightwallet.keystore.generateRandomSeed();
    lightwallet.keystore.deriveKeyFromPassword(cliOptions.password, function(err, pwDerivedKey) {

      global_keystore = new lightwallet.keystore(secretSeed, pwDerivedKey);
      global_keystore.generateNewAddress(pwDerivedKey, 20);
      var keyStoreString = global_keystore.serialize();

      fs.writeFileSync(cliOptions.walletfile, keyStoreString);
      console.log("The keystore was saved! ==> ", cliOptions.walletfile);

      account = global_keystore.getAddresses()[0];

      console.log('Your main account is ', account);

      var privatekey = global_keystore.exportPrivateKey(account, pwDerivedKey);
      console.log('your PK = ', privatekey);

      console.log('now send this guy some ether in your geth client please');
      console.log("eth.sendTransaction({from:eth.coinbase, to:'" + global_keystore.getAddresses()[0] + "',value: web3.toWei(500, \"ether\")})");
      console.log("eth.sendTransaction({from:eth.coinbase, to:'" + global_keystore.getAddresses()[1] + "',value: web3.toWei(500, \"ether\")})");

      console.log("Goodbye!");
      process.exit();
    });
  } else {
    console.log(cliOptions.walletfile, 'already exists - refusing to overwrite - showing accounts');

    var walletdata = JSON.stringify(require(cliOptions.walletfile));
    var keystore = new lightwallet.keystore.deserialize(walletdata);
    console.log(keystore.getAddresses());
    console.log('nothing to do.')
  }
}