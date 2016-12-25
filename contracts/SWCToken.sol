
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
    StandardToken public arcToken;

    function SWCToken(address _arcmultisig,address _arctokenaddress) {
        owner = msg.sender;
        arcmultisig = _arcmultisig;
        arcToken = StandardToken(_arctokenaddress);

    }

  	// convert ARC tokens to SWC tokens
    function convert(){
        uint arcbalance = arcToken.balanceOf(msg.sender);

        if (!arcToken.transferFrom(msg.sender, arcmultisig, arcbalance))
            throw;
		
		balances[msg.sender] = safeAdd(balances[msg.sender], arcbalance * 3);
        
        totalSupply = safeAdd(totalSupply, arcbalance);

    }


}
