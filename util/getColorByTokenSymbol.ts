import { Token } from 'components/Pages/AssetOverview';

export const getColorByTokenSymbol = (symbol: string) : string => {
  switch (symbol) {
    case Token.WHALE:
      return '#13B55A'
    case Token.ASH:
      return 'lightgreen'
    case Token.ampLUNA:
      return '#ADD8FD'
    case Token.bLUNA:
      return 'orange'
    case Token.mUSDC:
      return '#189AE9'
    case Token['USDC-WHALE-LP']:
      return 'yellow'
    case Token['WHALE-wBTC-LP']:
      return 'red'
    case Token.wBTC:
      return 'darkorange'
    default:
      return null
  }
}
