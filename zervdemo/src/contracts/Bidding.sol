pragma solidity ^0.4.11;
import "./ZervToken.sol";
import "./AssetCard.sol";

/*contract ZervToken {
    function transfer(address _to, uint256 _value) {}
    function scTransfer(address from, address to, uint256 amount) returns (bool Success) {}
}

contract AssetCard {
    function transfer(address from_card, address to_card, uint amount, string category) {}
    function transferContract(address from_card, address to, uint amount, string category) {}    
}*/

contract Bidding {

    enum ProjectState { NULL, OPEN, INPROCESS, CLOSED }
    ProjectState public projectState;
    enum BidState { NULL, OPEN, ACCEPTED, REJECTED, CLOSED }
    BidState public state;
    address public owner;
    
    function Bidding(){
       owner = msg.sender;
    }
    
    string public buyer = "As Buyer";
    string public seller = "As Seller";

    struct Project {
        string  projectName;
        string desc;
        uint price;
        uint projectState;
        address projectAddress;
        string detailsHash;
        string fileHash;
        address cardAddress;
        string buyerPartner;
    }

    struct Bid {
        address bidAddress;
        string name;
        uint amount;
        uint projectId;
        uint bidstate;
        address projectAddress;
        address assetAddress;
        string sellerPartner;
        string buyer;
        uint acceptAmount;
        uint askedPrice;
        uint date;
        
    }

    function getProjectLength() constant returns (uint){
        return projectIndex.length;
    }

    function getBidLength() constant returns (uint) {
        return bidIndex.length;
    }
    
    mapping (uint  => Bid) bid;
    uint [] bidIndex;
    uint bidID;
    mapping (uint => Project) projects;
    uint [] projectIndex;
    uint projectID;

    function createProject(string proname, string desc, uint price, string hash, string fileHash, string tradingPartner)public returns (bool success) {
        projectID = projectIndex.length+1;
        projects[projectID].projectAddress = msg.sender;
        projects[projectID].projectName = proname;
        projects[projectID].desc = desc;
        projects[projectID].price = price ;
        projects[projectID].detailsHash = hash ;
        projects[projectID].fileHash = fileHash;
        projects[projectID].buyerPartner = tradingPartner;
        projects[projectID].projectState = uint256(ProjectState.OPEN);
        projectIndex.push(projectID);
        return true;
    }

    function getprojectID() constant returns(uint) {
       return  projectID;
    }

    function getBuyerProject(uint _projectID )
    public constant returns  (string projectName, string desc, uint price, uint, uint, string detailsHash, string fileHash, string trading)  {
        projectID =_projectID;
        if(projects[projectID].projectAddress == msg.sender) {
            return (
                projects[projectID].projectName,
                projects[projectID].desc,
                projects[projectID].price,
                projects[projectID].projectState,
                projectID,
                projects[projectID].detailsHash,
                projects[projectID].fileHash,
                projects[projectID].buyerPartner
            );
        }
    }

    function getProject(uint _projectID )
    public constant returns  (string projectName, string desc, uint price, uint, uint, string detailsHash, string fileHash, string trading)  {
        projectID =_projectID;
        if((projects[projectID].projectState == 1) && (projects[projectID].projectAddress != msg.sender) ) {
            return (
                projects[projectID].projectName,
                projects[projectID].desc,
                projects[projectID].price,
                projects[projectID].projectState,
                projectID,
                projects[projectID].detailsHash,
                projects[projectID].fileHash,
                projects[projectID].buyerPartner
            );
        }
    }

    function createBid (address zervAddr, address assetAddr, address cardAddr, string name, uint proId, uint amount, string tradingPartner)public returns (bool success) {
        ZervToken zerv = ZervToken(zervAddr);
        zerv.scTransfer(msg.sender, this, amount);
        AssetCard asset = AssetCard(assetAddr);
        asset.transfer(cardAddr, this, amount, seller); 
        bidID = bidIndex.length+1;
        projectID = proId;
        bid[bidID].askedPrice = projects[proId].price;
        bid[bidID].bidAddress = msg.sender;
        bid[bidID].name = name;
        bid[bidID].amount = amount/2;
        bid[bidID].projectId = proId;
        bid[bidID].bidstate = uint(BidState.OPEN);
        bid[bidID].assetAddress = cardAddr;
        bid[bidID].projectAddress = projects[proId].projectAddress;
        bid[bidID].sellerPartner = tradingPartner;
        bid[bidID].askedPrice = projects[proId].price;
        bid[bidID].buyer = projects[projectID].buyerPartner;
        bidIndex.push(bidID);
        return true;
 
    }

    function getbidID() constant returns(uint) {
       return  bidID;
    }

    function getBid(uint bidID)
    constant returns (string name, uint amount, uint, uint, uint proId, string sellertrade, string buyer) {
      if((bid[bidID].bidAddress == msg.sender) || (bid[bidID].projectAddress) == msg.sender || (msg.sender == owner))  {
        return (
            bid[bidID].name,
            bid[bidID].amount,
            bid[bidID].bidstate,
            bidID,
            bid[bidID].projectId,
            bid[bidID].sellerPartner,
            bid[bidID].buyer
        );
      }
    }
    
    function getBuyerBid(uint bidID)
    constant returns (string name, uint amount, uint, uint, uint proId, string sellertrade, string buyer) {
        if ((bid[bidID].projectAddress) == msg.sender )  {
        return (
            bid[bidID].name,
            bid[bidID].amount,
            bid[bidID].bidstate,
            bidID,
            bid[bidID].projectId,
            bid[bidID].sellerPartner,
            bid[bidID].buyer
        );
      }
    }
   
    function getSellerBid(uint bidID)
    constant returns (string name, uint amount, uint, uint, uint proId, string sellertrade) {
      uint bidId = bidID;
      if((bid[bidId].bidAddress == msg.sender))  {
        return (
            bid[bidID].name,
            bid[bidID].amount,
            bid[bidID].bidstate,
            bidID,
            bid[bidID].projectId,
            bid[bidID].sellerPartner
        );
      }
    }    

    function acceptBid(address zervAddr, address assetAddr, address cardAddr, uint bidId, uint proId)
    public returns (bool success) {
        ZervToken zerv = ZervToken(zervAddr);
        zerv.scTransfer(msg.sender, this, (bid[bidId].amount)*2);
        zerv.scTransfer(this, bid[bidId].bidAddress, (bid[bidId].amount)*2);
        AssetCard asset = AssetCard(assetAddr);
        asset.transfer(cardAddr, this, (bid[bidId].amount)*2, buyer);
        asset.transferContract(this, bid[bidID].assetAddress, (bid[bidId].amount)*2, seller);
        projects[proId].cardAddress = cardAddr;
        bid[bidId].bidstate = uint(BidState.ACCEPTED);
        bid[bidId].acceptAmount = bid[bidId].amount;
        projects[proId].projectState = uint(ProjectState.INPROCESS);
        return true;
    }

    function getacceptBid(uint bidId) constant returns(uint, uint, uint) {
       return  (
           bid[bidID].bidstate,
           bid[bidID].projectId,
           projects[projectID].projectState
           );
    }

    function itemReceived(address zervAddr, address assetAddr, uint bidId, uint proId ) public returns (bool success) {
        ZervToken zerv = ZervToken(zervAddr);
        zerv.scTransfer(this, bid[bidId].bidAddress, bid[bidId].amount);
        zerv.scTransfer(this, bid[bidId].projectAddress, bid[bidId].amount);
        AssetCard asset = AssetCard(assetAddr);
        asset.transferContract(this, bid[bidID].assetAddress, bid[bidId].amount, seller);
        asset.transferContract(this, projects[proId].cardAddress, bid[bidId].amount, buyer);
        projects[proId].projectState = uint(ProjectState.CLOSED);
        bid[bidId].bidstate = uint(BidState.CLOSED);
        bid[bidId].date = now;
        return true;
    }

    function geitemReceived(uint bidId, uint proId) constant returns(uint, uint) {
       return  (bid[bidId].projectId, projects[proId].projectState);
    }

    function rejectBid(address zervAddr, address assetAddr, uint bidId) public returns (bool success) {
        ZervToken zerv = ZervToken(zervAddr);
        zerv.scTransfer(this, bid[bidId].bidAddress, (bid[bidId].amount)*2);
        AssetCard asset = AssetCard(assetAddr);
        asset.transferContract(this, bid[bidID].assetAddress, (bid[bidId].amount)*2, seller);
        bid[bidId].bidstate = uint(BidState.REJECTED);
        bid[bidId].date = now;
        return true;
    }

    function getrejectBid(uint bidId) constant returns(uint) {
       return  bid[bidId].bidstate;
    }

    function getRole(uint bidId) public constant returns (address partner, string name) {
        return (bid[bidId].bidAddress, 
            bid[bidId].sellerPartner
        );
    }
    
    function getAddress(uint bidId, uint proId) constant returns (address buyer, address seller, string desc, string detail, string file) {    
       return (
           bid[bidId].projectAddress,
           bid[bidId].bidAddress,
           projects[proId].desc,
           projects[proId].detailsHash,
           projects[proId].fileHash
        );
    }
    
    function portalHistory(uint bidID )
    constant returns (string name, uint amount, uint, uint, uint proId, string sellertrade, string buyer) {
        return (
            bid[bidID].name,
            bid[bidID].acceptAmount,
            bid[bidID].bidstate,
            bidID,
            bid[bidID].projectId,
            bid[bidID].sellerPartner,
            bid[bidID].buyer
            
        );
    }
    
    function Portal(uint bidId) constant returns (uint askPrice, uint date) {
        return (bid[bidId].askedPrice, bid[bidId].date);
    }
}
