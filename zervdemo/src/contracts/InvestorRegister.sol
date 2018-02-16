pragma solidity ^0.4.11;
import "./ZervToken.sol";
import "./AssetCard.sol";

contract InvestorRegister {
    uint public InvestorId = 1000;
    uint public totalAmount = 0;
    uint public totalInvestedAmount = 0;
    uint public totalInvestors;
    uint public appId = 105;
    string public tag = "Investor";
    function InvestorRegister() {}
    
    struct InvestorRecords {
        string transcationContact;
        uint investorId;
        string investmentDate;
        uint investedAmount;
        string fullName;
        uint investmentAmount;
        string docHash;
    }
    mapping (uint  => InvestorRecords) investor;
    uint [] investorIndex;
    
    function createInvestorRecord (address contractAddress,address zervAddress, address assetAddr, string transcationContact, string investmentDate, uint investmentAmount, string docHash, uint investedAmount, string assetName, string fullname) {   
        ZervToken zerv = ZervToken(zervAddress);
        zerv.createTokens(msg.sender, investmentAmount);
        AssetCard asset = AssetCard(assetAddr);
        asset.createAsset(msg.sender, assetName, investmentAmount, fullname);
        InvestorId = (InvestorId+5);
        investor[InvestorId].transcationContact = transcationContact;
        investor[InvestorId].investorId = InvestorId;
        investor[InvestorId].investmentDate = investmentDate;
        investor[InvestorId].investmentAmount = investmentAmount;
        investor[InvestorId].fullName = fullname;
        investor[InvestorId].docHash = docHash;
        investorIndex.push(InvestorId);
        totalAmount = totalAmount + investmentAmount;
        totalInvestedAmount = totalInvestedAmount + investedAmount;
    }
   
    function getInvestorRecord (uint investorId) public constant returns (string transactionContact, uint investoId, string investmentDate, uint investmentAmount, string docHash) {
        return (
        investor[investorId].transcationContact,
        investor[investorId].investorId,
        investor[investorId].investmentDate,
        investor[investorId].investmentAmount,
        investor[investorId].docHash
        );
    }

    function getInvestorName(uint user) public constant returns (string username){
       return (investor[user].fullName);
    } 

    function getInvestorId() public constant returns (uint InvestorID) {
        return (
        InvestorId + 5
        );
    } 
   function getTotal() public constant returns (uint, uint, uint) {
       return (
       totalAmount,
       totalInvestedAmount,
       totalInvestors = investorIndex.length
       );
   }

   function remove(address owner) {
       selfdestruct(owner); // Makes contract inactive, returns funds
   }

}


