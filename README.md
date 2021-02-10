## How to use

- `yarn`

- `cp config.json.backup config.json`

  - change `config.json` by using your own api key, secret and set which coin you want to keep leading
  - > Support multiple sub account with multiple coin

- `node main.js`

### config.json

```json
// minimun Hourly Rate 0.000001% => Minimum Yearly Rate 0.8760%
{
  "FTX_API_KEY": "YOUR_FTX_API_KEY",
  "FTX_API_SECRET": "YOUR_FTX_API_SECRET",
  "CRON_JOB_AT_MINUTE": 30,
  "accounts": [
    {
      "subAccount": "",
      "lendingCoins": [{ "coin": "ETH", "keepBalance": 0, "minimunHourlyRate": 0.000001 }]
    },
    {
      "subAccount": "LENDING",
      "lendingCoins": [
        { "coin": "SNX", "keepBalance": 0, "minimunHourlyRate": 0.000001 },
        { "coin": "1INCH", "keepBalance": 10, "minimunHourlyRate": 0.000001 }
      ]
    }
  ]
}
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
