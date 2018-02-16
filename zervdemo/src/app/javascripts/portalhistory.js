import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
import bidding_artifacts from '../../build/contracts/Bidding.json'
import loginmgmt_artifacts from '../../build/contracts/LoginMgmt.json'

var ipfsAPI = require('ipfs-api')
var ipfs = ipfsAPI('ip4/'+location.hostname+'/tcp/5001', {protocol: 'http'})

var Bidding = contract(bidding_artifacts);
var User = contract(loginmgmt_artifacts);
var ethAddress;

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
    getBidList();
    getCookie("address");
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
                //getInvestorName(UserId);
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

window.getBidList = function() {
    Bidding.deployed().then(function(instance) {
    return instance.getBidLength()}).then(function(length) {
        var len = length;
        if(len > 0) {
            var i;
            for(i = 1; i <= len; i++) {
                var a = Promise.resolve(getBid(i));
            } 
        } 
    })
}

window.getBid = function(bid) {
   var sellerAddrs = web3.eth.accounts[0];
   Bidding.deployed().then(function(instance) {
       return instance.portalHistory(bid, {from:sellerAddrs})}).then(function(resultbid) {
           console.log(resultbid);
           var bidamount = resultbid[1] / 1;
           if (resultbid[1] == 0 && resultbid[2] == 4) {
               bidamount = "private";
           }
           var bid_state ='';
           if(resultbid[2] == 1) {
              bid_state = "Open";
              return "";
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
        Bidding.deployed().then(function(instance) { return instance.Portal(bid)}).then(function(askedPrice) { console.log(askedPrice) 
           Bidding.deployed().then(function(instance) {
               console.log(resultbid[3]);
               console.log(resultbid[4]);
           return instance.getAddress(resultbid[3], resultbid[4]) }).then(function(resultAddr) {
              getFormatDate(askedPrice[1], function(fromatDate) {
                  var hashColumn = '';
                  if (resultAddr[3] == "NA") {
                      hashColumn = '<td>'+resultAddr[3]+'</td>';
                  } else {
                      hashColumn = '<td> <button style= " type="button" name="button" data-toggle="modal" data-target="#myModal" class="btn btn-info"  id = "'+resultAddr[3]+'" onclick="displayIpfsFile(this.id)">Info</button></td>';
                  }
                  var column = '';
                  if (resultAddr[4] == "NA") {
                      column = '<td>'+resultAddr[4]+'</td>';
                  } else {
                      column = '<td> <button style= " type="button" name="button" data-toggle="modal" data-target="#myModal" class="btn btn-info"  id = "'+resultAddr[4]+'" onclick="displayIpfsFile(this.id)">View</button></td>';
                  }
                  var table = document.getElementById("projectListTable");
                  var y = $('#projectListTable tr').length;
                  var row = table.insertRow(y);
                  row.innerHTML = '<tr> '+
                   '<td >'+ resultbid[0] +'</td><td >'+askedPrice[0]+'</td><td>'+ bidamount +'</td><td>'+fromatDate+'</td><td id = "bid_list_state'+resultbid[3]+'" >'+ bid_state +'</td><td>'+resultbid[6]+'</td><td>'+resultbid[5]+'</td><td>'+resultAddr[2]+
                   '</td>'+hashColumn+column+'<td>'+resultAddr[0]+'</td><td>'+resultAddr[1]+'</td></tr>';
              })
          })
        })
    })
}

window.getFormatDate = function (timestamp, callback) {
    var t = new Date(1970, 0, 1); // Epoch
    t.setSeconds(timestamp);
    var dt =  t.getMonth() +1 + "/" + t.getDate() + "/" + t.getFullYear();
    callback(dt);
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
