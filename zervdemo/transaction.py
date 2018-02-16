"""This is for smart contract buyer seller transaction"""
import json
import argparse
import time
import yaml
from web3 import Web3

PARSER = argparse.ArgumentParser(prog='PROG')
PARSER.add_argument('--URL')
PARSER.add_argument('--port')
PARSER.add_argument('--contractAddress')
PARSER.add_argument('--loginContract_address')
PARSER.add_argument('--zervcontract_address')
PARSER.add_argument('--assetcontract_address')
PARSER.add_argument('--investorcontract_address')
PARSER.add_argument('--biddingcontract_address')
PARSER.add_argument('--abiFile')
PARSER.add_argument('--inputFile')
ARGS = PARSER.parse_args()


WEB3 = Web3(Web3.HTTPProvider('http:'+str(ARGS.URL)+':'+str(ARGS.port)))

CONTRACTADDRESS = str(ARGS.contractAddress)
LOGINCONTRACTADDRESS = str(ARGS.loginContract_address)
ZERVCONTRACTADDRESS = str(ARGS.zervcontract_address)
ASSETCONTRACTADDRESS = str(ARGS.assetcontract_address)
INVESTORADDRESS = str(ARGS.investorcontract_address)
BIDDINGCONTRACTADDRESS = str(ARGS.biddingcontract_address)

ABIFILE = str(ARGS.abiFile)

with open(ABIFILE, 'r') as f:
    ABIBYTECODE = yaml.load(f)

ABIZERVRAW = ABIBYTECODE['abizervContract']
ABIZERV = json.loads(ABIZERVRAW)
BYTECODEZERV = ABIBYTECODE['bitcodezervContract']

ABIASSETRAW = ABIBYTECODE['abiassetCardContract']
ABIASSET = json.loads(ABIASSETRAW)
BYTECODEASSET = ABIBYTECODE['bitcodeassetCardContract']

ABILOGINRAW = ABIBYTECODE['abiLoginContract']
ABILOGIN = json.loads(ABILOGINRAW)
BYTECODELOGIN = ABIBYTECODE['bitcodeLoginContract']

ABIINVESTORRAW = ABIBYTECODE['abiCreateInvestor']
ABIINVESTOR = json.loads(ABIINVESTORRAW)
BYTECODEINVESTOR = ABIBYTECODE['bitcodeCreateInvestor']

ABIBIDDINGRAW = ABIBYTECODE['abiBiddingContract']
ABIBIDDING = json.loads(ABIBIDDINGRAW)
BYTECODEBIDDING = ABIBYTECODE['bitcodeBiddingContract']

#login function for a contract
MYCONTRACTLOGIN = WEB3.eth.contract(abi=ABILOGIN, bytecode=BYTECODELOGIN)
MYCONTRACT = MYCONTRACTLOGIN(LOGINCONTRACTADDRESS)
FCONTRACTLOGIN = WEB3.eth.contract(LOGINCONTRACTADDRESS, abi=ABILOGIN)

#create zerv contract
MYCONTRACTZERV = WEB3.eth.contract(abi=ABIZERV, bytecode=BYTECODEZERV)

#create assetCard contract
MYCONTRACTASSETCARD = WEB3.eth.contract(abi=ABIASSET, \
                       bytecode=BYTECODEASSET)
MYCONTRACT = MYCONTRACTASSETCARD(ASSETCONTRACTADDRESS)
FCONTRACTASSETCARD = WEB3.eth.contract(ASSETCONTRACTADDRESS, abi=ABIASSET)

#create investor for a contract
MYCONTRACTINVESTOR = WEB3.eth.contract(abi=ABIINVESTOR, \
                      bytecode=BYTECODEINVESTOR)
MYCONTRACT = MYCONTRACTINVESTOR(INVESTORADDRESS)
FCONTRACTINVESTOR = WEB3.eth.contract(INVESTORADDRESS, abi=ABIINVESTOR)

#bidding contract
MYCONTRACTBIDDING = WEB3.eth.contract(abi=ABIBIDDING, \
                     bytecode=BYTECODEBIDDING)
MYCONTRACTS = MYCONTRACTBIDDING(BIDDINGCONTRACTADDRESS)
FCONTRACTBIDDING = WEB3.eth.contract(BIDDINGCONTRACTADDRESS, abi=ABIBIDDING)

INPUTFILE = str(ARGS.inputFile)

with open(INPUTFILE, 'r') as f:
    DATA = yaml.load(f)

INVESTOR = DATA['CreateInvestorRecord']
TRANSACTIONS = DATA['transactions']

LENGTH = FCONTRACTBIDDING.call({\
         'from': WEB3.eth.accounts[0]}).\
         getProjectLength()

GETBIDLENGTH = FCONTRACTBIDDING.call({\
                    'from':WEB3.eth.accounts[0]}).\
                    getBidLength()
print(GETBIDLENGTH)

def createinvestor():
    """Create investor record"""
    for i in enumerate(INVESTOR):
        administrator = i[1]['administrator']
        investmentdate = i[1]['investmentDate']
        investmentamount = i[1]['investmentAmount']
        dochash = i[1]['docHash']
        investedamount = i[1]['investedAmount']
        assetname = i[1]['assetName']
        fullname = i[1]['fullname']
        userlogin = DATA['users']

        for j in enumerate(userlogin):
            if j[0] in range(len(userlogin)):
                username = j[1]['userName']
                userpassword = j[1]['userPassword']

                if username == administrator:
                    login = FCONTRACTLOGIN.call({\
                            'from':WEB3.eth.accounts[0]}).\
                            getUser(username, userpassword)
                    loginaddress = str(login)

                    createinvestorrecord = FCONTRACTINVESTOR.transact({\
                                      'from':loginaddress, 'gas':700000}).\
                                      createInvestorRecord(\
                                      CONTRACTADDRESS, ZERVCONTRACTADDRESS, \
                                      ASSETCONTRACTADDRESS, administrator, \
                                      investmentdate, investmentamount, \
                                      dochash, investedamount, \
                                      assetname, fullname)
                    print(createinvestorrecord)
                    receipt = WEB3.eth.getTransactionReceipt(createinvestorrecord)

                    if receipt is None:
                        def callreceipt(receipt):
                            """for checking whether the investor record is created"""
                            if receipt is None:
                                #print(receipt)
                                receipt = WEB3.eth.getTransactionReceipt(createinvestorrecord)
                                time.sleep(4)
                                callreceipt(receipt)

                            else:
                                print(receipt)

                        callreceipt(receipt)
                    else:
                        print("success")

createinvestor()

def createpurchaseorder(purchase):
    """Create purchase order from buyer"""
    purchaseuser = purchase['user']
    projectname = purchase['projectName']
    description = purchase['description']
    hashh = purchase['hash']
    filehash = purchase['fileHash']
    offeramount = purchase['offerAmount']
    print(offeramount)
    userlogin = DATA['users']

    for i, user in enumerate(userlogin):
        if i in range(len(userlogin)):
            username = user['userName']
            userpassword = user['userPassword']
            if username == purchaseuser:
                loginbuyer = FCONTRACTLOGIN.call({\
                              'from':WEB3.eth.accounts[0]}).\
                              getUser(username, userpassword)
                print(loginbuyer)
                loginaddress = str(loginbuyer)

                createpurchase = FCONTRACTBIDDING.transact({\
                                 'from':loginaddress, 'gas':900000}).\
                                 createProject(projectname,\
                                 description, offeramount, \
                                 hashh, filehash, username)
                print(createpurchase)
                receipt = WEB3.eth.getTransactionReceipt(createpurchase)

                if receipt is None:
                    print(receipt)

                    def callreceipt(receipt):
                        """Checking whether the purchase is created"""
                        if receipt is None:
                            receipt = WEB3.eth.getTransactionReceipt(createpurchase)
                            time.sleep(4)
                            callreceipt(receipt)
                        else:
                            print(receipt)

                    callreceipt(receipt)
                else:
                    print("success")

def createbidfunction(assetlength, logincontract, offeramount, projectname, bidofferamount, username):
    """Creating bid for the buyer"""
    count1 = 0

    while count1 < assetlength:
        count = count1
        if count < assetlength:
            getassetcardaddress = FCONTRACTASSETCARD.call().\
                                   getAssetAddrs()
            getassetcardaddress = getassetcardaddress[count]

            getasset = FCONTRACTASSETCARD.call({\
                        'from':logincontract}).getAsset(\
                        getassetcardaddress)

            if getasset[2] == "":
                count1 = count+1
            if getasset[2] != "":
                balanceof = FCONTRACTASSETCARD.call({\
                            'from':logincontract}).balanceOf(\
                            getassetcardaddress)

                balanceof = int(balanceof)

                if balanceof >= offeramount:
                    assetcardaddress = getassetcardaddress

                    global LENGTH
                    length = LENGTH+1

                    createbid = FCONTRACTBIDDING.transact({\
                                'from':logincontract, 'gas':499928}).createBid\
                                (ZERVCONTRACTADDRESS,\
                                ASSETCONTRACTADDRESS, \
                                assetcardaddress, \
                                projectname,\
                                length, bidofferamount, username)

                    print(createbid)
                    receipt = WEB3.eth.getTransactionReceipt(createbid)
                    print(receipt)
                    if receipt is None:
                        print(receipt)

                        def callreceipt(receipt):
                            """Checking whether the bid is created"""
                            if receipt is None:
                                receipt = WEB3.eth.getTransactionReceipt(createbid)
                                time.sleep(4)
                                callreceipt(receipt)
                            else:
                                print(receipt)

                        callreceipt(receipt)
                    else:
                        print("success")

                    break
                count1 = count+1

def createbidoffer(bidoffer, description):
    """Create bid offer by the seller"""
    purchase = description[0]
    userseller = bidoffer['user']
    projectname = bidoffer['purchasename']
    bidofferamount = bidoffer['bidOfferAmount']
    offeramount = purchase['offerAmount']
    userlogin = DATA['users']

    for i, user in enumerate(userlogin):
        if i in range(len(userlogin)):
            username = user['userName']
            userpassword = user['userPassword']
            if username == userseller:
                print(username)
                print(userpassword)
                logincontract = FCONTRACTLOGIN.call({\
                                'from':WEB3.eth.accounts[0]}).getUser(\
                                username, userpassword)
                logincontract = str(logincontract)
                getassetcardaddress = FCONTRACTASSETCARD.call().\
                                       getAssetAddrs()
                assetlength = len(getassetcardaddress)
                createbidfunction(assetlength, logincontract, \
                                 offeramount, projectname, \
                                 bidofferamount, username)

def bidaccept(assetcardaddress, logincontract, description):
    """function call from accept bid 2"""
    bidofferlist = []
    for contract in enumerate(description):
        transaction1 = contract[1]['action']
        if transaction1 == 'createBidOffer':
            bidoffer = contract[1]['bidOfferAmount']
            bidofferlist.append(bidoffer)

    listbid = list(bidofferlist)
    #lengthlist = len(listbid)+1
    totallength = GETBIDLENGTH+len(listbid)

    bidlength = FCONTRACTBIDDING.call({\
                                'from':logincontract}).\
                                getBidLength()
    print("bid length after creating bid           "+str(bidlength))
    while bidlength != totallength:
        bidlength = FCONTRACTBIDDING.call({\
                    'from':logincontract}).\
                    getBidLength()
        time.sleep(3)

    for contract in enumerate(description):
        bidofferlist.sort()
        #leastbidoffer = bidofferlist[0]
        transaction2 = contract[1]['action']

        if transaction2 == 'createBidOffer':
            bidoffer = contract[1]['bidOfferAmount']
            if bidoffer == bidofferlist[0]:
                position = listbid.index(bidoffer)
                bidlength = GETBIDLENGTH+(position+1)
                print("bid for accepting the bid           "+str(bidlength))

                getbid = FCONTRACTBIDDING.call({\
                         'from':logincontract}).\
                         getBid(bidlength)

                if getbid[1] != 0:
                    bidid = bidlength
                if getbid[2] == 1:
                    bidid = bidlength
                    proid = (getbid[4])

                    acceptbid = FCONTRACTBIDDING.transact({\
                                'from':logincontract, 'gas':499928}).acceptBid(\
                                ZERVCONTRACTADDRESS, ASSETCONTRACTADDRESS,\
                                assetcardaddress, bidid, proid)

                    print(acceptbid)

            else:
                position = listbid.index(bidoffer)
                bidlength = GETBIDLENGTH+(position+1)
                print("bid for rejecting             "+str(bidlength))
                getbid = FCONTRACTBIDDING.call({\
                         'from':logincontract}).\
                         getBid(bidlength)

                if getbid[1] != 0:
                    bidid = bidlength
                if getbid[2] == 1:
                    bidid = bidlength
                    rejectbid = FCONTRACTBIDDING.transact({\
                                'from':logincontract, 'gas':499928}).rejectBid(\
                                ZERVCONTRACTADDRESS, ASSETCONTRACTADDRESS,\
                                bidid)

                    print(rejectbid)


def acceptbidfunction(cardlength, logincontract, offeramount, description):
    """Function call from accept bid 1"""
    count1 = 0

    while count1 < cardlength:
        count = count1

        if count < cardlength:
            getassetcardaddress = FCONTRACTASSETCARD.\
                                   call().\
                                   getAssetAddrs()
            getassetcardaddress = getassetcardaddress\
                                   [count]

            getasset = FCONTRACTASSETCARD.call({\
                       'from':logincontract}).getAsset(\
                       getassetcardaddress)

            if getasset[2] == "":
                count1 = count+1

            if getasset[2] != "":
                balanceof = FCONTRACTASSETCARD.call({\
                             'from':logincontract}).\
                             balanceOf(\
                             getassetcardaddress)

                balanceof = int(balanceof)
                if balanceof >= offeramount:
                    assetcardaddress = getassetcardaddress
                    bidaccept(assetcardaddress, \
                              logincontract, description)
                    break
                count1 = count+1

def createacceptbidoffer(acceptbidoffer, description):
    """Accept bid offer by the buyer"""
    useraccept = acceptbidoffer['user']
    offeramount = description[0]['offerAmount']
    userlogin = DATA['users']

    for i, user in enumerate(userlogin):
        if i in range(len(userlogin)):
            username = user['userName']
            userpassword = user['userPassword']
            if username == useraccept:
                print(username)
                print(userpassword)
                logincontract = FCONTRACTLOGIN.call({\
                                 'from':WEB3.eth.accounts[0]}).getUser(\
                                 username, userpassword)

                getassetcardaddress = FCONTRACTASSETCARD.call().\
                                       getAssetAddrs()
                cardlength = len(getassetcardaddress)
                acceptbidfunction(cardlength, logincontract, \
                                  offeramount, description)

def confirmbiditem(logincontract, description):
    """Confirm bid item after the accept bit by the buyer"""
    bidofferlist = []
    for contract in enumerate(description):
        transaction1 = contract[1]['action']
        if transaction1 == 'createBidOffer':
            bidoffer = contract[1]['bidOfferAmount']
            bidofferlist.append(bidoffer)

    listbid = list(bidofferlist)
    for contract in enumerate(description):
        bidofferlist.sort()
        #leastbidoffer = bidofferlist[0]
        transaction2 = contract[1]['action']

        if transaction2 == 'createBidOffer':
            bidoffer = contract[1]['bidOfferAmount']
            if bidoffer == bidofferlist[0]:
                position = listbid.index(bidoffer)
                bidlength = GETBIDLENGTH+(position+1)
                print(bidlength)
                getbid = FCONTRACTBIDDING.call({\
                         'from':logincontract}).\
                         getBid(bidlength)

                if getbid[1] != 0:
                    while getbid[2] != 2:
                        getbid = FCONTRACTBIDDING.call({\
                              'from':logincontract}).\
                              getBid(bidlength)
                        time.sleep(3)

                    bidid = bidlength
                    proid = (getbid[4])

                    item = FCONTRACTBIDDING.transact({\
                                'from':logincontract, 'gas':599928}).itemReceived(\
                                ZERVCONTRACTADDRESS, ASSETCONTRACTADDRESS,\
                                bidid, proid)

                    print(item)

def createconfirmoffer(confirmoffer, description):
    """Confirm offer after item received"""
    userconfirm = confirmoffer['user']
    userlogin = DATA['users']

    for i, user in enumerate(userlogin):
        if i in range(len(userlogin)):
            username = user['userName']
            userpassword = user['userPassword']
            if username == userconfirm:
                print(username)
                print(userpassword)
                logincontract = FCONTRACTLOGIN.call({\
                                 'from':WEB3.eth.accounts[0]}).getUser(\
                                 username, userpassword)

                confirmbiditem(logincontract, description)

def transaction():
    """For the transactions for buyer and seller"""
    for i, transactions in enumerate(TRANSACTIONS):
        block = transactions

        if i < len(block):
            #Name = block['name']
            description = block['description']
            for contract in enumerate(description):
                contracttransaction = contract[1]['action']

                if contracttransaction == 'createPurchaseOrder':
                    purchase = contract[1]
                    createpurchaseorder(purchase)

                if contracttransaction == 'createBidOffer':
                    bidoffer = contract[1]
                    createbidoffer(bidoffer, description)

                if contracttransaction == 'acceptBidOffer':
                    acceptbidoffer = contract[1]
                    createacceptbidoffer(acceptbidoffer, description)

                if contracttransaction == 'confirmOffer':
                    confirmoffer = contract[1]
                    createconfirmoffer(confirmoffer, description)

transaction()
