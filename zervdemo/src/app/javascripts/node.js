import { default as Web3} from 'web3'

var UserId;
window.addEventListener('load', function() {
   getCookie("userrole");
})

window.setweb3 = function (url) {
    console.log(url);
    setRpc(url);
}

var rpurl;
window.setRpc = function (rpcurl) {
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://"+location.host+"/"+rpcurl));
    //window.web3 = new Web3(new Web3.providers.HttpProvider("http://54.186.254.137:"+rpcurl));
    rpurl = ("http://"+location.host+"/"+rpcurl);
    var peerCount = web3.net.peerCount;
    console.log(peerCount);
    document.getElementById("peers").innerHTML = peerCount;
    peers();
    var blocks = web3.eth.blockNumber;
    document.getElementById("blocks").innerHTML = blocks;
    nodeInfo();
    accounts();
    getCookie("address");
}

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
                //ethAddress = c.substring(name.length, c.length);
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
                //document.getElementById("tradingPartner").innerHTML = name;
                console.log(name);
                
                //return getCookie("address");
                return setweb3(name);
            }
        }
    }
    //return "empty";
}

window.delCookie = function () {
   console.log("1234");
   document.cookie = "address=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
   document.cookie = "password=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

window.peers = function () {
   var jsonData = '{"jsonrpc":"2.0","method": "txpool_status","id":4}';
   $.ajax({
    url: rpurl,
    type: "POST",
    dataType: "json",
    data: jsonData,
    contentType: "application/json",
    success:function(data) {
      console.log(data);
      console.log(data.result.queued);
      document.getElementById("queuedTransaction").innerHTML = data.result.queued;
      
    }
   });
}

window.nodeInfo = function () {
   var jsonData = '{"jsonrpc":"2.0","method": "admin_nodeInfo","id":4}';
   $.ajax({
    url: rpurl,
    type: "POST",
    dataType: "json",
    data: jsonData,
    contentType: "application/json",
    success:function(data) {
        console.log(data);
        document.getElementById("nodeId").innerHTML = data.result.id;
        document.getElementById("nodeUrl").innerHTML = data.result.enode;
        document.getElementById("jsonrpcUrl").innerHTML = rpurl;
        document.getElementById("nodeName").innerHTML = data.result.name;
        document.getElementById("networkId").innerHTML = data.result.protocols.eth.network;
      
    }
   });
}

window.accounts = function() {
    var array = web3.eth.accounts;
    console.log(array);
    //var array = []
    var tbody = document.getElementById("tbody");
    for(var i=0; i<array.length;i++) {
        var tr = document.createElement('TR'); 
        var td1 = document.createElement('TD');
        var td2 = document.createElement('TD');
        td1.appendChild(document.createTextNode(array[i]));
        var bal = web3.eth.getBalance(array[i]);
        td2.appendChild(document.createTextNode(bal));
        tr.appendChild(td1);
        tr.appendChild(td2);
        tbody.appendChild(tr);
    }
}

window.createAddr = function () {
   var jsonData = '{"jsonrpc":"2.0","method":"personal_newAccount","params":[""],"id":4}';
   $.ajax({
    url: rpurl,
    type: "POST",
    dataType: "json",
    data: jsonData,
    contentType: "application/json",
    success:function(data) {
    if(data) {
      console.log(data);
      //createUser(data.result);
      console.log(data.result);
      unlockAccount(address);
    } else { console.log("Not Created"); }
    }
   });
}

window.unlockAccount = function(address) {
    var jsonData = '{"jsonrpc":"2.0", "method": "personal_unlockAccount", "params": ["", 0], "id:4}';
    $.ajax({
        url: rpurl,
        type: "POST",
        dataType: "json",
        data: jsonData,
        contentType: "application/json",
        success:function(data) {
            if(data) {
              console.log(data);
              //createUser(data.result);
              console.log(data.result);
              accounts();
            } else { console.log("Account Locked"); }
        }
    });
}


