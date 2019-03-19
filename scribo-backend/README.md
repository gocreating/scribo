# Scribo-Backend

## Prerequisites

```
npm i -g cross-env
npm i -g nodemon
```

## Development

Initial build requires to build semantic css:

```
npm run build-semantic
```

Then the dev server can be launched:

```
npm run dev
```

## Production

```
npm run production
```

## Deploy

```
npm run dump
```

到 heroku 設定 Environment Variable，完成後可透過以下指令檢查：

```
/scribo $ heroku config
```

注意：npm 裡的 deploy 指令只會部署 master branch

```
/scribo $ heroku login
/scribo $ heroku git:remote -a scribo
/scribo/scribo-backend $ npm run deploy
```

> Remember to sync the printed environment variable to hosting servicce

## Migration

如需要執行Migration，範例如下：

```
/scribo/scribo-backend $ npm run migrate-dev -- 2019_03_16_add_post_order_timestamp.js
/scribo/scribo-backend $ npm run migrate-production -- 2019_03_16_add_post_order_timestamp.js
```
