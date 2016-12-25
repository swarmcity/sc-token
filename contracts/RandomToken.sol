
pragma solidity ^0.4.4;

import "./zeppelin/SafeMath.sol";
import "./zeppelin/token/StandardToken.sol";


/**
 * Random City token contract.
 */
 
contract RandomToken is StandardToken {

    string public name = "Random City Token";
    string public symbol = "RCT";
    uint public decimals = 18;

    address public owner = 0x0;

    function RandomToken() {
        owner = msg.sender;
        balances[msg.sender] = 100 * 1 ether;
    }

}
