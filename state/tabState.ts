import { atom } from 'recoil';

export enum TabType { dashboard = "dashboard", alliance = "alliance", ecosystem = "ecosystem", liquidity = "liquidity" }

export const tabState = atom<TabType>({
    key: 'tabState',
    default:  TabType.dashboard,
});
