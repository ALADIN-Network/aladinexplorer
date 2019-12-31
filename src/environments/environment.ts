// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
export const environment = {
  production: true,
  walletUrl: 'http://aladinnetwork.org',
  votingUrl: 'https://aladinnetwork.org',
  appName: 'Aladin Explorer',
  logoUrl: '/assets/logo.png',
  blockchainUrl: 'http://3.17.183.19:8888',
  chainId: '6cff44313ac0458f42067e9533f00435d6a1c65b3946f4f499e083330c4d719f',
  //showAds: false,
  tokensUrl: 'https://raw.githubusercontent.com/alacafe/ala-airdrops/master/tokens.json',
  tickerUrl: 'https://api.coinmarketcap.com/v2/ticker/1765/',
  token: 'ALA'
};
