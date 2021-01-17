const FTXRest = require('ftx-api-rest')
const CronJob = require('cron').CronJob
const dotenv = require('dotenv')
dotenv.config()

const {
  KEEP_BALANCE: keepBalance,
  FTX_API_KEY: key,
  FTX_API_SECRET: secret,
  FTX_SUB_ACCOUNT: subaccount,
  LENDING_COIN,
} = process.env;

const ftx = new FTXRest({ key, secret, subaccount});

const getFreeBalanceAndLending = async (coins) => {
  try {
    const getBalancesResult = await ftx.request({
      method: 'GET',
      path: '/wallet/balances',
    })

    for (const coin of coins) {
      const { free, total } = getBalancesResult.result.find((item) => item.coin === coin) || {};
      console.log(new Date(), coin, 'freeBalance', free, 'totalBalance', total);

      if (total > 0) {

        // keep balance
        let size = total;
        if (keepBalance) {
          size = total - parseFloat(keepBalance);
          console.log(`keepBalance: ${keepBalance}, final lending balance: ${size}`);
        }

        const offersResult = await ftx.request({
          method: 'POST',
          path: '/spot_margin/offers',
          data: {
            coin: coin,
            size: parseFloat(size).toFixed(7).slice(0, -1),
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

let leading_coins = LENDING_COIN ? LENDING_COIN.split(',') : ['USD'];

console.log('Before job instantiation')
const job = new CronJob('45 * * * *', function () {
  getFreeBalanceAndLending(leading_coins);
});
console.log('After job instantiation')
job.start()
