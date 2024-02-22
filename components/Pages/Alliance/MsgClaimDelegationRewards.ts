import { Reader, Writer } from 'protobufjs';

export interface MsgClaimDelegationRewardsInterface {
  delegatorAddress: string;
  validatorAddress: string;
  denom: string;
}
export class MsgClaimDelegationRewards {
  delegatorAddress: string;

  validatorAddress: string;

  denom: string;

  constructor(data: MsgClaimDelegationRewardsInterface) {
    this.delegatorAddress = data.delegatorAddress;
    this.validatorAddress = data.validatorAddress;
    this.denom = data.denom;
  }

  // Adjusted encode method
  static encode(message: MsgClaimDelegationRewardsInterface): Writer {
    const writer = Writer.create();
    writer.uint32(10).string(message.delegatorAddress);
    writer.uint32(18).string(message.validatorAddress);
    writer.uint32(26).string(message.denom);
    return writer;
  }

  // Dummy implementation of decode
  // Adjusted decode method
  static decode(input: Reader | Uint8Array): MsgClaimDelegationRewardsInterface {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = reader.len;
    const message: Partial<MsgClaimDelegationRewardsInterface> = {};
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        // Example decoding a string property
        case 1:
          message.delegatorAddress = reader.string();
          break;
        case 2:
          message.validatorAddress = reader.string();
          break;
        case 3:
          message.denom = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message as MsgClaimDelegationRewardsInterface;
  }

  // Converting the message object to JSON
  static fromJSON(object: any): MsgClaimDelegationRewardsInterface {
    return {
      delegatorAddress: object.delegatorAddress,
      validatorAddress: object.validatorAddress,
      denom: object.denom,
    };
  }

  // Converting the message object to a JSON string
  static toJSON(message: MsgClaimDelegationRewardsInterface): string {
    return JSON.stringify(message);
  }

  // Partial update method
  static fromPartial<I extends Partial<MsgClaimDelegationRewardsInterface>>(object: I): MsgClaimDelegationRewardsInterface {
    return {
      delegatorAddress: object.delegatorAddress ?? '',
      validatorAddress: object.validatorAddress ?? '',
      denom: object.denom ?? '',
    };
  }
}
