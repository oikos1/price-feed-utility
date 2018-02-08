import BigNumber from 'bignumber.js'
import web3 from './config/web3'

const adr = require('./addresses.json')

let cupSlot = web3.utils.padLeft('19', 64)

const hexOffset = (hex, n) => {
  let x = new BigNumber(hex)
  let incr = x.plus(n)
  let result = '0x' + incr.toString(16)
  return result
}

const wad = (uint) => {
  return new BigNumber(uint).dividedBy(`1e18`).toNumber()
}

export const sig = (str) => {
  return web3.utils.sha3(str).substring(0,10)
}

export const getCupAt = (cuphex, blk) => {
  let key = web3.utils.sha3(cuphex + cupSlot)
  return web3.eth.getStorageAt(adr.ethlive.tub, key, blk)
  .then(lad => {
    return web3.eth.getStorageAt(adr.ethlive.tub, hexOffset(key, 1), blk)
    .then(ink => {
      return web3.eth.getStorageAt(adr.ethlive.tub, hexOffset(key, 2), blk)
      .then(art => {
        return web3.eth.getStorageAt(adr.ethlive.tub, hexOffset(key, 3), blk)
        .then(ire => {
          return {
            lad: lad,
            ink: wad(ink),
            art: wad(art),
            ire: wad(ire)
          }
        });
      });
    });
  });
}
