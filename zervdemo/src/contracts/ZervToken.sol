pragma solidity ^0.4.11;
contract IERC20 {
    function totalSupply() constant returns (uint256 totalSupply);
    function balanceOf(address _owner) constant returns (uint256 balance);
    function transfer(address _to, uint256 _value) returns (bool Success);
    function transferFrom(address _from, address _to, uint256 _value) returns (bool Success);
    function approve(address _spender, uint256 _value) returns (bool Success);
    function allowance(address _owner, address _spender) constant returns (uint256 remaining);
    event Transfer(address indexed_form, address indexed_to, uint256 _value);
    event Approval(address indexed_owner, address indexed_spender, uint256 _value);
}

contract ZervToken is IERC20 {
    uint public  reserved = 0;    
    string public constant symbol = "ZERV TEST4";
    string public constant name = "Zerv Test Token4";
    uint8 public constant decimals = 0;
    uint256 public constant RATE = 1;
    address public owner;
    
    mapping(address => uint256) balances;
    
    mapping(address => mapping(address => uint256)) allowed;
    
    function ZervToken() {
        owner = msg.sender;
    }
    
    function totalSupply() constant returns (uint totalSupply) {
        return reserved;
    }
    
    function createTokens(address userAdr, uint256 tokenValue) {
        //require (msg.value > 0);
        uint256 tokens = tokenValue * (RATE);
        balances[userAdr] = balances[userAdr] + tokens;
        //owner.transfer(msg.value);
        reserved += tokens;
    }
    
    function balanceOf(address _owner) constant returns (uint256 balance) {
        return balances[_owner];
    }
    
    function transfer(address _to, uint256 _value) returns (bool Success) {
        require( balances [msg.sender] >= _value && _value > 0);
        balances[msg.sender] -=_value;
        balances[_to] += _value;
        Transfer(msg.sender, _to, _value);
        return true;
    }
    
    function transferFrom(address _from, address _to, uint256 _value) returns (bool Success) {
        require( allowed[_from][msg.sender] >= _value && balances[_from] >= _value && _value > 0);
        balances[_from] -= _value;
        balances[_to] += _value;
        allowed[_from][msg.sender] -= _value;
        Transfer (_from, _to, _value);
        return true;
    }
   
    function scTransfer(address from, address to, uint256 amount) returns (bool Success) {
        balances[from] -= amount;
        balances[to] += amount;
        Transfer(from, to, amount);
        return true;
    }
  
    function redeemTokens(address from, uint value) returns (bool Success) {
        balances[from] -= value;
        reserved -= value;
        return true;
    }
    
    
    function approve(address _spender, uint256 _value) returns (bool success) {
        allowed[msg.sender][_spender] = _value;
        Approval (msg.sender, _spender, _value);
        return true;
    }
    
    function allowance(address _owner, address _spender) constant returns (uint256 remaining) {
        return allowed[_owner][_spender];
    }
}

