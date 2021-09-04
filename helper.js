const getBalancesAPI = async ({ ftx }) =>
  await ftx.request({
    method: 'GET',
    path: '/wallet/balances',
  })

const lendCoinAPI = async ({ ftx, coin, size, rate }) =>
  await ftx.request({
    method: 'POST',
    path: '/spot_margin/offers',
    data: {
      coin: coin,
      size: size,
      rate: rate,
    },
  })

const stakeCoinAPI = async ({ ftx, coin, size }) =>
  await ftx.request({
    method: 'POST',
    path: '/srm_stakes/stakes',
    data: {
      coin: coin,
      size: size,
    },
  })

const transferCoinAPI = async ({ ftx, coin, size, source, destination }) =>
  await ftx.request({
    method: 'POST',
    path: '/subaccounts/transfer',
    data: {
      coin: coin,
      size: size,
      source: source,
      destination: destination,
    },
  })
const roundDownWithDecimals = (number, decimals = 8) =>
  Math.floor((number + Number.EPSILON) * 10 ** decimals) / 10 ** decimals

module.exports = {
  getBalancesAPI,
  lendCoinAPI,
  stakeCoinAPI,
  transferCoinAPI,
  roundDownWithDecimals,
}
