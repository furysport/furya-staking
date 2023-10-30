import { atom } from 'recoil';

export enum TabType { alliance, ecosystem, liquidity }

export const tabState = atom<TabType>({
    key: 'tabState',
    default:  TabType.alliance,
});
