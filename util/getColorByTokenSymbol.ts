import { Token } from 'components/Pages/AssetOverview';

export const getColorByTokenSymbol = (symbol: string) : string => {
  switch (symbol) {
    case Token.FURY:
      return '#13B55A'
    case Token.ASH:
      return 'lightgreen'
    case Token.ampLUNA:
      return '#ADD8FD'
    case Token.bLUNA:
      return 'orange'
    case Token.USK:
      return '#189AE9'
    case Token['USK-FURY-LP']:
      return 'yellow'
    case Token['FURY-wBTC-LP']:
      return 'red'
    case Token.wBTC:
      return 'darkorange'
    default:
      return null
  }
}
