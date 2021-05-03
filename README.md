FTX - lending all available balance(USD/USDT) per hour using crontab

## How to use

- Upgrade Node.js to 14.x

```
   sudo apt update
   curl -sL https://deb.nodesource.com/setup_14.x | sudo bash -
   sudo apt-get install -y nodejs
   node -v
```

- `yarn`

- `cp config.json.backup config.json`

  - change `config.json` by using your own api key, secret and set which subaccount and coins you want to keep leading

- `node main.js`

  - use `tmux`, `screen` or `docker` to keep the process running.

### config.json

* Use your own `YOUR_FTX_API_KEY` `YOUR_FTX_API_SECRET`
* Update which coin you want to lend `lendingCoins` 
   * `"lendingCoins": [{ "coin": "ETH", "keepBalance": 0, "minimunHourlyRate": 0.000001, "decimals": 8 }]`
* Update which coin you want to stake (FTT UBXT SRM FIDA SOL RAY)
   * `"stakingCoins": [{ "coin": "SOL", "keepBalance": 0 }]`


```json
{
  "FTX_API_KEY": "YOUR_FTX_API_KEY",
  "FTX_API_SECRET": "YOUR_FTX_API_SECRET",
  "CRON_JOB_AT_MINUTE": 30,
  "accounts": [
    {
      "subAccount": "",
      "lendingCoins": [
        { "coin": "ETH", "keepBalance": 0, "minimunHourlyRate": 0.000001, "decimals": 8 }
      ],
      "stakingCoins": [{ "coin": "SOL", "keepBalance": 0 }]
    },
    {
      "subAccount": "MY_SUB_ACCOUNT",
      "lendingCoins": [
        { "coin": "SNX", "keepBalance": 0, "minimunHourlyRate": 0.000001, "decimals": 8 }
        { "coin": "1INCH", "keepBalance": 10, "minimunHourlyRate": 0.000001 , "decimals": 8 }
      ]
    }
  ]
}
```

- If you use default account 'Main Account', set subAccount to emtpy string `"subAccount": ""`
- If you get 'Size too large' very often, try to set `"decimals": 6`

> minimun Hourly Rate 0.000001% => Minimum Yearly Rate 0.8760%

### Result example

```js
2021-02-10T09:40:00.229Z USD getBalance 261.742728 => 261.742728 freeBalance 0.23926331
2021-02-10T09:40:00.306Z USD offersResult { result: null, success: true } 261.742728
2021-02-10T09:40:00.394Z ETH getBalance 1.78598968 => 1.78598968 freeBalance 0.00013262
2021-02-10T09:40:00.495Z ETH offersResult { result: null, success: true } 1.78598968
2021-02-10T09:40:00.588Z 1INCH getBalance 620.37422189 => 620.37422188 freeBalance 0.0473561
2021-02-10T09:40:00.677Z 1INCH offersResult { result: null, success: true } 620.37422188
```

### Use docker-compose

```bash
$ docker-compose up -d  //start
```

```bash
$ docker-compose down --rmi all //down
```

### MEMO

if annual rate is 10%, use hourly compounding you will get 10.5%

if annual rate is 20%, use hourly compounding you will get 22.1%

if annual rate is 30%, use hourly compounding you will get 34.9%
