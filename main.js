const FTXRest = require('ftx-api-rest')
const CronJob = require('cron').CronJob
const config = require('./config.json')
const { FTX_API_KEY, FTX_API_SECRET, CRON_JOB_AT_MINUTE, accounts } = config
const cronExpression = `${CRON_JOB_AT_MINUTE} * * * *`

const roundDownWithDecimals = (number, decimals = 8) =>
  Math.floor((number + Number.EPSILON) * 10 ** decimals) / 10 ** decimals

const lendingAll = async (accounts) => {
  for (const { subAccount, lendingCoins, stakingCoins } of accounts) {
    await getFreeBalanceAndLending(subAccount, lendingCoins, stakingCoins)
  }
}

const getFreeBalanceAndLending = async (subAccount, lendingCoins, stakingCoins) => {
  const ftx = new FTXRest({ key: FTX_API_KEY, secret: FTX_API_SECRET, subaccount: subAccount })

  try {
    const getBalancesResult = await ftx.request({
      method: 'GET',
      path: '/wallet/balances',
    })

    // lending
    if (lendingCoins) {
      for (const {
        coin,
        keepBalance,
        minimunHourlyRate = 0.000001,
        decimals = 8,
      } of lendingCoins) {
        const { free, total } = getBalancesResult?.result?.find((item) => item.coin === coin) || {}
        let fixTotal = roundDownWithDecimals(total, decimals)
        console.log(new Date(), coin, 'getBalance', total, '=>', fixTotal, 'freeBalance', free)

        if (fixTotal && fixTotal > 0) {
          if (keepBalance) {
            fixTotal = roundDownWithDecimals(fixTotal - parseFloat(keepBalance), decimals)
            console.log(`keepBalance: ${keepBalance}, final lending balance: ${fixTotal}`)
          }

          const offersResult = await ftx.request({
            method: 'POST',
            path: '/spot_margin/offers',
            data: {
              coin: coin,
              size: fixTotal,
              rate: minimunHourlyRate,
            },
          })
          console.log(new Date(), coin, 'offersResult', offersResult)
        }
      }
    }

    // staking: SRM, SOL...
    if (stakingCoins) {
      for (const { coin, decimals = 8 } of stakingCoins) {
        const { free } = getBalancesResult?.result?.find((item) => item.coin === coin) || {}
        const fixFree = roundDownWithDecimals(free, decimals)
        console.log(new Date(), coin, 'freeBalance', free, '=>', fixFree)

        if (fixFree && fixFree > 0) {
          const stakesResult = await ftx.request({
            method: 'POST',
            path: '/srm_stakes/stakes',
            data: {
              coin: coin,
              size: fixFree,
            },
          })
          console.log(new Date(), coin, 'stakesResult', stakesResult)
        }
      }
    }
  } catch (e) {
    console.log(e.message)
  }
}

console.log(`CronJob Before Set -> ${cronExpression}`)
const job = new CronJob(cronExpression, function () {
  lendingAll(accounts)
})
console.log(`CronJob After Set -> ${cronExpression}`)
job.start()

lendingAll(accounts)
