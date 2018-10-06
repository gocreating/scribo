# X-Post-Frontend

## Development

```
npm start
```

## Deploy to gh-pages

1. Update `homepage` of `package.json`
2. If the app is not host on root path, update `basename` of `react-router`
3. Add `.env.production` if needed

  ```
  PUBLIC_URL=https://gocreating.github.io/x-post
  ```

4. Run the command

  ```
  npm run deploy
  ```

Here are useful references:

- [GitHub Pages](https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/README.md#github-pages)
- [Building for Relative Paths](https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/README.md#building-for-relative-paths)
- [Doesn't support "basename" prop correct](https://github.com/supasate/connected-react-router/issues/46)
- [Advanced Configuration](https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/README.md#advanced-configuration)
