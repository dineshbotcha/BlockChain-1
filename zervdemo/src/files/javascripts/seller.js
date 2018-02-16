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


window.addEventListener('load', function() {
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://54.244.56.140:8545"));
    Bidding.setProvider(web3.currentProvider);
    Zerv.setProvider(web3.currentProvider);
    User.setProvider(web3.currentProvider);
    Investor.setProvider(web3.currentProvider);
    Asset.setProvider(web3.currentProvider);
    getCookie("address");
    getBalanceSeller();
    getProjectList();
    getBidList();
    getSellerProject();
    Asset.deployed().then(function(instance) {
        AssetAddress = instance.address;
    })
})

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
                return getCookie("password");
            }
            if(name == "password=") {
                UserId = c.substring(name.length, c.length);
                getInvestorName(UserId);
                return c.substring(name.length, c.length);
                
            }

        }
    }
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

window.getSellerProject = function() {
    Bidding.deployed().then(function(instance) {
    return instance.getProjectLength()}).then(function(length) {
        var len = length;
        console.log("len:"+len);
        if(len > 0) {
            var i;
            for(i = 1; i <= len; i++) {
                var a = Promise.resolve(getSellerPro(i));
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
                '<td id="prj_state'+result[4]+'">'+project_state+hashColumn+column;
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


     
window.createBid = function(address) {
    console.log("called");
    var amount = ((document.getElementById("bAmount").value)*2);
    var name = document.getElementById("bName").value;
    var prjId = document.getElementById("proId").value;
    Zerv.deployed().then(function(instance) {
        var ZervContractAddress = instance.address;
        Bidding.deployed().then(function(instance) {
            console.log("called1");
            return instance.createBid(ZervContractAddress, AssetAddress, address, name,prjId, amount, {from:ethAddress, gas:499928}) }).then(function(result){
            console.log(result);
            location.reload();
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
               '<td >'+ resultbid[0] +'</td><td >'+ bidamount +'</td><td id = "bid_list_state'+resultbid[3]+'" >'+ bid_state +'</td><td>NA</td><td>NA</td></tr>'
       })
}

window.displayIpfsFile = function(hash) {
    ipfs.cat(hash, function (err, stream) {
      var res = '';

      stream.on('data', function (chunk) {
        res += chunk.toString()
      })

      stream.on('error', function (err) {
        console.error('Oh nooo', err)    
      })

      stream.on('end', function () {
        console.log('Got:', res);
        document.getElementById('ipfsHashAddress').innerHTML="Ipfs Hash: "+hash;
        document.getElementById('content').innerText=res;
      })
    })
}


window.getInvestorName = function(user) {
    Investor.deployed().then(function(instance) { 
        return instance.getInvestorName(user) }).then(function(result) {
                console.log(result);
                document.getElementById("seller_name").innerHTML = result +" - "+ ethAddress;
        }) 
}
    
window.getBalanceSeller = function() {
    console.log("called");
    Zerv.deployed().then(function(instance) {
    return instance.balanceOf(ethAddress)}).then(function(val) {
        console.log(val);
        document.getElementById("seller_balance").innerHTML = "ZERV Account Balance:" + " " + val;

    })
}


window.getSellerPro = function(pid) {
    Bidding.deployed().then(function(instance) {
        return instance.getBuyerProject(pid, {from:ethAddress, gas:299928})}).then(function(result) {
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
            var table = document.getElementById("bid_list_tabel");
            var y = $('#bid_list_tabel tr').length;
            var row = table.insertRow(y);
            row.innerHTML = '<tr><td >'+ result[0] +'</td><td >'+ pvalue +'</td>'+
                '<td id="prj_state'+result[4]+'">'+project_state+hashColumn+column;
        });
}
