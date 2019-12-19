// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  walletUrl: 'http://aladinnetwork.org',
  votingUrl: 'https://aladinnetwork.org',
  appName: 'Aladin Explorer',
  logoUrl: '/assets/logo.png',
  blockchainUrl: 'http://3.14.68.213:8888',
  chainId: 'bb114c767368dd78d95a097a4c14a6e0235d20186f0962b10a7a77ef50a5f50f',
  showAds: false,
  tokensUrl: 'https://raw.githubusercontent.com/alacafe/ala-airdrops/master/tokens.json',
  tickerUrl: 'https://api.coinmarketcap.com/v2/ticker/1765/',
  token: 'ALA'
};
