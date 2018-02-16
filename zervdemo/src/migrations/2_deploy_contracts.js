var InvestorRegister = artifacts.require("./InvestorRegister.sol");
var LoginMgmt =  artifacts.require("./LoginMgmt.sol");
var ZervToken = artifacts.require("./ZervToken.sol");
var Bidding = artifacts.require("./Bidding.sol");
var AssetCard = artifacts.require("./AssetCard.sol");


module.exports = function(deployer) {
deployer.deploy(InvestorRegister, { privateFor: ["uGwdY2PBKjHHQDnWR8E2I8v5iRqHyAJC2pMjWt0jPF0=", "Lnxxh1wUgVnXM3Ir1loebS5jWD8Up/XGW+bPILNY11c=", "DvWk+OQJdnJ3Wixo9p46Oq8VY4bSLBmgXvcy0RKzFC4=", "Xw/I9N+VWVhSRTKzVSPNurXY3AehO1RAuWZY8a9sCkg=", "HOcfl5kUDec6MVENxRy4B0KAhAZuNNotTjx9C8e54SY=", "5ISbHOhw29MtOx5f/5MWVVeH+6mPkRSWsA4uwpj+8UE="]} );
  deployer.deploy(LoginMgmt, { privateFor: ["uGwdY2PBKjHHQDnWR8E2I8v5iRqHyAJC2pMjWt0jPF0=", "Lnxxh1wUgVnXM3Ir1loebS5jWD8Up/XGW+bPILNY11c=", "DvWk+OQJdnJ3Wixo9p46Oq8VY4bSLBmgXvcy0RKzFC4=", "Xw/I9N+VWVhSRTKzVSPNurXY3AehO1RAuWZY8a9sCkg=", "HOcfl5kUDec6MVENxRy4B0KAhAZuNNotTjx9C8e54SY=", "5ISbHOhw29MtOx5f/5MWVVeH+6mPkRSWsA4uwpj+8UE="]} );
  deployer.deploy(ZervToken, { privateFor: ["uGwdY2PBKjHHQDnWR8E2I8v5iRqHyAJC2pMjWt0jPF0=", "Lnxxh1wUgVnXM3Ir1loebS5jWD8Up/XGW+bPILNY11c=", "DvWk+OQJdnJ3Wixo9p46Oq8VY4bSLBmgXvcy0RKzFC4=", "Xw/I9N+VWVhSRTKzVSPNurXY3AehO1RAuWZY8a9sCkg=", "HOcfl5kUDec6MVENxRy4B0KAhAZuNNotTjx9C8e54SY=", "5ISbHOhw29MtOx5f/5MWVVeH+6mPkRSWsA4uwpj+8UE="]} );
  deployer.deploy(Bidding, { privateFor: ["uGwdY2PBKjHHQDnWR8E2I8v5iRqHyAJC2pMjWt0jPF0=", "Lnxxh1wUgVnXM3Ir1loebS5jWD8Up/XGW+bPILNY11c=", "DvWk+OQJdnJ3Wixo9p46Oq8VY4bSLBmgXvcy0RKzFC4=", "Xw/I9N+VWVhSRTKzVSPNurXY3AehO1RAuWZY8a9sCkg=", "HOcfl5kUDec6MVENxRy4B0KAhAZuNNotTjx9C8e54SY=", "5ISbHOhw29MtOx5f/5MWVVeH+6mPkRSWsA4uwpj+8UE="]} );
  deployer.deploy(AssetCard, { privateFor: ["uGwdY2PBKjHHQDnWR8E2I8v5iRqHyAJC2pMjWt0jPF0=", "Lnxxh1wUgVnXM3Ir1loebS5jWD8Up/XGW+bPILNY11c=", "DvWk+OQJdnJ3Wixo9p46Oq8VY4bSLBmgXvcy0RKzFC4=", "Xw/I9N+VWVhSRTKzVSPNurXY3AehO1RAuWZY8a9sCkg=", "HOcfl5kUDec6MVENxRy4B0KAhAZuNNotTjx9C8e54SY=", "5ISbHOhw29MtOx5f/5MWVVeH+6mPkRSWsA4uwpj+8UE="]} );
};


