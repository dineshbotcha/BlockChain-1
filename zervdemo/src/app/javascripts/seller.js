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
var Investor = contract(investorregister_artifacts);
var User = contract(loginmgmt_artifacts);
var Asset = contract(assetcard_artifacts);
var ethAddress;
var UserId;
var AssetAddress;
var count =0;

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
    getCookie("address");
    getBalanceSeller();
    getProjectList();
    getBidList();
    listAsset();
    Asset.deployed().then(function(instance) {
     AssetAddress  = instance.address;
   })

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
                //getBalanceBuyer();
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

window.getInvestorName = function(user) {
    Investor.deployed().then(function(instance) { 
        return instance.getInvestorName(user) }).then(function(result) {
            document.getElementById("seller_name").innerHTML = result;
            document.getElementById("userAddress").innerHTML = ethAddress;
              
        }) 
}


window.delCookie = function () {
   console.log("1234");
   document.cookie = "address=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
   document.cookie = "password=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

window.getProjectList = function() {
    Bidding.deployed().then(function(instance) {
    return instance.getProjectLength()}).then(function(length) {
        var len = length;
        console.log("len:"+len);
        if(len > 0) {
            var i;
            for(i = 1; i <= len; i++) {
                var a = Promise.resolve(getPro(i));
            } 
        } 
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

window.getCardsDetails = function(address, len, i) {
    console.log("details");
    Asset.deployed().then(function(instance) {
    return instance.getAsset(address, {from:ethAddress}) }).then(function(result) {
        console.log(result);
        if(result[2] == "" ) {
          if(i == len-1) {
          }
        } else {
          AssetCount = AssetCount +1;
          document.getElementById("totalInvestors").innerHTML = AssetCount;
          if(i == len-1) {
          }
        }

    })
}

window.getBidList = function() {
    Bidding.deployed().then(function(instance) {
    return instance.getBidLength()}).then (function(length) {
        console.log("len:"+length);
        if (length > 0) {
            var i;
            for(i = 1; i <= length; i++) {
              var a = Promise.resolve(getBid(i));
            }
        }
    })
}


window.getPro = function(pid) {
    Bidding.deployed().then(function(instance) {
        return instance.getProject(pid, {from:ethAddress})}).then(function(result) {
            var pvalue = result[2];
            if(pvalue == 0) {
              return ""
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
            console.log(y);
            var row = table.insertRow(y);
            row.innerHTML = '<tr><td> <input  onclick="load_bid(\''+result[0]+'\','+result[4]+' )" type="radio" name="prj_select" value="'+result[4]+'"> </td>'+
                '<td >'+ result[0] +'</td><td >'+ result[1] +'</td><td >'+ pvalue +'</td>'+
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


window.getCards = function() {
    Asset.deployed().then(function(instance) {
    return instance.getAssetAddrs()}).then (function(address) {
        if(count < address.length) {
            getCardDetails(address[count], function(response) {
                getCardBalance(response, function(respons) {
                    if(respons >= (document.getElementById("bAmount").value)*2) {
                        console.log("printed:"+respons);
                        return createBid(address[count]);
                    }
                    else {
                      count = count+1;
                      getCards();
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
            count = count+1;
            getCards();
        } else {
            callback(address);
        }
    }).catch(function(err) { console.log(err) })
}

window.getCardBalance = function(address, callback) {
    Asset.deployed().then(function(instance) {
    return instance.balanceOf(address) }).then(function(balance) {
        console.log(balance);
        callback(balance);
    })
}

window.tokenBalance = function (value, callback) {
    Zerv.deployed().then(function(instance) {
    return instance.balanceOf(ethAddress)}).then(function(val) {
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

window.createBid = function(address) {
    console.log("called");
    var amount = ((document.getElementById("bAmount").value)*2);
    var name = document.getElementById("bName").value;
    var prjId = document.getElementById("proId").value;
    var tradePartner = document.getElementById("tradingPartner").innerText;
    getUserRole("userrole", function(nodekey) {
        Zerv.deployed().then(function(instance) {
            var ZervContractAddress = instance.address;
            Bidding.deployed().then(function(instance) {
                console.log("called1");
                console.log(nodekey.node1, nodekey.node2, nodekey.node3, nodekey.node4, nodekey.node5);
                console.log(ZervContractAddress, AssetAddress, address, name,prjId, amount, tradePartner,);
                return instance.createBid(ZervContractAddress, AssetAddress, address, name,prjId, amount, tradePartner, {from:ethAddress, gas:499928, privateFor: ["IbTNgT4uQiGfqQMMz1gfggc9fsq3OTgERqzpTLrR0Es=", nodekey.node1, nodekey.node2, nodekey.node3, nodekey.node4, nodekey.node5]}) }).then(function(result){
                console.log(result);
                location.reload();
            })
        })
    })
}

window.getBid = function(bid) {
   Bidding.deployed().then(function(instance) {
       return instance.getSellerBid(bid, {from:ethAddress})}).then(function(resultbid) {
           var bidamount = resultbid[1] / 1;
           if (bidamount == 0) {
             return "";
           }
           var bid_state ='';
           if(resultbid[2] == 1) {
              bid_state = "Open";
           }
           if(resultbid[2] == 2) {
              bid_state = "Accepted";
           }
           if(resultbid[2] == 3) {
              bid_state = "Rejected";
           }
           if(resultbid[2] == 4) {
              bid_state = "Closed";
           }

           var table2 = document.getElementById("bid_list_tabel");
           var y2 = $('#bid_list_tabel tr').length;
           var row2 = table2.insertRow(y2);
           row2.innerHTML = '<tr> '+
               '<td >'+ resultbid[0] +'</td><td >'+ bidamount +'</td><td id = "bid_list_state'+resultbid[3]+'" >'+ bid_state +'</td><td>NA</td><td>NA</td><td>'+resultbid[5]+'</td></tr>'
       })
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
      //})
      })
}
    
window.getBalanceSeller = function() {
    console.log("called");
    Zerv.deployed().then(function(instance) {
    return instance.balanceOf(ethAddress)}).then(function(val) {
        console.log(val);
        document.getElementById("buyer_balance").innerHTML = val;

    })
}

