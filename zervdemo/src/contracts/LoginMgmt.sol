pragma solidity ^0.4.11;

contract LoginMgmt {

    struct UserStruct {
      uint index;
      uint password;
      address etherAddress;
      string role;
    }
  
    mapping(string => UserStruct[]) user;
    
    address[] ethAddr = [0x7282116b841a74d93eae5d05fe1143246fe5368e, 
                         0xea2478c5a94300ea3c3fb5c242b4f9c286db808f,
                         0xec919820273c0324d7e418f234c2df35067b6718,
                         0xd1f2bd280eb0ed1c8d9c70b4194f17a20d0a2269,
                         0x3fa033d888f2a34b14f9a0f43a56d00227947c48,
                         0x4a1aa93ac2ac57c59f46cab36bd165a451f68463
                         ];

    string[]  name = ["M1", "M2", "S1", "S2", "R1", "R2"];
    uint[] pwd = [1005, 1010, 1015, 1020, 1025, 1030];
    string[] role = ["jsonrpcA", "jsonrpcB", "jsonrpcC", "jsonrpcD", "jsonrpcE", "jsonrpcF"];
   
    function LoginMgmt() {
        for (uint i=0; i<ethAddr.length; i++) {
            user[name[i]].push(UserStruct(i, pwd[i], ethAddr[i], role[i]));
        }
        
    }
    
    function getUser(string name, uint pasword) public  constant returns(address eth, string roles) {
        for(uint i=0;i<2;i++) {
            if(user[name][i].password == pasword) {
                return (user[name][i].etherAddress, user[name][i].role);
            }
        }
        
        
    }
    
        function getUserDetails(address addr, string name) public constant returns(string role) {
        for(uint i=0; i<6; i++) {
            if(user[name][i].etherAddress == addr) {
                return (user[name][i].role);
            }
        }
    }
}
