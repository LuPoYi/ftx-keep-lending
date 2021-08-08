FTX - **Lending** or **staking** all available balance per hour using crontab - Hourly Compounding

## How to use

- Upgrade Node.js to 14.x

```zsh
sudo apt update
curl -sL https://deb.nodesource.com/setup_14.x | sudo bash -
sudo apt-get install -y nodejs
node -v
```

- `yarn`

- `cp config.json.backup config.json`

  - change `config.json` by using your own `api key`, `secret` and set up which `subaccount` and `lendingCoins` and `stakingCoins` you want.

- `node main.js`

  - use `tmux`, `screen` or `docker` to keep the process running.

### Set up your config.json

- Use your own `YOUR_FTX_API_KEY` `YOUR_FTX_API_SECRET`
- Set up `subAccount`
- Update which coin you want to lend
  - if you want to lend all coins of this sub account, you can just set `"isLendingAllCoins": true`
  - or if you want specific coins to lend, you should set it like this: `"lendingCoins": [{ "coin": "ETH"}]`
- Update which coin you want to stake (only FTT UBXT SRM FIDA SOL RAY):
  - `"stakingCoins": [{ "coin": "SOL" }, { "coin": "RAY" }]`

```json
{
  "FTX_API_KEY": "YOUR_FTX_API_KEY",
  "FTX_API_SECRET": "YOUR_FTX_API_SECRET",
  "CRON_JOB_AT_MINUTE": 30,
  "accounts": [
    {
      "subAccount": "YOUR_LENDING_ALL_SUB_ACCOUNT",
      "isLendingAllCoins": true
    },
    {
      "subAccount": "YOUR_SUB_ACCOUNT",
      "isLendingAllCoins": false,
      "lendingCoins": [
        { "coin": "SNX", "keepBalance": 0, "minimunHourlyRate": 0.000001 },
        { "coin": "1INCH", "keepBalance": 10, "minimunHourlyRate": 0.000001, "decimals": 8 }
      ],
      "stakingCoins": [{ "coin": "SOL" }]
    }
  ]
}
```

### Notes

- If you use default account 'Main Account', set subAccount to emtpy string `"subAccount": ""`
- If you get 'Size too large' very often, try to set `"decimals": 6`
- minimun Hourly Rate 0.000001% => Minimum Yearly Rate 0.8760%

### Result example

```js
2021-02-10T09:40:00.229Z USD getBalance 261.742728 => 261.742728 freeBalance 0.23926331
2021-02-10T09:40:00.306Z USD offersResult { result: null, success: true } 261.742728
2021-02-10T09:40:00.394Z ETH getBalance 1.78598968 => 1.78598968 freeBalance 0.00013262
2021-02-10T09:40:00.495Z ETH offersResult { result: null, success: true } 1.78598968
2021-02-10T09:40:00.588Z 1INCH getBalance 620.37422189 => 620.37422188 freeBalance 0.0473561
2021-02-10T09:40:00.677Z 1INCH offersResult { result: null, success: true } 620.37422188
```

## Others

docker-compose

```bash
$ docker-compose up -d  //start
$ docker-compose down --rmi all //down
```

if annual rate is 10%, use hourly compounding you will get 10.5%
if annual rate is 20%, use hourly compounding you will get 22.1%
if annual rate is 30%, use hourly compounding you will get 34.9%
