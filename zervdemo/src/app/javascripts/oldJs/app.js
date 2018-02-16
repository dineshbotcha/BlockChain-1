import { default as contract } from 'truffle-contract'
import { default as Web3} from 'web3'
import investorregister_artifacts from '../../build/contracts/InvestorRegister.json'
//import usermgmt_artifacts from '../../build/contracts/UserMgmt.json'
import zervtoken_artifacts from '../../build/contracts/ZervToken.json'
import assetcard_artifacts from '../../build/contracts/AssetCard.json'
import loginmgmt_artifacts from '../../build/contracts/LoginMgmt.json'


//var User = contract(usermgmt_artifacts);
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
window.addEventListener('load', function() {
    /*if (typeof web3 !== 'undefined') {
        web3 = new Web3(web3.currentProvider);
    } else {
        window.web3 = new Web3(new Web3.providers.HttpProvider("http://"+location.hostname+"/jsonrpc"));
    }*/
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://"+location.host+"/jsonrpc"));
    //window.web3 = new Web3(new Web3.providers.HttpProvider("http://54.244.56.140:8545"));
    User.setProvider(web3.currentProvider);
    specificNetworkAddress = web3.eth.accounts[0];
    console.log(specificNetworkAddress);
    Asset.setProvider(web3.currentProvider);
    Token.setProvider(web3.currentProvider);
    Investor.setProvider(web3.currentProvider);
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
   getCookie("address");
   listAsset();
   //getBalanceBuyer();
    
})

window.getCookie = function (cname) {
    var name = cname + "=";
    //var pssword = "passowrd" + "=";
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
        }
    }
    //return "empty";
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
}
//---------------------------------------------
var AssetCount= 0;
window.listAsset = function() {
    Asset.deployed().then(function(instance) {
    return instance.getAssetAddrs({from:ethAddress})}).then (function(address) {
        console.log(address);
        var Addrlen = address.length;
        for(var i=0; i<address.length; i++) {
            //Addrlen = address.length;
            var addr = address[i];
            console.log(address[i]);
            console.log(Addrlen);
            getCardDetails(addr, Addrlen, i);
        }
    })
}
var MyAssetCount;
window.getCardDetails = function(address, len, i) {
    console.log("Hello:"+address);
    console.log("details");
    Asset.deployed().then(function(instance) {
    return instance.getAsset(address, {from:ethAddress}) }).then(function(result) {
        console.log(result);
        if(result[2] == "" ) {
          if(i == len-1) {
          //pagination();
          }
        } else {
          MyAssetCount = AssetCount +1;
          //var cards = myFunction(address, len, i, result[5], result[3]);
          document.getElementById("totalInvestors").innerHTML = MyAssetCount;
          if(i == len-1) {
            //document.getElementById("totalInvestors").innerHTML = AssetCount;
            
            // $pageCount = Math.ceil($rowCount / $n);
            //setTimeout(pagination, 2000);
            //pagination();
          }
        }

    })
}


window.createInvestorRecord = function(specificNetworkAddress, contractAddress,transactionContact, investmentDate, investmentAmount,allHash, investedAmount, assetName) {
    var fname = document.getElementById("firstname").value;
    var lname = document.getElementById("lastname").value; 
    var fullName = fname+" "+lname;    
    Investor.deployed().then(function(instance) {
      return instance.createInvestorRecord(contractAddress, TokenAddress, AssetAddress, transactionContact, investmentDate, investmentAmount,allHash, investedAmount, assetName, fullName, {from:ethAddress, gas:700000}) }).then(function(result) { console.log(result);
        getRecordId();
      }).catch((err) => {
         console.log(err)
        alert ("Transaction Failure \n Reasons: \n 1. Insufficient Balance \n 2. Jsonrpc Connection unavailable");
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
            var pAgreement = hashes.PurchaseAgreement;
            var note = hashes.PromisoryNote;
            var w9 = hashes.W9;
            var question = hashes.InvestorQuestion;
            var nd = hashes.NDA;
            document.getElementById("content").innerHTML = "<h4>Your Id is <b>"+result[1]+"</b> </h4>"+"<b>Transaction Contact: </b>"+result[0]+"<br>"+"<b>Transaction Id: </b>"+result[1]+"<br>"+"<b>Investment Date: </b>"+result[2]+"<br>"+"<b>Amount: </b>"+result[3]+"<br>"+"<b>DocHash: </b><a href ='http://"+location.hostname+"/ipfsgateway/ipfs/"+infoHash+"' target='_blank'>"+infoHash+"</a><br>"+
           "<b>PurchaseAgreement: </b><a href ='http://"+location.hostname+"/ipfsgateway/ipfs/"+pAgreement+"' target='_blank'>"+pAgreement+"</a><br>"+
           "<b>PromisoryNote: </b><a href ='http://"+location.hostname+"/ipfsgateway/ipfs/"+note+"' target='_blank'>"+note+"</a><br>"+
           "<b>W_9: </b><a href ='http://"+location.hostname+"/ipfsgateway/ipfs/"+w9+"' target='_blank'>"+w9+"</a><br>"+
           "<b>Questionnare: </b><a href ='http://"+location.hostname+"/ipfsgateway/ipfs/"+question+"' target='_blank'>"+question+"</a><br>"+
           "<b>NDA Document: </b><a href ='http://"+location.hostname+"/ipfsgateway/ipfs/"+nd+"' target='_blank'>"+nd;
            $("#submitModal").modal();
        })  
    })        
}

/* Function to upload files through browser*/
window.fileUpload = function(fileId, callback) {
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
    //request.open('POST', "http://"+"54.202.120.66"+"/ipfsgateway/ipfs/", true);
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
          var notePurchaseAgreement = response;;
          json = json+',"PurchaseAgreement":"'+notePurchaseAgreement+'"'
        }
        var file1 = "file1";
        fileUpload(file1, function (response) {
          if (response != "NA") {
            var promisoryNote = response;
            json = json+',"PromisoryNote":"'+promisoryNote+'"'
          }
          var file2 = "file2";
          fileUpload(file2, function (response) {
            if (response != "NA") {
              var W_9 = response;
              json = json+',"W9":"'+W_9+'"'
            }
            var file3 = "file3";
            fileUpload(file3, function (response) {
              if (response != "NA") {
                var investorQuestion = response;
                json = json+',"InvestorQuestion":"'+investorQuestion+'"'
              }
              
              var file4 = "file4";
              fileUpload(file4, function (response) {
                if (response != "NA") {
                  var NDA  = response;
                  json = json+',"NDA":"'+NDA+'"}'
                }
                else {
                  json  = json + '}';
                }
                var hashFile = (docHash +"\n"+ notePurchaseAgreement +"\n"+ promisoryNote +"\n"+ W_9 +"\n"+ investorQuestion +"\n"+ NDA);
                console.log("All Hash:"+"\n"+docHash +"\n"+ notePurchaseAgreement +"\n"+ promisoryNote +"\n"+ W_9 +"\n"+ investorQuestion +"\n"+ NDA);
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
}


/*window.createAddr = function () {
    var jsonData = '{"jsonrpc":"2.0","method":"personal_newAccount","params":["geth@123"],"id":4}';
    $.ajax({
     url: "http://54.244.56.140/jsonrpc",
     type: "POST",
     dataType: "json",
     data: jsonData,
     contentType: "application/json",
     success:function(data) {
     if(data) {
       console.log(data);
       //createUser(data.result);
       console.log(data.result);
       createUser(data.result);
     } else { console.log("Not Created"); }
     }
    });
}*/
    
/*window.createUser = function (addr) {
    var userAddress = addr.toString();
    User.deployed().then(function(instance) {
        return instance.insertUser(userAddress, 105, "zervapp", investmentAmount, {from:"specificNetworkAddress"} )}).then (function (result) {
            console.log(result);
            tokenCreate(userAddress)
        })
}*/
        
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

       /* stream.on('data', function (chunk) {
          res += chunk.toString();
        })

        stream.on('error', function (err) {
          console.error('Oh nooo', err)
        })

       stream.on('end', function () {*/
          console.log('Got:', stream.toString());
          callback(stream.toString());
       
      //  })
      })
    }
}

$('#submitModal').on('hidden.bs.modal', function () {
    location.reload();
})
