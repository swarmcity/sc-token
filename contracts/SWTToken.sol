
pragma solidity ^0.4.4;

import "./zeppelin/SafeMath.sol";
import "./zeppelin/token/StandardToken.sol";


/**
 * Swarm City token contract.
 */
 
contract SWTToken is StandardToken {

    string public name = "Swarm Token";
    string public symbol = "SWT";
    uint public decimals = 18;

    // Initial deposit address (set in constructor)
    // All deposited ETH will be instantly forwarded to this address.
    // Address is a deposit wallet.
    address public arcdeposit = 0x0;

    //address public owner = 0x0;
    StandardToken public arcToken;

    function SWTToken(address _arcdeposit,address _arctokenaddress) {
        //owner = msg.sender;
        arcdeposit = _arcdeposit;
        arcToken = StandardToken(_arctokenaddress);
    }

  	// convert ARC tokens to SWT tokens
    function convert(){
        uint arcbalance = arcToken.balanceOf(msg.sender);
        if (!arcToken.transferFrom.gas(100000)(msg.sender, arcdeposit, arcbalance))
            throw;
		balances[msg.sender] = safeAdd(balances[msg.sender], safeMul(arcbalance, 3));        
        totalSupply = safeAdd(totalSupply, arcbalance);
    }


}
