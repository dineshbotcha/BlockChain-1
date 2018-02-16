pragma solidity ^0.4.11;

contract test{
    function test(address OAddress, string _name, uint _balance) {}
}

contract AssetCard {
    struct Asset {
        address assetCard;
        address owner;
        string name;
        string fullName;
        uint tokenBalance;
        uint originalBalance;
    }
    
    struct AssetHistory {
        address from;
        address to;
        uint tokens;
        string category;
    }

    address public owned;
    function AssetCard () {
       owned = msg.sender;
    }
    
    event create(address card, address own, string name, uint bal);
    event Transfer(address from, address to, uint balance);
    
    mapping (address  => Asset) asset;
    address [] assetIndex;
    
    mapping (uint => AssetHistory) history;
    uint [] historyIndex;
 
    function getHistoryIndex() constant returns (uint) {
        return historyIndex.length;
    }
    
    function getAssetAddrs() public constant returns (address []){
        return (assetIndex);
    }
    
    function createAsset (address owner, string name, uint balance, string fullname) returns(bool Success) {
        address newContract = new test(owner, name, balance);
        asset[newContract].assetCard = newContract;
        asset[newContract].owner = owner;
        asset[newContract].name = name;
        asset[newContract].fullName = fullname;
        asset[newContract].tokenBalance = balance;
        asset[newContract].originalBalance = balance;
        assetIndex.push(newContract);
        create (newContract, owner, name, balance);
        return true;
    }
    
    function getAsset(address id)public constant returns(address assetcard, address owner, string name, uint balance, uint original, string fullname) {
        if(msg.sender == asset[id].owner || msg.sender == owned) {
        return(
            asset[id].assetCard,
            asset[id].owner,
            asset[id].name,
            asset[id].tokenBalance,
            asset[id].originalBalance,
            asset[id].fullName);
        } 
    }

    
    address [] AssetAddress;
    uint [] AssetBalances;
    uint redeemTokens;
    uint count = 0;
    address[] AssetEmpty;
    uint [] AseetBalEmpty;
    
    function ret () public constant returns(address[], uint[]) {
        return(AssetAddress, AssetBalances);
    }
    
    function redeemAssetCard(uint redeemToken) public {
        if(redeemToken > 0) {
            AssetAddress = AssetEmpty;
            AssetBalances = AseetBalEmpty;
            for(uint i =0; i< assetIndex.length; i++) {
               if(msg.sender == asset[assetIndex[i]].owner) {
                   AssetAddress.push(asset[assetIndex[i]].assetCard);
                   AssetBalances.push(asset[assetIndex[i]].tokenBalance);
               }
            }
            
            uint highestAmount = 0;
            uint AssetIdentifier;
            
            for (uint j = 0; j < AssetBalances.length; j++) {
                if (AssetBalances[j] > highestAmount) {
                    highestAmount = AssetBalances[j];
                    AssetIdentifier = j;
                } 
            }
            
            if (redeemToken < AssetBalances[AssetIdentifier]) {
               asset[AssetAddress[AssetIdentifier]].tokenBalance -= redeemToken;
               redeemTokens = 0;
            }
            
            if (redeemToken > AssetBalances[AssetIdentifier]) {
                redeemTokens = redeemToken - AssetBalances[AssetIdentifier] ;
                asset[AssetAddress[AssetIdentifier]].tokenBalance -= AssetBalances[AssetIdentifier];
                redeemAssetCard(redeemTokens);
            }
            
        }
    }
    
    function transfer(address from_card, address to_card, uint amount, string category) {
        require((asset[from_card].tokenBalance) >= amount);
        asset[from_card].tokenBalance -= amount;
        uint historyID = historyIndex.length+1;
        history[historyID].from = from_card;
        history[historyID].to = to_card;
        history[historyID].tokens = amount;
        history[historyID].category = category;
        historyIndex.push(historyID);
        Transfer(from_card, to_card, amount);
    }
    
    function transferContract(address from_card, address to, uint amount, string category) {
        asset[to].tokenBalance += amount;
        uint historyID = historyIndex.length+1;
        history[historyID].from = from_card;
        history[historyID].to = to;
        history[historyID].tokens = amount;
        history[historyID].category = category;
        historyIndex.push(historyID);
        Transfer(from_card, to, amount);
    } 
    
    function balanceOf(address id) public constant returns (uint bal) {
        return (asset[id].tokenBalance);
    }
    
    function getHistory(uint id, address assetAddr) public constant returns (address from, address to, uint amount, string name) {
        if (assetAddr == history[id].from  || assetAddr == history[id].to) {
            return(
                history[id].from,
                history[id].to,
                history[id].tokens,
                history[id].category
               
            );
        }
    }    
}
