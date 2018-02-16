import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
import bidding_artifacts from '../../build/contracts/Bidding.json'

var ipfsAPI = require('ipfs-api')
var ipfs = ipfsAPI('ip4/'+location.hostname+'/tcp/5001', {protocol: 'http'})

var Bidding = contract(bidding_artifacts);

window.addEventListener('load', function() {
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://"+location.hostname+"/jsonrpc"));
    Bidding.setProvider(web3.currentProvider);
    getBidList();
})

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
       return instance.getBid(bid, {from:sellerAddrs})}).then(function(resultbid) {
           Bidding.deployed().then(function(instance) {
           return instance.getProject(resultbid[4],{from:sellerAddrs}) }).then(function(offer) {
                   var initialOffer = offer[2];
               var bidamount = resultbid[1] / 1;
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
               Bidding.deployed().then(function(instance) {
               return instance.getAddress(resultbid[3], resultbid[4]) }).then(function(resultAddr) {
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
                   '<td >'+ resultbid[0] +'</td><td >'+initialOffer+'</td><td>'+ bidamount +'</td><td id = "bid_list_state'+resultbid[3]+'" >'+ bid_state +'</td><td>'+resultbid[6]+'</td><td>'+resultbid[5]+'</td><td>'+resultAddr[2]+
                   '</td>'+hashColumn+column+'<td>'+resultAddr[0]+'</td><td>'+resultAddr[1]+'</td></tr>';
                })
            })
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
