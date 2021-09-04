const FTXRest = require('ftx-api-rest')
const CronJob = require('cron').CronJob
const config = require('./config.json')
const {
  FTX_API_KEY,
  FTX_API_SECRET,
  CRON_JOB_AT_MINUTE,
  accounts,
  CRON_JOB_AT_MINUTE_MOVE_FUND,
  moveFund,
  sourceAccount,
  destinationAccount,
} = config
const cronExpression = `${CRON_JOB_AT_MINUTE} * * * *`
const cronExpressionMoveFund = `${CRON_JOB_AT_MINUTE_MOVE_FUND} * * * *`
const {
  getBalancesAPI,
  lendCoinAPI,
  stakeCoinAPI,
  transferCoinAPI,
  roundDownWithDecimals,
} = require('./helper.js')
const { sendMoveFundMessage } = require('./telegramBot')

const lendingAll = async (accounts) => {
  for (const { subAccount, isLendingAllCoins, lendingCoins, stakingCoins } of accounts) {
    await getFreeBalanceAndLending({ subAccount, isLendingAllCoins, lendingCoins, stakingCoins })
  }
}

const getFreeBalanceAndLending = async ({
  subAccount,
  isLendingAllCoins,
  lendingCoins,
  stakingCoins,
}) => {
  const ftx = new FTXRest({ key: FTX_API_KEY, secret: FTX_API_SECRET, subaccount: subAccount })

  try {
    const getBalancesResult = await getBalancesAPI({ ftx })
    const coins = isLendingAllCoins
      ? getBalancesResult?.result?.filter(
          ({ availableWithoutBorrow }) => availableWithoutBorrow > 0
        )
      : lendingCoins

    // lending coins
    if (coins) {
      for (const { coin, keepBalance = 0, minimunHourlyRate = 0.000001, decimals = 8 } of coins) {
        const { free, availableWithoutBorrow, total } =
          getBalancesResult?.result?.find((item) => item.coin === coin) || {}
        if (!total || !availableWithoutBorrow) continue

        const fixTotal = keepBalance
          ? roundDownWithDecimals(fixTotal - parseFloat(keepBalance), decimals)
          : roundDownWithDecimals(total, decimals)

        console.log(
          new Date(),
          coin,
          'total',
          total,
          'free',
          free,
          'aws',
          availableWithoutBorrow,
          'keep',
          keepBalance,
          'final',
          fixTotal
        )

        await lendCoinAPI({
          ftx,
          coin,
          size: fixTotal,
          rate: minimunHourlyRate,
        }).then((result) => console.log(new Date(), coin, result))
      }
    }

    // staking: SRM, SOL...
    if (stakingCoins) {
      for (const { coin, decimals = 8 } of stakingCoins) {
        const { free } = getBalancesResult?.result?.find((item) => item.coin === coin) || {}
        if (!free) continue
        const fixFree = roundDownWithDecimals(free, decimals)

        console.log(new Date(), coin, 'free', free, fixFree)
        await stakeCoinAPI({ coin, size: fixFree }).then((result) =>
          console.log(new Date(), coin, result)
        )
      }
    }
  } catch (e) {
    console.log(e.message)
  }
}

const getFreeBalanceAndMove = async () => {
  const ftx = new FTXRest({ key: FTX_API_KEY, secret: FTX_API_SECRET })

  try {
    const getBalancesResult = await getBalancesAPI({ ftx })
    const { free } = getBalancesResult?.result?.find((item) => item.coin === moveFund) || {}
    if (!free) return

    await transferCoinAPI({
      ftx,
      coin: moveFund,
      size: free,
      source: sourceAccount,
      destination: destinationAccount,
    })

    sendMoveFundMessage({
      source: sourceAccount,
      destination: destinationAccount,
      coin: moveFund,
      size: free,
    })
  } catch (e) {
    console.log(e.message)
  }
}

// CronJob
console.log(`Lending CronJob -> ${cronExpression}`)
const job = new CronJob(cronExpression, () => lendingAll(accounts))
job.start()
console.log('Lending CronJob Set.')

console.log(`Move Fund Cronjob -> ${cronExpressionMoveFund}`)
const moveFundsJob = new CronJob(cronExpressionMoveFund, () => getFreeBalanceAndMove())
moveFundsJob.start()
console.log('Move Fund Cronjob Set.')

// lendingAll(accounts)
