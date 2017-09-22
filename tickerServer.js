var restify = require('restify');
var Web3 = require('web3');
const util = require('ethereumjs-util');
var config = require('./config.json');
const bodyParser = require('body-parser');
var web3,web3Mainnet,web3Ropsten;

if (typeof web3Ropsten !== 'undefined') {
    web3Ropsten = new Web3(web3Ropsten.currentProvider);
} else {
    // set the provider you want from Web3.providers
    web3Ropsten = new Web3(new Web3.providers.HttpProvider(config.httpProviderRopsten));
}

if (typeof web3Mainnet !== 'undefined') {
    web3Mainnet = new Web3(web3Mainnet.currentProvider);
} else {
    // set the provider you want from Web3.providers
    web3Mainnet = new Web3(new Web3.providers.HttpProvider(config.httpProviderMainet));
}

if (web3Ropsten.isConnected()) {
    console.log("Web3 Ropsten connected");
} else {
    console.log("Web3 Ropsten is not connected")
}
if (web3Mainnet.isConnected()) {
    console.log("Web3 Mainnet connected");
} else {
    console.log("Web3 Mainnet is not connected")
}

function respond(req, res, next) {
    if (!req.method === 'POST') {
        return next();
    }
    if(req.body.network !=null && req.body.network == "ropsten"){
        web3 = web3Ropsten
    }
    else web3 = web3Mainnet;

    if(web3.isConnected()){
        var tokenABI = require('./tokenABI.json');
        var tokenAddress = req.params.contractAddress;

        if(tokenAddress!=null){
            try{
                var tokenInstance = web3.eth.contract(tokenABI).at(tokenAddress);
                var result = [];

                var investorcount = tokenInstance.investorCount.call();
                var tokensSold =  tokenInstance.tokensSold.call();
                var weiRaised =  tokenInstance.weiRaised.call();
                var weiCap =  tokenInstance.weiCap.call();
                var isMinimumGoalReached = tokenInstance.isMinimumGoalReached.call();
                var state = tokenInstance.getState.call();
                var endsAt =  tokenInstance.endsAt.call();

                result.push({'status':'success','message':'',
                    'data':{'investorcount':investorcount,
                    'tokensSold':tokensSold,
                    'weiRaised':weiRaised,
                    'weiCap':weiCap,
                    'isMinimumGoalReached':isMinimumGoalReached,
                    'state':state,
                    'endsAt':endsAt}});
                res.json(result);
            } catch (err) {
                // handle the error safely
                res.json({'status':'failed','message':'Error while fetching data'});
            }
        }else{
            res.json({'status':'failed','message':'Please enter valid contract address'});
        }

        next();
    }else{
        res.json({'status':'failed','message':'Problem connecting to the network'});
    }
}

var server = restify.createServer();
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({extended: true}));
server.post('/crowdsale/:contractAddress', respond);

server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});
