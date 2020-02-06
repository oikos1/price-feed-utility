const request = require('request-promise');
const colors = require('colors');
const lib = require('../lib/common');

const pricefeed_Address  = lib.addresses.GOV_pricefeed;
const medianizer_Address = lib.addresses.GOV_medianizer;

let startBlock = 0;
let lastPrice = 0;


const getTickerPrice = () => {

    return request("https://api.coinmarketcap.com/v2/ticker/1958/", function(err, response, body) {
        if (err) return;
        // Parse price data in API response
        const json = JSON.parse(body);
        const data = json.data;
        const rank = data.rank;
        const price = data.quotes.USD.price;
        const marketCap = data.quotes.USD.market_cap;
        const vol24H = data.quotes.USD.volume_24h;
        const perChange1H = data.quotes.USD.percent_change_1h;
        const perChange1D = data.quotes.USD.percent_change_24h;
        const perChange7D = data.quotes.USD.percent_change_7d;
        //console.log(price.toString() + " - " + rank.toString() + " - " + marketCap.toString() + " - " +
        //    vol24H.toString() + " - " + perChange1H.toString() + " - " + perChange1D.toString() + " - " + perChange7D.toString())
    });

}


const sync = async () => {

    const Pricefeed = !!pricefeed_Address ? await lib.u.loadContract(pricefeed_Address) : console.log("error with pricefeed"); //await deployContract('PriceFeed');
    const Medianizer = !!medianizer_Address ? await lib.u.loadContract(medianizer_Address) : console.log("error with medianizer"); //await deployContract('Medianizer');

    let currentBlock = await lib.tronWeb.trx.getCurrentBlock();

    console.log("startBlock", startBlock, "currentBlock", currentBlock.block_header.raw_data.number, "lastPrice", lastPrice);

    //if (currentBlock.block_header.raw_data.number > startBlock) {
        /*Pricefeed.post( web3.utils.toWei("0.0132555"), "1591994899", tronWeb.address.toHex(medianizer_Address)).send({
                shouldPollResponse: true,
                callValue: 0, 
                from : _address
            }).then().catch(function (err) {
                console.log(err)
        });*/

        getTickerPrice().then(function(result) {
            if (lastPrice != JSON.parse(result).data.quotes.USD.price*33333) {
                console.log("price has changed, was", lastPrice, "now", (JSON.parse(result).data.quotes.USD.price*33333));
                lastPrice = JSON.parse(result).data.quotes.USD.price* 33333;
                Pricefeed.post(lib.web3.utils.toWei(((JSON.parse(result).data.quotes.USD.price)*33333).toString()), "1591994899", lib.tronWeb.address.toHex(medianizer_Address))
                .send(lib.opts)
                .then().catch(function(err) {
                    console.log(err)
                });
            }
        });
    //}
};


lib.latestBlock.then(res => {

    startBlock = res.block_header.raw_data.number;

    //getTickerPrice().then(function(result) {
        //console.log("price is " , JSON.parse(result).data.quotes.USD.price);
        //lastPrice = JSON.parse(result).data.quotes.USD.price;
    //});

    setInterval(sync, 3000);

}).catch(e => {
    if (e) {
        console.log("error", e);
        return;
    }
});