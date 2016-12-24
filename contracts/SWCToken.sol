
pragma solidity ^0.4.4;

import "./zeppelin/SafeMath.sol";
import "./zeppelin/token/StandardToken.sol";


/**
 * Swarm City token contract.
 
 */
 
contract SWCToken is StandardToken {

    string public name = "Swarm City Token";
    string public symbol = "SWC";
    uint public decimals = 18;

    // Initial multisig address (set in constructor)
    // All deposited ETH will be instantly forwarded to this address.
    // Address is a multisig wallet.
    address public arcmultisig = 0x0;

    address public owner = 0x0;

    function SWCToken(address _arcmultisig) {
        owner = msg.sender;
        arcmultisig = _arcmultisig;

    }

  StandardToken constant public arcToken = StandardToken(0xAc709FcB44a43c35F0DA4e3163b117A17F3770f5);

  	// convert ARC tokens to SWC tokens
    function convert(){
        uint arcbalance = arcToken.balanceOf(msg.sender);

        if (!arcToken.transferFrom(msg.sender, arcmultisig, arcbalance))
            throw;
		
		balances[msg.sender] = safeAdd(balances[msg.sender], arcbalance * 3);
        
        totalSupply = safeAdd(totalSupply, arcbalance);

    }


}
