## How to use

- `yarn`

- `cp .env.backup .env`
- change .env by using your own api key and secret

- `node main.js`

## Use docker-compose

``` bash
$ docker-compose up -d  //start  
```

``` bash
$ docker-compose down --rmi all //down  
```

### MEMO

if annual rate is 10%, use hourly compounding you will get 10.5%

if annual rate is 20%, use hourly compounding you will get 22.1%

if annual rate is 30%, use hourly compounding you will get 34.9%

### TODO

* Support multiple sub account with multiple coin
