import { Writer, Reader } from 'protobufjs/minimal';

// Assuming AccAddress and ValAddress are types you have defined or imported
type AccAddress = string;
type ValAddress = string;

// Helper type for fromPartial method to allow optional fields
type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

export class MsgWithdrawDelegatorReward {
  delegatorAddress: AccAddress;

  validatorAddress: ValAddress;

  constructor(delegatorAddress: AccAddress, validatorAddress: ValAddress) {
    this.delegatorAddress = delegatorAddress;
    this.validatorAddress = validatorAddress;
  }

  // Encode the MsgWithdrawDelegatorReward message to a Protobuf-compatible format
  static encode(message: MsgWithdrawDelegatorReward): Writer {
    const writer = Writer.create();
    if (message.delegatorAddress !== '') {
      writer.uint32(10).string(message.delegatorAddress);
    }
    if (message.validatorAddress !== '') {
      writer.uint32(18).string(message.validatorAddress);
    }
    return writer;
  }

  // Decode a Protobuf-encoded message to a MsgWithdrawDelegatorReward instance
  static decode(input: Reader | Uint8Array): MsgWithdrawDelegatorReward {
    const reader = input instanceof Reader ? input : new Reader(input);
    const end = reader.len;
    const message = new MsgWithdrawDelegatorReward('', '');
    while (reader.pos < end) {
      const tag = reader.uint32();
      // eslint-disable-next-line no-bitwise
      switch (tag >>> 3) {
        case 1:
          message.delegatorAddress = reader.string();
          break;
        case 2:
          message.validatorAddress = reader.string();
          break;
        default:
          // eslint-disable-next-line no-bitwise
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  }

  // Serialize the message as JSON
  static fromJSON(object: any): MsgWithdrawDelegatorReward {
    return new MsgWithdrawDelegatorReward(object.delegatorAddress ?? '',
      object.validatorAddress ?? '');
  }

  // Convert the message instance to a JSON object
  static toJSON(message: MsgWithdrawDelegatorReward): unknown {
    return {
      delegatorAddress: message.delegatorAddress,
      validatorAddress: message.validatorAddress,
    };
  }

  // Partially update the message with optional fields
  static fromPartial(object: DeepPartial<MsgWithdrawDelegatorReward>): MsgWithdrawDelegatorReward {
    const message = new MsgWithdrawDelegatorReward('', '');
    message.delegatorAddress = object.delegatorAddress ?? '';
    message.validatorAddress = object.validatorAddress ?? '';
    return message;
  }
}
