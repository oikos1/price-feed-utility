require('dotenv').config();

import web3 from './web3';
import {tronWeb,tronGrid} from './tronWeb';

const utils = require('./utils');
const chain = process.env.ETH_CHAIN || 'mainnet';
const config = require('../config/config.json');
const CryptoUtils = require("@tronscan/client/src/utils/crypto");

module.exports = {
  web3: web3,
  tronWeb:tronWeb,
  tronGrid:tronGrid,
  addresses: config["mainnet"],
  opts:{fee_limit:1000000000, shouldPollResponse: true, callValue: 0, from: tronWeb.defaultAddress.base58},
  u: utils,
  latestBlock: utils.getCurrentBlock(),
  genBlock: 1, //process.env.DEPLOY_BLOCK
};
