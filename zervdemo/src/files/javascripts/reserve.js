import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'

import zervtoken_artifacts from '../../build/contracts/ZervToken.json'
import assetcard_artifacts from '../../build/contracts/AssetCard.json'

var Token = contract(zervtoken_artifacts);
var Asset = contract(assetcard_artifacts);

window.addEventListener('load', function() {
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://54.244.56.140:8545"));
    Token.setProvider(web3.currentProvider);
    getBalance();
    Asset.setProvider(web3.currentProvider);
    console.log(web3.eth.accounts[0]);
    listAsset();
})

window.getBalance = function () {
    Token.deployed().then(function(instance) {
    return instance.totalSupply() }).then(function(result) {
        document.getElementById("totalTokens").innerHTML = result;
    })
}

var AssetCount= 0;
window.listAsset = function() {
    Asset.deployed().then(function(instance) {
    return instance.getAssetAddrs()}).then (function(address) {
        console.log(address);
        var Addrlen = address.length;        
        for(var i=0; i<address.length; i++) {
            console.log(Addrlen);
            var addr = address[i];
            Addrlen = address.length;
            var details = getCardDetails(addr, Addrlen, i);
        }
    })
}

window.getCardDetails = function(address, len, i) {
    console.log("details");
    Asset.deployed().then(function(instance) {
    return instance.getAsset(address, {from:web3.eth.accounts[0]}) }).then(function(result) {
        console.log(result);
        if(result[2] == "" ) {
          if(i == len-1) {
          pagination();
          }

        } else {
          AssetCount = AssetCount +1;
          var cards = myFunction(address, len, i, result[5], result[3]);
          if(i == len-1) {
            // $pageCount = Math.ceil($rowCount / $n);
            setTimeout(pagination, 2000);
            //pagination();
          }
          
        }
    })
}


var $table,
        // number of rows per page
        $n = 4,
        // number of rows of the table
        $rowCount = 0,
        // an array to hold each row
        $tr = [],
        // loop counters, to start count from rows[1] (2nd row) if the first row has a head tag
        $i,$ii,$j = 0;

    // count the number of pages
var $pageCount=0;

window.pagination = function () {
    $table = document.getElementById("myTable");
    $rowCount = $table.rows[0].cells.length;
    // if we had one page only, then we have nothing to do ..
    console.log($pageCount);
    $pageCount = Math.ceil($rowCount / $n);
    console.log($pageCount);
    if ($pageCount > 1) {
        // assign each row outHTML (tag name & innerHTML) to the array
        for ($i = $j,$ii = 0; $i < $rowCount; $i++, $ii++)
            $tr[$ii] = $table.rows[0].cells[$i].outerHTML;
        // create a div block to hold the buttons
        $table.insertAdjacentHTML("afterend","<div id='buttons'></div");
        // the first sort, default page is the first one
        sort(1);
    }
}
window.sort = function ($p) {
    $table = document.getElementById("myTable");
    $rowCount = $table.rows[0].cells.length;
    /* create ($rows) a variable to hold the group of rows
    ** to be displayed on the selected page,
    ** ($s) the start point .. the first row in each page, Do The Math
    */
    var $rows = "";
    var $s = (($n * $p)-$n);
    console.log($rows);
    for ($i = $s; $i < ($s+$n) && $i < $tr.length; $i++)
        $rows += $tr[$i];

    // now the table has a processed group of rows ..
    $table.innerHTML = $rows;;
    // create the pagination buttons
    document.getElementById("buttons").innerHTML = pageButtons($pageCount,$p);
    // CSS Stuff
    document.getElementById("id"+$p).setAttribute("class","active");
}

// ($pCount) : number of pages,($cur) : current page, the selected one ..
function pageButtons($pCount,$cur) {
    /* this variables will disable the "Prev" button on 1st page
       and "next" button on the last one */
    var $prevDis = ($cur == 1)?"disabled":"",
        $nextDis = ($cur == $pCount)?"disabled":"",
        /* this ($buttons) will hold every single button needed
        ** it will creates each button and sets the onclick attribute
        ** to the "sort" function with a special ($p) number..
        */
        $buttons = "<input type='button' value='&lt;&lt; Prev' onclick='sort("+($cur - 1)+")' "+$prevDis+">";
    for ($i=1; $i<=$pCount;$i++)
        $buttons += "<input type='button' id='id"+$i+"'value='"+$i+"' onclick='sort("+$i+")'>";
    $buttons += "<input type='button' value='Next &gt;&gt;' onclick='sort("+($cur + 1)+")' "+$nextDis+">";
    return $buttons;
}
var row_nr = 0;
var col_nr = 0;
var count = 0;

function myFunction(address, len, i, name, balance) {
    var table = document.getElementById("myTable");
    var row = document.getElementById("assetRow");
    var cell = row.insertCell(col_nr);
    cell.setAttribute("id", "maincell_" + col_nr);
    //Name Header div
    var headerDiv = document.createElement('div');
    headerDiv.setAttribute("id", "assetName" + count );
    headerDiv.setAttribute("style", "padding-top:10px; text-align:center; background-Color: #269abc; color:white;font-family: -webkit-body;" );
    headerDiv.innerHTML = "<h4>Owner: "+name + "</h4>";
    //Balance Div
    
    var balanceDiv = document.createElement('div');
    balanceDiv.setAttribute("id", "assetBalance" + count );
    balanceDiv.setAttribute("style", "padding-top:10px; text-align:center; border:1px 0px solid black ;font-family: -webkit-body;");
    balanceDiv.innerHTML = "<b>Zerv Balance: "+balance+"</b>";
    
    //Header Div
    var div = document.createElement('div');
    div.setAttribute("id", "header_" + count );
    div.setAttribute("class","subAddressHeader");
    div.setAttribute("style", "height:33px; padding-top:13px; width:284px; overflow:hidden !important; text-overflow: ellipsis; text-align:center; font-family: -webkit-body;");
    div.innerHTML="<b>Account Address: </b>";
    //Header Address Div
    var accountDiv = document.createElement('div');
    accountDiv.setAttribute("id", "header_" + count );
    accountDiv.setAttribute("class","subheader");
    accountDiv.setAttribute("style", "width:284px; overflow:hidden !important; text-overflow: ellipsis; text-align:center; margin-bottom:5%; font-family: -webkit-body;");
    accountDiv.innerHTML=address;
    //Footer div
    var div2 = document.createElement('div');
    div2.setAttribute("class","subfooter")
    div2.setAttribute("id", "footer_" + count);
    var a = document.getElementById("maincell_"+ col_nr);
    a.appendChild(headerDiv);
    a.appendChild(balanceDiv);
    a.appendChild(div);
    a.appendChild(accountDiv);
    a.appendChild(div2);
    var str = address.toString();
    var detailsbtn = document.createElement('button');
    detailsbtn.setAttribute("id","detailsbtn_"+count);
    detailsbtn.setAttribute("class", "btn btn-info");
    detailsbtn.setAttribute("style", "width:49%" );
    detailsbtn.innerHTML="Details";
    detailsbtn.setAttribute("onclick","expand(this.parentNode.id)");
    //history
    var historybtn = document.createElement('button');
    historybtn.setAttribute("id","historybtn_"+count);
    historybtn.setAttribute("class", "btn btn-info");
    historybtn.setAttribute("style", "width:49%; margin-left: 1.5%;" );
    historybtn.setAttribute("onclick","historyDetails(this.parentNode.id)");
    historybtn.innerHTML="History";
    var b = document.getElementById("footer_" + count);
    b.appendChild(detailsbtn);
    b.appendChild(historybtn);
    col_nr++;
    count++;
    $rowCount++;
}

window.expand = function(id){
    var alertContent = document.getElementById("alertdiv");
    if(alertContent != null) {
                alertContent.parentNode.removeChild(alertContent);
    }
    var detailRow = document.getElementById("detailsRow");
    detailRow.setAttribute("style", "display:block");
    var parent1 = document.getElementById(id).parentNode.id;
    var addressId = document.getElementById(parent1).childNodes[3].innerHTML;
    Asset.deployed().then(function(instance) {
    return instance.getAsset(addressId, {from:web3.eth.accounts[0]}) }).then(function(result) {
        var historyTable = document.getElementById("historytable");
        historyTable.setAttribute("style", "display:none");
        var x = document.getElementById("detailstable");
        x.setAttribute("style", "display:block");
        document.getElementById("assetAddress").innerHTML = result[0];
        document.getElementById("assetOwner").innerHTML = result[1];
        document.getElementById("name").innerHTML = result[5];
        document.getElementById("balance").innerHTML = result[3];
        document.getElementById("Originalbalance").innerHTML = result[4];
        document.getElementById("ownerName").innerHTML = result[2];
    })
 
}

window.historyDetails = function(id) {
    $("#historytable").find("tr:gt(0)").remove(); 
    var parent1 = document.getElementById(id).parentNode.id;
    var addressId = document.getElementById(parent1).childNodes[3].innerHTML;
    Asset.deployed().then(function(instance) {
      return instance.getHistoryIndex()}).then(function(len) {
        if(len > 0) {
            var i;
            for(i = 1; i <= len; i++) {
              var tmp = Promise.resolve(getHistory(i, id, len));
            }
        } else {
            var alertContent = document.getElementById("alertdiv");
            var detailsTable = document.getElementById("detailstable");
            detailsTable.setAttribute("style", "display:none");
            var alertContent = document.getElementById("alertdiv");
            if(alertContent != null) {
                alertContent.parentNode.removeChild(alertContent);
            }
            var rowAlert = document.createElement('div');
            rowAlert.setAttribute("id", "alertdiv");
            console.log(rowAlert);
            rowAlert.innerHTML = "<h4>No Transactions Available</h4>";
            var Table = document.getElementById('divrow');
            console.log(Table);
            Table.appendChild(rowAlert);
            return;
        }      
    })
}

window.getHistory = function(i,id, historyLength) {
    var detailRow = document.getElementById("detailsRow");
    detailRow.setAttribute("style", "display:block");
    var parent1 = document.getElementById(id).parentNode.id;
    var addressId = document.getElementById(parent1).childNodes[3].innerHTML;
    var detailsTable = document.getElementById("detailstable");
    detailsTable.setAttribute("style", "display:none");
    var x = document.getElementById("historytable");
    x.setAttribute("style", "display:block");
    Asset.deployed().then(function(instance) {
      return instance.getHistory(i, addressId, {from:web3.eth.accounts[0]}) }).then(function(result) {
        if(result[2] == 0) {
          console.log(i);
          var rowCount = document.getElementById('historytable').rows.length;
          console.log(rowCount);
          if( i == historyLength && rowCount == 1) {
            var alertContent = document.getElementById("alertdiv");
            if(alertContent != null) {
                alertContent.parentNode.removeChild(alertContent);
            }
            var rowAlert = document.createElement('div');
            rowAlert.setAttribute("id", "alertdiv");
            console.log(rowAlert);
            rowAlert.innerHTML = "<h4>No Transactions Available</h4>";
            x.setAttribute("style", "display:none");
            var Table = document.getElementById('divrow');
            console.log(Table);
            Table.appendChild(rowAlert);
            return;
          }
          else {
            return;
          }
        }
        else {
          var alertContent = document.getElementById("alertdiv");
            if(alertContent != null) {
                alertContent.parentNode.removeChild(alertContent);
            }
          var detailsTable = document.getElementById("detailstable");
          detailsTable.setAttribute("style", "display:none");
          var table = document.getElementById("historytable");
          var y = $('#historytable tr').length;
          var row = table.insertRow(y);
          row.innerHTML = '<tr><td style = "background-color:#ffffff;">'+ result[0] +'</td><td style = "background-color:#ffffff;">'+ result[1] +'</td><td style = "background-color:#ffffff;">'+ result[2]+'</td><td style = "background-color:#ffffff;">'+result[3]+'</td></tr>';
        }
     })
}

