pragma solidity ^0.4.6;

import "MiniMeToken.sol";

// Taken from Zeppelin's standard contracts.
contract ERC20 {
  uint public totalSupply;
  function balanceOf(address who) constant returns (uint);
  function allowance(address owner, address spender) constant returns (uint);

  function transfer(address to, uint value) returns (bool ok);
  function transferFrom(address from, address to, uint value) returns (bool ok);
  function approve(address spender, uint value) returns (bool ok);
  event Transfer(address indexed from, address indexed to, uint value);
  event Approval(address indexed owner, address indexed spender, uint value);
}


/// @dev `Owned` is a base level contract that assigns an `owner` that can be
///  later changed
contract Owned {
    /// @dev `owner` is the only address that can call a function with this
    /// modifier
    modifier onlyOwner { if (msg.sender != owner) throw; _; }

    address public owner;

    /// @notice The Constructor assigns the message sender to be `owner`
    function Owned() { owner = msg.sender;}

    /// @notice `owner` can step down and assign some other address to this role
    /// @param _newOwner The address of the new owner. 0x0 can be used to create
    ///  an unowned neutral vault, however that cannot be undone
    function changeOwner(address _newOwner) onlyOwner {
        owner = _newOwner;
    }
}

contract SWTConverter is TokenController, Owned {

    MiniMeToken public tokenContract;   // The new token
    address public vaultAddress;        // The address to hold the funds donated
    ERC20 public arcToken;              // The ARC token address

    function SWTConverter(
        address _vaultAddress,
        address _tokenAddress,          // the new MiniMe token address
        address _arctokenaddress        // the original ARC token address
    ) {
        if (_vaultAddress == 0)
            {
            throw;
            }
        vaultAddress = _vaultAddress;
        tokenContract = MiniMeToken(_tokenAddress); // The Deployed Token Contract
        arcToken = ERC20(_arctokenaddress);
    }

/////////////////
// TokenController interface
/////////////////


/// @notice Notifies the controller about a transfer, for this SWTConverter all
///  transfers are allowed by default and no extra notifications are needed
/// @param _from The origin of the transfer
/// @param _to The destination of the transfer
/// @param _amount The amount of the transfer
/// @return False if the controller does not authorize the transfer
    function onTransfer(address _from, address _to, uint _amount) returns(bool) {
        return true;
    }

/// @notice Notifies the controller about an approval, for this SWTConverter all
///  approvals are allowed by default and no extra notifications are needed
/// @param _owner The address that calls `approve()`
/// @param _spender The spender in the `approve()` call
/// @param _amount The amount in the `approve()` call
/// @return False if the controller does not authorize the approval
    function onApprove(address _owner, address _spender, uint _amount)
        returns(bool)
    {
        return true;
    }


/// @notice `onlyOwner` changes the location that ARC is sent
/// @param _newVaultAddress The address that will receive the ARC when converting tokens
    function setVault(address _newVaultAddress) onlyOwner {
        vaultAddress = _newVaultAddress;
    }

/// @notice converts ARC tokens to new SWT tokens and forwards ARC to the vault address.
/// @param _amount The amount of ARC to convert to SWT
 function convert(uint _amount){

        // transfer ARC to the vault address. caller needs to have an allowance from
        // this controller contract for _amount before calling this or the transferFrom will fail.
        if (!arcToken.transferFrom.gas(100000)(msg.sender, vaultAddress, _amount))
            throw;

        // mint new SWT tokens
        if (!tokenContract.generateTokens(msg.sender, _amount)) {
            throw;
        }
    }


}