import { convertMicroDenomToDenom } from 'util/conversion';

type Token = {
  denom: string;
  amount: string;
};

export const fetchTotalSupply = async (): Promise<number> => {
  try {
    const response = await fetch('https://api.furya.xyz/cosmos/bank/v1beta1/supply?pagination.key=dXdoYWxl')
    const data = await response.json()

    const ufury = data.supply.find((item: Token) => item.denom === 'ufury');
    return ufury ? convertMicroDenomToDenom(ufury.amount, 6) : null;
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
}
