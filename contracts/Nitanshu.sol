// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Nitanshu is ERC20 {
    constructor() ERC20("NITANSHU", "NIT") {

    }

    uint limit = 10000000000 ether;
    uint private randNonce = 0; 
    mapping(address => uint) private hasReceived;

    function checkMyLuck(uint _modulus) external {
        require(hasReceived[msg.sender] == 0, "You have received tokens");
        require(_modulus <= limit, "That's to much to ask for");
        uint _randValue = (uint(keccak256(abi.encodePacked(block.timestamp, msg.sender, randNonce))) % _modulus);
        randNonce++;
        require(_randValue < _modulus / 2, "Hmm i am not interested in rewarding token to you !!");
        _randValue = _randValue * 10**18;
        require(_randValue < limit, "You had a bad luck and good luck at the same time");
        hasReceived[msg.sender] = _randValue;
        limit = limit - _randValue;
        _mint(msg.sender, _randValue);
    }

    receive() external payable {
        
    }
}
