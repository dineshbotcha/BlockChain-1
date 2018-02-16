import { default as contract } from 'truffle-contract'
import { default as Web3} from 'web3'
import investorregister_artifacts from '../../build/contracts/InvestorRegister.json'
//import usermgmt_artifacts from '../../build/contracts/UserMgmt.json'
import zervtoken_artifacts from '../../build/contracts/ZervToken.json'
import assetcard_artifacts from '../../build/contracts/AssetCard.json'
import loginmgmt_artifacts from '../../build/contracts/LoginMgmt.json'

var User = contract(loginmgmt_artifacts);
var Investor = contract(investorregister_artifacts);
var Token = contract(zervtoken_artifacts);
var Asset = contract(assetcard_artifacts);
var ipfsAPI = require('ipfs-api')
var ipfs = ipfsAPI('/ip4/'+location.hostname+'/tcp/5001')
var specificNetworkAddress;
var UserId;
var ethAddress;
var TokenAddress;
var AssetAddress;
var defaultNode = "IbTNgT4uQiGfqQMMz1gfggc9fsq3OTgERqzpTLrR0Es=";
var nodeKeys = {"nodeA":"uGwdY2PBKjHHQDnWR8E2I8v5iRqHyAJC2pMjWt0jPF0=", "nodeB":"Lnxxh1wUgVnXM3Ir1loebS5jWD8Up/XGW+bPILNY11c=", "nodeC":"DvWk+OQJdnJ3Wixo9p46Oq8VY4bSLBmgXvcy0RKzFC4=", "nodeD":"Xw/I9N+VWVhSRTKzVSPNurXY3AehO1RAuWZY8a9sCkg=", "nodeE":"HOcfl5kUDec6MVENxRy4B0KAhAZuNNotTjx9C8e54SY=", "nodeF":"5ISbHOhw29MtOx5f/5MWVVeH+6mPkRSWsA4uwpj+8UE="}

window.addEventListener('load', function() {
   getCookie("userrole");
})

window.setweb3 = function (url) {
    console.log(url);
    setRpc(url);
}

window.setRpc = function (rpcurl) {
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://"+location.host+"/"+rpcurl));
    //window.web3 = new Web3(new Web3.providers.HttpProvider("http://54.186.254.137:"+rpcurl));
    User.setProvider(web3.currentProvider);
    specificNetworkAddress = web3.eth.accounts[0];
    Investor.setProvider(web3.currentProvider);
    console.log(specificNetworkAddress);
    Asset.setProvider(web3.currentProvider);
    Token.setProvider(web3.currentProvider);

    getCookie("address");
    listAsset();
}

window.getCookie = function (cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
	console.log(JSON.stringify(ca));
    console.log(ca.length);
    if(ca[0] == "") {
        window.location.href="http://"+location.host + "/login.html";
    }
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            console.log("ccokieif");
            if( name == "address=") {
                ethAddress = c.substring(name.length, c.length);
                getBalanceBuyer();
                return getCookie("username");
            }
            if(name == "password=") {
                UserId = c.substring(name.length, c.length);
                Investor.deployed().then(function(instance) {
                return instance.getInvestorId() }).then(function(result) {
                    console.log(result);
                })
                Token.deployed().then(function(instance) { 
                  TokenAddress =  instance.address;
                })
                Asset.deployed().then(function(instance) {
                 AssetAddress  = instance.address;
               })
                getInvestorName(UserId);
                return c.substring(name.length, c.length);
            }
            if(name =="username=") {
                name = c.substring(name.length, c.length);
                document.getElementById("tradingPartner").innerHTML = name;
                document.getElementById("transactionContact").value = name;
                console.log(name);
                return getCookie("password");
            }
            if(name =="userrole=") {
                name = c.substring(name.length, c.length);
                console.log(name);
                return setweb3(name);
            }
        }
    }
}

window.getInvestorName = function(user) {
    Investor.deployed().then(function(instance) { 
        return instance.getInvestorName(user) }).then(function(result) {
            console.log("InvestorName:"+result);
            document.getElementById("seller_name").innerHTML = result;
            document.getElementById("userAddress").innerHTML = ethAddress;
        })
}

window.delCookie = function () {
   console.log("1234");
   document.cookie = "address=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
   document.cookie = "password=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}
//---------------------------------------------
var AssetCount= 0;
window.listAsset = function() {
    Asset.deployed().then(function(instance) {
    return instance.getAssetAddrs({from:ethAddress})}).then (function(address) {
        console.log(address);
        var Addrlen = address.length;
        for(var i=0; i<address.length; i++) {
            var addr = address[i];
            console.log(address[i]);
            console.log(Addrlen);
            getCardDetails(addr, Addrlen, i);
        }
    })
}

var MyAssetCount = 0;
window.getCardDetails = function(address, len, i) {
    console.log("Hello:"+address);
    console.log("details");
    Asset.deployed().then(function(instance) {
    return instance.getAsset(address, {from:ethAddress}) }).then(function(result) {
        console.log(result);
        if(result[2] == "" ) {
          if(i == len-1) {
          }
        } else {
          MyAssetCount = MyAssetCount +1;
          document.getElementById("totalInvestors").innerHTML = MyAssetCount;
          if(i == len-1) {
          }
        }
    })
}

window.getUserRole = function(cname, callback) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    console.log(ca.length);
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            console.log("role");
            if(name =="userrole=") {
                name = c.substring(name.length, c.length);
                console.log(name);
                callback (name);
            }
        }
    }
}

window.createInvestorRecord = function(specificNetworkAddress, contractAddress,transactionContact, investmentDate, investmentAmount,allHash, investedAmount, assetName) {
    var fname = document.getElementById("firstname").value;
    var lname = document.getElementById("lastname").value; 
    var fullName = fname+" "+lname;
    getUserRole("userrole", function(response) {
        console.log(response);
        if (response == "jsonrpcA") {
        Investor.deployed().then(function(instance) {
          return instance.createInvestorRecord(contractAddress, TokenAddress, AssetAddress, transactionContact, investmentDate, investmentAmount,allHash, investedAmount, assetName, fullName, {from:ethAddress, gas:700000, privateFor:["IbTNgT4uQiGfqQMMz1gfggc9fsq3OTgERqzpTLrR0Es=" , nodeKeys.nodeB, nodeKeys.nodeC, nodeKeys.nodeD, nodeKeys.nodeE, nodeKeys.nodeF ]}) }).then(function(result) { console.log(result);
            getRecordId();
          }).catch((err) => {
             console.log(err)
            alert ("Transaction Failure \n Reasons: \n 1. Insufficient Balance \n 2. Jsonrpc Connection unavailable");
          })
        } else if (response == "jsonrpcB") {
            Investor.deployed().then(function(instance) {
            return instance.createInvestorRecord(contractAddress, TokenAddress, AssetAddress, transactionContact, investmentDate, investmentAmount,allHash, investedAmount, assetName, fullName, {from:ethAddress, gas:700000, privateFor:["IbTNgT4uQiGfqQMMz1gfggc9fsq3OTgERqzpTLrR0Es=", nodeKeys.nodeA, nodeKeys.nodeC, nodeKeys.nodeD, nodeKeys.nodeE, nodeKeys.nodeF]}) }).then(function(result) { console.log(result);
            getRecordId();
          }).catch((err) => {
             console.log(err)
            alert ("Transaction Failure \n Reasons: \n 1. Insufficient Balance \n 2. Jsonrpc Connection unavailable");
          })
        } else if (response == "jsonrpcC") {
            Investor.deployed().then(function(instance) {
            return instance.createInvestorRecord(contractAddress, TokenAddress, AssetAddress, transactionContact, investmentDate, investmentAmount,allHash, investedAmount, assetName, fullName, {from:ethAddress, gas:700000, privateFor:["IbTNgT4uQiGfqQMMz1gfggc9fsq3OTgERqzpTLrR0Es=", nodeKeys.nodeA, nodeKeys.nodeB, nodeKeys.nodeD, nodeKeys.nodeE, nodeKeys.nodeF]}) }).then(function(result) { console.log(result);
            getRecordId();
          }).catch((err) => {
             console.log(err)
            alert ("Transaction Failure \n Reasons: \n 1. Insufficient Balance \n 2. Jsonrpc Connection unavailable");
          })
        } else if (response == "jsonrpcD") {
            Investor.deployed().then(function(instance) {
            return instance.createInvestorRecord(contractAddress, TokenAddress, AssetAddress, transactionContact, investmentDate, investmentAmount,allHash, investedAmount, assetName, fullName, {from:ethAddress, gas:700000, privateFor:["IbTNgT4uQiGfqQMMz1gfggc9fsq3OTgERqzpTLrR0Es=", nodeKeys.nodeA, nodeKeys.nodeB, nodeKeys.nodeC, nodeKeys.nodeE, nodeKeys.nodeF]}) }).then(function(result) { console.log(result);
            getRecordId();
          }).catch((err) => {
             console.log(err)
            alert ("Transaction Failure \n Reasons: \n 1. Insufficient Balance \n 2. Jsonrpc Connection unavailable");
          })
        } else if (response == "jsonrpcE") {
            Investor.deployed().then(function(instance) {
            return instance.createInvestorRecord(contractAddress, TokenAddress, AssetAddress, transactionContact, investmentDate, investmentAmount,allHash, investedAmount, assetName, fullName, {from:ethAddress, gas:700000, privateFor:["IbTNgT4uQiGfqQMMz1gfggc9fsq3OTgERqzpTLrR0Es=", nodeKeys.nodeA, nodeKeys.nodeB, nodeKeys.nodeC, nodeKeys.nodeD, nodeKeys.nodeF]}) }).then(function(result) { console.log(result);
            getRecordId();
          }).catch((err) => {
             console.log(err)
            alert ("Transaction Failure \n Reasons: \n 1. Insufficient Balance \n 2. Jsonrpc Connection unavailable");
          })
        } else {
            Investor.deployed().then(function(instance) {
            return instance.createInvestorRecord(contractAddress, TokenAddress, AssetAddress, transactionContact, investmentDate, investmentAmount,allHash, investedAmount, assetName, fullName, {from:ethAddress, gas:700000, privateFor:["IbTNgT4uQiGfqQMMz1gfggc9fsq3OTgERqzpTLrR0Es=", nodeKeys.nodeA, nodeKeys.nodeB, nodeKeys.nodeC, nodeKeys.nodeD, nodeKeys.nodeE]}) }).then(function(result) { console.log(result);
            getRecordId();
          }).catch((err) => {
             console.log(err)
            alert ("Transaction Failure \n Reasons: \n 1. Insufficient Balance \n 2. Jsonrpc Connection unavailable");
          })
        }
    })
}

window.getRecordId = function () {
    Investor.deployed().then(function(instance) {
    return instance.getInvestorId() }).then(function(result) {
        var id = result - 5;
        getInvestorRecord(id);
    })
}

window.getInvestorRecord = function(id) {
    Investor.deployed().then(function(instance) {
    return instance.getInvestorRecord(id) }).then(function(result) {
        var bhash = result[4];
        console.log("bhash:"+bhash);
        displayIpfsFile(bhash, function (response) {
            var has = response;
            var hashes = JSON.parse(has);
            var infoHash = hashes.InfoDoc;
            var pAgreement = hashes.InventoryManifest;
            var note = hashes.ManufacturingOrder;
            var w9 = hashes.CashDepositTransferDetails;
            var question = hashes.ConvertibleNotes;
            var nd = hashes.OtherExistingDocs;
            var saft = hashes.SAFT;
            document.getElementById("content").innerHTML = "<h4>Your Id is <b>"+result[1]+"</b> </h4>"+"<b>Transaction Contact: </b>"+result[0]+"<br>"+"<b>Transaction Id: </b>"+result[1]+"<br>"+"<b>Investment Date: </b>"+result[2]+"<br>"+"<b>Amount: </b>"+result[3]+"<br>"+"<b>DocHash: </b><a href ='http://"+location.hostname+"/ipfsgateway/ipfs/"+infoHash+"' target='_blank'>"+infoHash+"</a><br>"+
           "<b>PurchaseAgreement: </b><a href ='http://"+location.hostname+"/ipfsgateway/ipfs/"+pAgreement+"' target='_blank'>"+pAgreement+"</a><br>"+
           "<b>PromisoryNote: </b><a href ='http://"+location.hostname+"/ipfsgateway/ipfs/"+note+"' target='_blank'>"+note+"</a><br>"+
           "<b>W_9: </b><a href ='http://"+location.hostname+"/ipfsgateway/ipfs/"+w9+"' target='_blank'>"+w9+"</a><br>"+
           "<b>Questionnare: </b><a href ='http://"+location.hostname+"/ipfsgateway/ipfs/"+question+"' target='_blank'>"+question+"</a><br>"+
           "<b>NDA Document: </b><a href ='http://"+location.hostname+"/ipfsgateway/ipfs/"+nd+"' target='_blank'>"+nd+"</a><br>"+
           "<b>SAFT Note: </b><a href ='http://"+location.hostname+"/ipfsgateway/ipfs/"+saft+"' target='_blank'>"+saft+"</a>";
            $("#submitModal").modal();
        })  
    })        
}

/* Function to upload files through browser*/
window.fileUpload = function(fileId, callback) {
        console.log(fileId);
        var file = document.getElementById(fileId).files[0];
        if ( file == undefined ) {
            callback("NA");
        }
        else {
            var reader = new FileReader();
            reader.onload = function (e) {
                const buffer = Buffer.from(e.target.result);
                var request = new XMLHttpRequest();
                request.open('POST', "http://"+location.hostname+"/ipfsgateway/ipfs/", true);
                //request.open('POST', "http://"+"54.202.120.66"+"/ipfsgateway/ipfs/", true);
                request.setRequestHeader("Content-type", "text/plain");
                request.send(buffer);
                request.onreadystatechange=function() {
                    if (request.readyState==this.HEADERS_RECEIVED) {
                        var fileHash = request.getResponseHeader("Ipfs-Hash");
                        callback(fileHash)
                    }
                }
            }
            reader.readAsArrayBuffer(file);
         }
}


/* Function to upload all text entry from UI except files*/
window.fileCreate = function (data, callback) {
    console.log(data);
    var content = new Buffer (data);
    var request = new XMLHttpRequest();
    request.open('POST', "http://"+location.hostname+"/ipfsgateway/ipfs/", true);
    request.setRequestHeader("Content-type", "text/plain");
    request.send(content);
    request.onreadystatechange=function() {
        if (request.readyState==this.HEADERS_RECEIVED) {
            var hash = request.getResponseHeader("Ipfs-Hash");
            console.log("Doc Hash:"+hash);
            callback(hash);
        }
    }
}

window.submitDetails = function () {
User.deployed().then(function(instance) {
    console.log(instance.address);
    var contractAddress = instance.address;
    var transactionContact = document.getElementById("transactionContact").value;
    var investmentAmount = document.getElementById("investedAmount").value;
    var investedAmount = document.getElementById("investmentAmount").value;
    var investmentDate = document.getElementById("dtp_input2").value;
    console.log(investmentDate);
    var investmentDetails = ("Transaction Contact: "+transactionContact+"\n"+"Investment Date: "+investmentDate+"\n" + "Investment Amount: "+investmentAmount+"\n" +"Discount: " +document.getElementById("discount").value+"\n"+"\n");
    var investorInfo = ("First Name: "+document.getElementById("firstname").value+"\n" + "Last Name: "+document.getElementById("lastname").value+"\n" +"Phone: "+document.getElementById("phone").value+"\n" + "Email: "+document.getElementById("email").value+"\n" + "Address: "+document.getElementById("address").value+"\n"+"\n");
    var investorDetails = ("Investment Details" +"\n"+investmentDetails+"\n"+"----------------------------"+"\n"+"Investor Info"+"\n"+investorInfo);
    var json;
    fileCreate(investorDetails, function(response) {
      if (response != "NA") {
        var docHash = response;
        json = '{"InfoDoc":"'+docHash+'"'
      }
      var file0 = "file0";
      fileUpload(file0, function (response) {
        if (response != "NA") {
           
          var inventoryManifest = response;;
          json = json+',"InventoryManifest":"'+inventoryManifest+'"'
        }
        var file1 = "file1";
        fileUpload(file1, function (response) {
          if (response != "NA") {
            var manufacturingOrder = response;
            json = json+',"ManufacturingOrder":"'+manufacturingOrder+'"'
          }
          var file2 = "file2";
          fileUpload(file2, function (response) {
            if (response != "NA") {
              var cashDepositTransferdetails = response;
              json = json+',"CashDepositTransferDetails":"'+cashDepositTransferdetails+'"'
            }
            var file3 = "file3";
            fileUpload(file3, function (response) {
              if (response != "NA") {
                var convertibleNotes = response;
                json = json+',"ConvertibleNotes":"'+convertibleNotes+'"'
              }
              
              var file4 = "file4";
              fileUpload(file4, function (response) {
                if (response != "NA") {
                  var otherExistingdocs  = response;
                  json = json+',"OtherExistingDocs":"'+otherExistingdocs+'"'
                }
                var file5 = "file5"
                fileUpload(file5, function (response) {
                  if(response != "NA") {
                    var SAFT = response;
                    json = json+',"SAFT":"'+SAFT+'"}'
                  }
                  else {
                    json  = json + '}';
                  }
                  var hashFile = (docHash +"\n"+ inventoryManifest +"\n"+ manufacturingOrder +"\n"+ cashDepositTransferdetails +"\n"+ convertibleNotes +"\n"+ otherExistingdocs +"\n"+ SAFT);
                  console.log("All Hash:"+"\n"+docHash +"\n"+ inventoryManifest +"\n"+ manufacturingOrder +"\n"+ cashDepositTransferdetails +"\n"+ convertibleNotes +"\n"+ otherExistingdocs +"\n"+SAFT);
                  console.log(json);
                  fileCreate(json, function(response) {
                    var lname = document.getElementById("lastname").value;
                    var assetName = transactionContact +"-"+lname;
                    console.log(assetName);
                    var allHash = response;
                    console.log(allHash);
                    createInvestorRecord(specificNetworkAddress, contractAddress,transactionContact, investmentDate, investmentAmount,allHash, investedAmount, assetName);
                  })
                })
              })
            })
          })
        })
      })
    })
  })
}

window.tokenCreate = function (userAddress) {
    Token.deployed().then(function(instance) {
    var tokenValue = document.getElementById("investedAmount").value;
    return instance.createTokens(userAddress, tokenValue, {from:"specificNetworkAddress"} )}).then (function (result) {
        console.log(result);
        submitDetails()
    })
}

window.getBalanceBuyer = function() {
    console.log("called");
    var buyerAddrs = web3.eth.accounts[0];
    console.log(buyerAddrs);
    Token.deployed().then(function(instance) {
    return instance.balanceOf(ethAddress)}).then(function(bal) {
        console.log(bal);
        document.getElementById("buyer_balance").innerHTML = bal;
    })
}

/*Function to fetch the main Ipfs file and to extract all the other ipfs hashes*/
window.displayIpfsFile = function(hash, callback) {
    if(hash == undefined)  {
        callback("NA")
    }
    else {
      console.log("retrieve hash:"+hash);
   
      ipfs.cat(hash, function (err, stream) {
        console.log(err);
        console.log("stream"+stream);
        var res = '';
        console.log('Got:', stream.toString());
        callback(stream.toString());
      })
    }
}

$('#submitModal').on('hidden.bs.modal', function () {
    location.reload();
})


