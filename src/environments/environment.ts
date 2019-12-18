// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  walletUrl: 'http://aladinnetwork.org',
  votingUrl: 'https://aladinnetwork.org',
  appName: 'ALADIN Explorer',
  logoUrl: '/assets/logo.png',
  blockchainUrl: 'http://18.224.31.248:8888',
  chainId: 'af2f60762a1dbbcb9b8ecd8555cc9d3df753c3355cd9133e55c9929a33cf3cdd',
  showAds: false,
  tokensUrl: 'https://raw.githubusercontent.com/alacafe/ala-airdrops/master/tokens.json',
  tickerUrl: 'https://api.coinmarketcap.com/v2/ticker/1765/',
  token: 'ALA'
};
