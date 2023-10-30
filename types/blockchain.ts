export type Asset = {
  asset: string;
  icon: string;
  contract: string;
  amount: string | number;
  balance: number;
};

export enum TxStep {
  /**
   * Idle
   */
  Idle = 0,
  /**
   * Estimating fees
   */
  Estimating = 1,
  /**
   * Ready to post transaction
   */
  Ready = 2,
  /**
   * Signing transaction in Terra Station
   */
  Posting = 3,
  /**
   * Broadcasting
   */
  Broadcasting = 4,
  /**
   * Successful
   */
  Successful = 5,
  /**
   * Failed
   */
  Failed = 6,
}
