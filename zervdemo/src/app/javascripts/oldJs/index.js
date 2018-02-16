import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.

import loginmgmt_artifacts from '../../build/contracts/LoginMgmt.json'


var ipfsAPI = require('ipfs-api')
var ipfs = ipfsAPI('ip4/'+location.hostname+'/tcp/5001', {protocol: 'http'})

var User = contract(loginmgmt_artifacts);
var buyerAddrs;

window.addEventListener('load', function() {
    console.log("called");
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://"+location.host+"/jsonrpc"));
    //window.web3 = new Web3(new Web3.providers.HttpProvider("http://54.244.56.140:8545"));
    User.setProvider(web3.currentProvider);
})


window.setCookie = function (cname,cvalue,exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

window.getCookie = function () {
    var name = "address" + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
	console.log(JSON.stringify(ca));
    if(ca[0] == "") {
        login();
    }
    else {
        delCookie();
    }
}

window.checkCookie = function () {
    var user=getCookie("username");
    if (user != "") {
        alert("Welcome again " + user);
    } else {
       user = prompt("Please enter your name:","");
       if (user != "" && user != null) {
           setCookie("username", user, 30);
       }
    }
}
window.delCookie = function () {
   console.log("1234");
   document.cookie = "address=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
   document.cookie = "password=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
   login();
}
window.login = function (){
  console.log("called");
  var userName =  document.getElementById('userName').value;
  var userPassword =  document.getElementById('password').value;
  
  
    var buyerAddrs = web3.eth.accounts[0];
    User.deployed().then(function(instance) {
    console.log(instance);
    return instance.getUser(userName , userPassword, {from:web3.eth.accounts[0]})}).then(function(val) {
        console.log(val);
        if(val != "0x") {
	
	     var d = new Date();
    	 d.setTime(d.getTime() + (30*24*60*60*1000));
    	 var expires = "expires=" + d.toGMTString();
    	 document.cookie = "address" + "=" + val+ ";" + expires + ";path=/";
         document.cookie = "password" + "=" + userPassword+ ";" + expires + ";path=/";
         document.cookie = "username" + "=" + userName+ ";" + expires + ";path=/";
         window.location.href="http://"+location.host + "/blockchain/home.html" 
	}
        else {
         alert("Invalid User Name or Password");
        }
    }).catch(function(err) { alert("Invalid User Name or Password") })
  

}
