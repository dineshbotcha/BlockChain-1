import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
import bidding_artifacts from '../../build/contracts/Bidding.json'
import investorregister_artifacts from '../../build/contracts/InvestorRegister.json'
import zervtoken_artifacts from '../../build/contracts/ZervToken.json'
import assetcard_artifacts from '../../build/contracts/AssetCard.json'
import loginmgmt_artifacts from '../../build/contracts/LoginMgmt.json'

var ipfsAPI = require('ipfs-api')
var ipfs = ipfsAPI('ip4/'+location.hostname+'/tcp/5001', {protocol: 'http'})

var Bidding = contract(bidding_artifacts);
var Zerv = contract(zervtoken_artifacts);
var User = contract(loginmgmt_artifacts);
var Investor = contract(investorregister_artifacts);
var Asset = contract(assetcard_artifacts);
var AssetAddress;
var ethAddress;
var UserId;
var count = 0;
var nodeKeys = {"nodeA":"uGwdY2PBKjHHQDnWR8E2I8v5iRqHyAJC2pMjWt0jPF0=", "nodeB":"Lnxxh1wUgVnXM3Ir1loebS5jWD8Up/XGW+bPILNY11c=", "nodeC":"DvWk+OQJdnJ3Wixo9p46Oq8VY4bSLBmgXvcy0RKzFC4=", "nodeD":"Xw/I9N+VWVhSRTKzVSPNurXY3AehO1RAuWZY8a9sCkg=", "nodeE":"HOcfl5kUDec6MVENxRy4B0KAhAZuNNotTjx9C8e54SY=", "nodeF":"5ISbHOhw29MtOx5f/5MWVVeH+6mPkRSWsA4uwpj+8UE="}
var nodes = {"jsonrpcA":"uGwdY2PBKjHHQDnWR8E2I8v5iRqHyAJC2pMjWt0jPF0=", "jsonrpcB":"Lnxxh1wUgVnXM3Ir1loebS5jWD8Up/XGW+bPILNY11c=", "jsonrpcC":"DvWk+OQJdnJ3Wixo9p46Oq8VY4bSLBmgXvcy0RKzFC4=", "jsonrpcD":"Xw/I9N+VWVhSRTKzVSPNurXY3AehO1RAuWZY8a9sCkg=", "jsonrpcE":"HOcfl5kUDec6MVENxRy4B0KAhAZuNNotTjx9C8e54SY=", "jsonrpcF":"5ISbHOhw29MtOx5f/5MWVVeH+6mPkRSWsA4uwpj+8UE="}


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
    Bidding.setProvider(web3.currentProvider);
    Asset.setProvider(web3.currentProvider);
    Zerv.setProvider(web3.currentProvider);
    Investor.setProvider(web3.currentProvider);
    
    Asset.deployed().then(function(instance) {
     AssetAddress  = instance.address;
   })
    getCookie("address");
    getBalanceBuyer();
    listAsset();
    getProjectList();
    //getBidProjectList();
    getBidList();
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
                getInvestorName(UserId);
                return c.substring(name.length, c.length);
                
            }
            if(name =="username=") {
                name = c.substring(name.length, c.length);
                document.getElementById("tradingPartner").innerHTML = name;
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
window.delCookie = function () {
   console.log("1234");
   document.cookie = "address=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
   document.cookie = "password=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

window.getInvestorName = function(user) {
    Investor.deployed().then(function(instance) { 
        return instance.getInvestorName(user) }).then(function(result) {
                document.getElementById("seller_name").innerHTML = result
                document.getElementById("userAddress").innerHTML = ethAddress;
        }) 
}

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
            getCardsDetails(addr, Addrlen, i);
        }
    })
}
var MyAssetCount = 0;
window.getCardsDetails = function(address, len, i) {
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
          MyAssetCount = MyAssetCount +1;
          document.getElementById("totalInvestors").innerHTML = MyAssetCount;
          if(i == len-1) {
            //pagination();
          }
        }

    })
}

window.getCardsPrivate = function(bid_id, bid_amount, prj_id) {
    Asset.deployed().then(function(instance) {
    return instance.getAssetAddrs()}).then (function(address) {
        if(count < address.length) {
            getCardDetails(address[count], function(response) {
                getCardBalance(response, function(respons) {
                    if(respons >= bid_amount*2) {
                        return selectPrivateBid(bid_id, bid_amount, prj_id,address[count]);
                    }
                    else {
                        count = count+1;
                        getCards(bid_id, bid_amount, prj_id);
                        console.log("nobal");
                    }
                })
            })
        }
    })
}

window.getProjectList = function() {
    Bidding.deployed().then(function(instance) {
    return instance.getProjectLength({from:ethAddress})}).then(function(length) {
        var len = length;
        if(len > 0) {
            var i;
            for(i = 1; i <= len; i++) {
                var a = Promise.resolve(getPro(i));
                /* if(i == len-1) {
                    var bideGet = getBidProjectList();
                } */
            } 
        } 
    })
}

window.getBidList = function() {
    Bidding.deployed().then(function(instance) {
    return instance.getBidLength({from:ethAddress})}).then (function(length) {
        if (length > 0) {
            var i;
            for(i = 1; i <= length; i++) {
              var a = Promise.resolve(getBid(i));
            }
        }
    })
}

window.getCards = function(bid_id, bid_amount, prj_id) {
    Asset.deployed().then(function(instance) {
    return instance.getAssetAddrs()}).then (function(address) {
        if(count < address.length) {
            getCardDetails(address[count], function(response) {
                getCardBalance(response, function(respons) {
                    if(respons >= bid_amount*2) {
                        return acceptBid(bid_id, bid_amount, prj_id,address[count]);
                    }
                    else {
                        count = count+1;
                        getCards(bid_id, bid_amount, prj_id);
                        console.log("nobal");
                    }
                })
            })
        }
    })
}

window.getCardDetails = function(address, callback) {
    Asset.deployed().then(function(instance) {
    return instance.getAsset(address, {from:ethAddress}) }).then(function(result) {
        if(result[2] == "" ) {
          callback(0);
        } else {
          callback(address);
        }
    }).catch(function(err) { console.log(err) })
}

window.getCardBalance = function(address, callback) {
    Asset.deployed().then(function(instance) {
    return instance.balanceOf(address, {from:ethAddress}) }).then(function(balance) {
        console.log(balance);
        callback(balance);
    })
}

window.tokenBalance = function (value, callback) {
    //var buyerAddrs = web3.eth.accounts[0];
    Zerv.deployed().then(function(instance) { 
    return instance.balanceOf(ethAddress, {from:ethAddress})}).then(function(val) {
      callback(val);
    })
}

window.getUserRole = function(cname, callback) {
    var callbackString = {};
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
                if(name == "jsonrpcA") {
                    callbackString.node1 = nodes.jsonrpcB; callbackString.node2 = nodes.jsonrpcC; callbackString.node3 = nodes.jsonrpcD; callbackString.node4 = nodes.jsonrpcE; callbackString.node5 = nodes.jsonrpcF; 
                    callback(callbackString);
                } else if (name == "jsonrpcB") {
                    callbackString.node1 = nodes.jsonrpcA; callbackString.node2 = nodes.jsonrpcC; callbackString.node3 = nodes.jsonrpcD; callbackString.node4 = nodes.jsonrpcE; callbackString.node5 = nodes.jsonrpcF; 
                    callback(callbackString);
                } else if (name == "jsonrpcC") {
                    callbackString.node1 = nodes.jsonrpcA; callbackString.node2 = nodes.jsonrpcB; callbackString.node3 = nodes.jsonrpcD; callbackString.node4 = nodes.jsonrpcE; callbackString.node5 = nodes.jsonrpcF; 
                    callback(callbackString);
                } else if (name == "jsonrpcD") {
                    callbackString.node1 = nodes.jsonrpcA; callbackString.node2 = nodes.jsonrpcB; callbackString.node3 = nodes.jsonrpcC; callbackString.node4 = nodes.jsonrpcE; callbackString.node5 = nodes.jsonrpcF; 
                    callback(callbackString);
                } else if (name == "jsonrpcE") {
                    callbackString.node1 = nodes.jsonrpcA; callbackString.node2 = nodes.jsonrpcB; callbackString.node3 = nodes.jsonrpcC; callbackString.node4 = nodes.jsonrpcD; callbackString.node5 = nodes.jsonrpcF; 
                    callback(callbackString);
                }
                else {
                    callbackString.node1 = nodes.jsonrpcA; callbackString.node2 = nodes.jsonrpcB; callbackString.node3 = nodes.jsonrpcC; callbackString.node4 = nodes.jsonrpcD; callbackString.node5 = nodes.jsonrpcE; 
                    callback(callbackString);
                }
            }
        }    
    }
}
    
window.projectCreation = function(dHash, fHash) {    
    var projectName = document.getElementById ("pname").value;
    var description = document.getElementById ("pdetail").value;
    var tradePartner = document.getElementById("tradingPartner").innerText;
    console.log(tradingPartner);
    //var buyerAddrs = web3.eth.accounts[0];
    var pvalue = (document.getElementById("pvalue").value);
    getUserRole("userrole", function(nodekey) {
        console.log(nodekey.node1);
        console.log(nodekey.node2);
        tokenBalance(pvalue*2, function(response) {
          if(response >= pvalue*2) {
            Bidding.deployed().then(function(instance) {
              console.log(ethAddress);
              console.log(projectName, description, pvalue, dHash, fHash, tradePartner);
              return instance.createProject(projectName, description, pvalue, dHash, fHash, tradePartner, {from:ethAddress, gas:900000, privateFor: ["IbTNgT4uQiGfqQMMz1gfggc9fsq3OTgERqzpTLrR0Es=", nodekey.node1, nodekey.node2, nodekey.node3, nodekey.node4, nodekey.node5 ]}) }).then(function(){
                location.reload()
            })
          } else {
            alert("Insufficient Balance");
          }
        })
    })
}

window.uploads = function () {
    var toStore = document.getElementById('details').value;
    var file = document.getElementById('uploadBtn').files[0];
    if (toStore.length != 0 && file !== undefined ) {
        var content = new Buffer (toStore);
        var request = new XMLHttpRequest();
        var detailsHash;
        var fileHash;
        request.open('POST', "http://"+location.hostname+"/ipfsgateway/ipfs/", true);
        request.setRequestHeader("Content-type", "text/plain");
        request.send(toStore);
        request.onreadystatechange=function() {
            if (request.readyState==this.HEADERS_RECEIVED) {
              detailsHash = request.getResponseHeader("Ipfs-Hash");
              console.log("DetailsHash:"+detailsHash);
            }
        }

        var reader = new FileReader();
        reader.onload = function (e) {
        var fileString = e.target.result;
          console.log(fileString);
          const buffer = Buffer.from(fileString);
          var request = new XMLHttpRequest();
          request.open('POST', "http://"+location.hostname+"/ipfsgateway/ipfs/", true);
          request.setRequestHeader("Content-type", "text/plain");
          request.send(buffer);
          request.onreadystatechange=function() {
            if (request.readyState==this.HEADERS_RECEIVED) {
              fileHash = request.getResponseHeader("Ipfs-Hash");
              console.log("fileHash:"+fileHash);
              setTimeout(function() {
                projectCreation(detailsHash, fileHash);
              },3000);
            }
          }
        }
        reader.readAsArrayBuffer(file);
    }
    else {
        detailsHash = "NA";
        fileHash = "NA";
        projectCreation(detailsHash, fileHash);
    }
}

window.displayIpfsFile = function(hash) {
      console.log("retrieve hash:"+hash);
   
      ipfs.cat(hash, function (err, stream) {
        console.log(err);
        console.log("stream"+stream);
        var res = '';
          console.log('Got:', stream.toString());
          document.getElementById('ipfsHashAddress').innerHTML="Ipfs Hash: "+hash;
          document.getElementById('content').innerText=res;
          //callback(stream.toString());
       
      //  })
      })
}

window.getPro = function(pid) {
    Bidding.deployed().then(function(instance) {
        return instance.getBuyerProject(pid, {from:ethAddress})}).then(function(result) {
            console.log(result);
            var pvalue = result[2];
            if(pvalue == 0) {
              return "";
            } 
            var project_state = "";
            if (result[3] == 1) {
              project_state = "Open";
            }
            if (result[3] == 2) {
              project_state = "In Process";
            }
            if (result[3] == 3) {
              
              project_state = "Closed";
            }
            var hashColumn = '';
            if (result[5] == "NA") {
              hashColumn = '<td>'+result[5]+'</td>';
            } else {
              hashColumn = '<td> <button style= " type="button" name="button" data-toggle="modal" data-target="#myModal" class="btn btn-info"  id = "'+result[5]+'" onclick="displayIpfsFile(this.id)">Info</button></td>';
            }
            var column = '';
            if (result[6] == "NA") {
              column = '<td>'+result[6]+'</td>';
            } else {
              column = '<td> <button style= " type="button" name="button" data-toggle="modal" data-target="#myModal" class="btn btn-info"  id = "'+result[6]+'" onclick="displayIpfsFile(this.id)">View</button></td>';
            }
            var table = document.getElementById("projectListTable");
            var y = $('#projectListTable tr').length;
            var row = table.insertRow(y);
            row.innerHTML = '<tr><td >'+ result[0] +'</td><td >'+ result[1] +'</td><td >'+ pvalue +'</td>'+
                '<td id="prj_state'+result[4]+'">'+project_state+hashColumn+column+'<td>'+result[7]+'</td>';
        });
}

window.load_bid= function(p_name, proId){
   $('#bName').val(p_name);
   $('#proId').val(proId);
}

window.totalval = function(id) {
   var amt = $('#'+id).val();
   $('#id_total_value').val(amt*2);
}

window.acceptBid = function(bid_id, bid_amount, prj_id, address) {
    //var buyerAddrs = web3.eth.accounts[0];
    getUserRole("userrole", function(nodekeys) {
        Zerv.deployed().then(function(instance) {
            var ZervContractAddrs = instance.address;
            Bidding.deployed().then(function(instance) {
            return instance.acceptBid(ZervContractAddrs, AssetAddress, address, bid_id, prj_id, {from:ethAddress, gas:499928, privateFor: ["IbTNgT4uQiGfqQMMz1gfggc9fsq3OTgERqzpTLrR0Es=", nodekeys.node1, nodekeys.node2, nodekeys.node3, nodekeys.node4, nodekeys.node5]})}).then(function(result) {
                console.log(result);
                //var result = getBidState(bid_id, prj_id);
                location.reload();
               
                //return;
            })
        })
    })
}

window.selectPrivateBid = function(bid_id, bid_amount, prj_id, address) {
    console.log(bid_id);
    Bidding.deployed().then(function(instance) { 
    return instance.getRole(bid_id, {from:ethAddress}) }).then(function(resultAddr) {
        console.log(resultAddr);
        User.deployed().then(function(instance) { 
        return instance.getUserDetails(resultAddr[0], resultAddr[1],{from:ethAddress}) }).then(function(resultRole) {
            console.log(resultRole);
            console.log(nodes[resultRole]);
            acceptPrivateBid(bid_id, bid_amount, prj_id, address, nodes[resultRole]);
            
            //var buyerAddrs = web3.eth.accounts[0];
        })
    })
}

window.acceptPrivateBid = function(bid_id, bid_amount, prj_id, address, node) {
    Zerv.deployed().then(function(instance) {
        var ZervContractAddrs = instance.address;
        Bidding.deployed().then(function(instance) {
        return instance.acceptBid(ZervContractAddrs, AssetAddress, address, bid_id, prj_id, {from:ethAddress, gas:499928, privateFor: ["IbTNgT4uQiGfqQMMz1gfggc9fsq3OTgERqzpTLrR0Es=", node]})}).then(function(result) {
            console.log(result);
            //var result = getBidState(bid_id, prj_id);
            location.reload();
            //return;
        })
    })
}
            
// After AcceptBid function this function returns the bidState
window.getBidState = function(bid_id, prj_id) {
    Bidding.deployed().then(function(instance) {
    return instance.getacceptBid(bid_id, {from:ethAddress})}).then(function(result) {
        var bidState = result[0];
        var prj_state = result[2];
        var result_prj_id = result[1];

        if(bidState == 2) {
            $('#bid_list_state'+bid_id).html( "Accepted");
            $('#action_accept_btn'+bid_id).hide();
            $('#action_accept_btnpvt'+bid_id).hide();
            $('#action_reject_btn'+bid_id).hide();
            $('#action_conform_btn'+bid_id).css({"display": "inline-block"});
            if (prj_state == 2) {
                $('#prj_state'+prj_id).html( "In Process");
            }
            getBalanceBuyer();
        }
    })
}

window.rejectBid = function(bid_id,prj_id, bid_amount) {
    
    var buyerAddrs = web3.eth.accounts[0];
    getUserRole("userrole", function(nodekey) {
        Zerv.deployed().then(function(instance) {
          var ZervContractAddrs = instance.address;
          Bidding.deployed().then(function(instance) {
            return instance.rejectBid(ZervContractAddrs, AssetAddress,  bid_id,{from:ethAddress, gas:499928, privateFor: ["IbTNgT4uQiGfqQMMz1gfggc9fsq3OTgERqzpTLrR0Es=", nodekey.node1, nodekey.node2, nodekey.node3, nodekey.node4, nodekey.node5]});}).then(function() {
              location.reload();
              var result = getRejectState(bid_id,prj_id);
          })
        })
    })
}

//After RejectBid function this function returns the bidState
window.getRejectState = function(bid_id, prj_id) {
  Bidding.deployed().then(function(instance) {
  return instance.getrejectBid(bid_id, {from:ethAddress, gas:499928})}).then(function(result) {
    if(result == 3) {
       $('#action_accept_btn'+bid_id).hide();
       $('#action_accept_btnpvt'+bid_id).hide();
       $('#action_reject_btn'+bid_id).hide();
       $('#action_conform_btn'+bid_id).css({"display":"none"});
       $('#bid_list_state'+bid_id).html( "Rejected");
    }

  })
}

window.itemReceived = function(bid_id,prj_id, bid_amount) {
    var buyerAddrs = web3.eth.accounts[0];
    getUserRole("userrole", function(nodekey) {
     Zerv.deployed().then(function(instance) {
       var ZervContractAddrs = instance.address;
       Bidding.deployed().then(function(instance) { 
         return instance.itemReceived(ZervContractAddrs, AssetAddress, bid_id, prj_id, {from:ethAddress, gas:599928, privateFor: ["IbTNgT4uQiGfqQMMz1gfggc9fsq3OTgERqzpTLrR0Es=", nodekey.node1, nodekey.node2, nodekey.node3, nodekey.node4, nodekey.node5]})}).then(function(result) {
           //var res = itemReceiveState(bid_id, prj_id);
           location.reload();

       })
     })
    })
}

window.itemReceiveState = function(bid_id, prj_id) {
  Bidding.deployed().then(function(instance) {
  return instance.geitemReceived(bid_id, prj_id)}).then(function(result) {
    $('#prj_state'+prj_id).html( "Closed");
    $('#bid_list_state'+bid_id).html( "Closed");
    $('#action_conform_btn'+bid_id).css({"display":"none"});
    getBalanceBuyer();
  })
}

window.getBalanceBuyer = function() {
    console.log("called");
    var buyerAddrs = web3.eth.accounts[0];
    console.log(buyerAddrs);
    Zerv.deployed().then(function(instance) {
    return instance.balanceOf(ethAddress)}).then(function(bal) {
        console.log(bal);
        document.getElementById("buyer_balance").innerHTML = "<b>ZERV Account Balance:</b>" + " " + bal;
    })
}
window.getBid = function(bid) {
    Bidding.deployed().then(function(instance) {
       return instance.getBuyerBid(bid, {from:ethAddress})}).then(function(resultbid) {
           var bidamount = resultbid[1] / 1;
           if(bidamount == 0) { 
             return "";
           }
           var bid_state ='';
           var disp_var = '';
           var acceptdisp_var = '';
           var rejectdisp_var = '';
           if(resultbid[2] == 1) {
              var bid_state = "Open";
              acceptdisp_var = "inline-block";
              rejectdisp_var = "inline-block";
              disp_var = "none";
           }
           if(resultbid[2] == 2) {
              var bid_state = "Accepted";
              
              disp_var = "inline-block";
              acceptdisp_var = "none";
              rejectdisp_var = "none";
           }
           if(resultbid[2] == 3) {
              var bid_state = "Rejected";
              return "";
              acceptdisp_var = "none";
              rejectdisp_var = "none";
              disp_var = "none";
           }
           if(resultbid[2] == 4) {
              var bid_state = "Closed";
              return "";
              disp_var = 'none';
              acceptdisp_var = "none";
              rejectdisp_var = "none";
           }

           var table2 = document.getElementById("bid_list_tabel");
           var y2 = $('#bid_list_tabel tr').length;
           var row2 = table2.insertRow(y2);
           row2.innerHTML = '<tr> '+
               '<td >'+ resultbid[0] +'</td><td >'+ bidamount +'</td><td id = "bid_list_state'+resultbid[3]+'" >'+ bid_state +'</td>'+
               '<td id = "action_td'+resultbid[3]+'"><button style= "display :'+acceptdisp_var+';"type="button" name="button" class="btn btn-success" id = "action_accept_btn'+resultbid[3]+'" onclick="getCards('+resultbid[3]+','+resultbid[1]+', '+resultbid[4]+');this.disabled=true;">Accept</button>'+
               '<button style= "display :'+acceptdisp_var+';"type="button" name="button" class="btn btn-primary" id = "action_accept_btnpvt'+resultbid[3]+'" onclick="getCardsPrivate('+resultbid[3]+','+resultbid[1]+', '+resultbid[4]+');this.disabled=true;">Accept Privately</button>'+
               '<button style= "display :'+rejectdisp_var+';"type="button" name="button" class="btn btn-danger"  id = "action_reject_btn'+resultbid[3]+'" onclick="rejectBid(\''+resultbid[3]+'\','+resultbid[4]+','+resultbid[1]+');this.disabled=true;">Reject</button>'+
               '<button style= "display :'+disp_var+';" type="button" name="button" class="btn btn-danger"  id = "action_conform_btn'+resultbid[3]+'" onclick="itemReceived(\''+resultbid[3]+'\','+resultbid[4]+', '+resultbid[1]+');this.disabled=true;">Confirm</button>' +
            '</td><td>'+resultbid[5]+'</td>';
       })
}

