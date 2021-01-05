const FTXRest = require('ftx-api-rest')
const CronJob = require('cron').CronJob
const dotenv = require('dotenv')
dotenv.config()

const ftx = new FTXRest({
  key: process.env.FTX_API_KEY,
  secret: process.env.FTX_API_SECRET,
  subaccount: process.env.FTX_SUB_ACCOUNT,
})

const getFreeBalanceAndLending = async (coins) => {
  try {
    const getBalancesResult = await ftx.request({
      method: 'GET',
      path: '/wallet/balances',
    })

    for (const coin of coins) {
      const { free, total } = getBalancesResult?.result?.find((item) => item.coin === coin) || {}
      console.log(new Date(), coins, 'freeBalance', free, 'totalBalance', total)

      if (total > 0) {
        const offersResult = await ftx.request({
          method: 'POST',
          path: '/spot_margin/offers',
          data: {
            coin: coin,
            size: parseFloat(total).toFixed(7).slice(0, -1),
            rate: 0.000005, // minimun hourly rate => (4.38% / year)
          },
        })

        console.log(new Date(), 'offersResult', offersResult)
      }
    }
  } catch (e) {
    console.log(e.message)
  }
}

let leading_coins = ['USD']
if (process.env.LENDING_COIN) {
  leading_coins = process.env.LENDING_COIN.split(',')
}

console.log('Before job instantiation')
const job = new CronJob('45 * * * *', function () {
  getFreeBalanceAndLending(leading_coins)
})
console.log('After job instantiation')
job.start()
