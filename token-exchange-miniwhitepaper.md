# Token exchange whitepaper

### The last step to completing our rebranding process is upgrading our token to ‘Swarm Token’ (SWT). This will be a 1:1 token exchange. Meaning that you will have to exchange your old tokens for new tokens. You will receive an identical balance of SWT tokens on your existing account address.

This mini-whitepaper explains how this token exchange is executed.

### Rationale behind changing the Token Name

For the benefit of this project it was necessary to fork the brand from Arcade City to Swarm City. This change also impacts the ARC Token, as we have to change the token name for the following two reasons:

1. the ARC symbol was already in use by some other coins
2. the current token contract cannot be renamed, so cannot follow the brand change

However, we wanted to make sure the brand fork did not impact Arcade City token owners. To that end we’ve created a way to seamlessly exchange Arcade City tokens (ARC) for Swarm City tokens (SWT).

## How will we proceed
### The new SWT token

A new Swarm City token (SWT) has been created, and its purpose is to function within the Swarm City environment. Only SWT will be accepted in the Swarm City ecosystem, so any ARC token holders who wish to interact with the Swarm City platform will need to exchange their ARC for SWT.

### The token contract

The new token contract is based on the MiniMe token contract created by Giveth.
The MiniMe token-contract is a state-of-the-art ERC20 compatible token contract that provides some extra features:
- Balance history is registered and available to be queried
- All MiniMe Tokens maintain a history of the balance changes that occur during each block. Two calls are introduced to read the totalSupply and the balance of any address at any block in the past.

```
function totalSupplyAt(uint _blockNumber) constant returns(uint)
function balanceOfAt(address _holder, uint _blockNumber) constant returns(uint)
```

The address of the SWT Token is https://etherscan.io/token/0xb9e7f8568e08d5659f5d29c4997173d84cdf2607

### The token controller
The controller of a MiniMe token contract manages the token in a seperate smart contract, and is the only address that can manage the token.

In our case, the SWTConverter.sol contract will be set as the controller of the MiniMe Token.

By using this contract as the base token, clones can be easily generated at any given block number, this allows for incredibly powerful functionality, effectively the ability for anyone to give extra features to the token holders without having to migrate to a new contract. Some of the applications that the SWT Token based on the MiniMe token contract can be used for are:

- Generating a voting token that is burned when you vote.
- Generating a “coupon” token that is redeemed when you use it.
- Generating a token for a “spinoff” DAO.
- Generating a token that can be used to give explicit support to an action or a campaign, like polling.
- Generating a token to enable the token holders to collect daily, monthly or yearly payments.

All the applications the standard ERC 20 token can be used for, but with the ability to upgrade in the future as desired.
All these applications and more are enabled by the MiniMe Token Contract. The most amazing part being that anyone that wants to add these features can, in a permissionless yet safe manner without affecting the parent token’s intended functionality. We are adding swarmwise features to the SWT Token.

The address of the SWT Controller is https://etherscan.io/address/0x69e5da6904f73dfa845648e1991ad1dcc780f874

### Amount of SWT Token:
The total number of SWT in circulation will be determined by how many ARC tokens get converted to SWT. If only 5,000,000 ARC tokens are converted into SWT, there will only be 5,000,000 SWT in circulation.

Most notably there will be no extra tokens minted. A total of 9,525,397 ARC tokens were minted, so at most only 9,525,397 SWT can ever be minted. This number includes the 16% tokens minted in addition to the ARC Token Sale and these are exchangeable as well.

### Exchanging ARC tokens to SWT tokens
There is a function created in the SWTConverter that converts the ARC balance of the sender into an equal balance in SWT tokens, and sends your ARC tokens to a separate vault wallet. You must first create an allowance to the new contract so that it can transfer your ARC tokens to another wallet, so that the tokens can be exchanged into new SWT tokens.
The ARC is destroyed immediately by sending it to a 0x000 address.

### Security of the contract

The contract is created using the most recent solidity compiler to date ( v0.4.8 )

The new token contract code is open source and can be reviewed here :
[https://github.com/swarmcity/sc-token](https://github.com/swarmcity/sc-token)

It is based on this code :
https://github.com/Giveth/minime

### Options for exchanging my tokens
#### 1. Using the swarm.city terminal app (easy)
Using our first product - you can perform the token exchange very easy.
Please visit https://swarm.city/ and follow the steps to import your old ARC wallet into the app. It will then guide you to the token exchange process, which should only take a few minutes to execute.

#### 2. Perform the token exchange yourself. (advanced)

These are the steps required to perform the token exchange yourself:

STEP1 : Import the ARCcontract ABI at
http://api.etherscan.io/api?module=contract&action=getabi&address=0xAc709FcB44a43c35F0DA4e3163b117A17F3770f5&format=raw

STEP 2 : Import the SWTConverter ABI at
http://api.etherscan.io/api?module=contract&action=getabi&address=0x69e5da6904f73dfa845648e1991ad1dcc780f874&format=raw

and the SWTcontract ABI at http://api.etherscan.io/api?module=contract&action=getabi&address=0xb9e7f8568e08d5659f5d29c4997173d84cdf2607&format=raw

STEP 3 : From the ARC contract , determine your ARC balance :

```
ARCcontract.balanceOf.call(account)
```

STEP 4 : Give an allowance to the new SWTConverter contract for the full balance of your ARC account.
```
ARCcontract.approve(SWTconverter.address,balance)
```

STEP 5 : Call the convert function in the SWTConverter contract (call from the account that has the allowance from the previous step)
```
SWTconverter.convert(balance)
```
This function will move your ARC tokens to the vault account, and will mint new SWT tokens on the same account address where the ARC tokens were previously stored.
Your conversion should now be ready.
Don’t worry, if the transaction fails your ARC balance is intact.

STEP 6 : Verify your new SWT balance using the balanceOf function in the SWT contract.
```
SWTcontract.balanceOf.call(account)
```

You now have converted your ARC to SWT tokens.

You can verify your new token balance by querying the new SWT Token contract at :

```
https://etherscan.io/token/0xb9e7f8568e08d5659f5d29c4997173d84cdf2607
```

## Important!
**Please do not send tokens directly to the new token address using any wallet software ( MyEtherWallet / Mist / MetaMask / etc. ) they will not be converted to SWT tokens this way and will be lost when you do so.**

### Timeline and duration

As soon as we have deployed the new SWT token contract - we will publish the new token address and the software to exchange your tokens on our website https://swarm.city/

There is no time limit on performing the conversion, meaning that this functionality will be permanently available in our contract.

If you have have any other questions, please feel free to contact us at support@swarm.city, find us in Slack (#support), or send a tweet to @SwarmCityHelp.
