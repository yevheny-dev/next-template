/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/sale_handler.json`.
 */
export type Sale = {
  address: 'EtWFjjyscJFt29nJp5vJdQmQ3usqY1dKmQnTbbNNPqGY';
  metadata: {
    name: 'saleHandler';
    version: '0.1.0';
    spec: '0.1.0';
    description: 'Created with Anchor';
  };
  instructions: [
    {
      name: 'disablePartner';
      discriminator: [13, 55, 104, 244, 56, 199, 102, 115];
      accounts: [
        {
          name: 'partner';
          writable: true;
        },
        {
          name: 'payer';
          writable: true;
          signer: true;
        },
      ];
      args: [];
    },
    {
      name: 'disableSaleHandler';
      discriminator: [244, 226, 38, 40, 85, 67, 141, 136];
      accounts: [
        {
          name: 'saleHandler';
          writable: true;
        },
        {
          name: 'payer';
          writable: true;
          signer: true;
        },
      ];
      args: [];
    },
    {
      name: 'disableStep';
      discriminator: [117, 38, 241, 134, 228, 195, 102, 185];
      accounts: [
        {
          name: 'step';
          writable: true;
        },
        {
          name: 'saleHandler';
          writable: true;
        },
        {
          name: 'payer';
          writable: true;
          signer: true;
        },
      ];
      args: [];
    },
    {
      name: 'enablePartner';
      discriminator: [72, 14, 80, 99, 208, 251, 194, 163];
      accounts: [
        {
          name: 'partner';
          writable: true;
        },
        {
          name: 'payer';
          writable: true;
          signer: true;
        },
      ];
      args: [];
    },
    {
      name: 'enableSaleHandler';
      discriminator: [47, 242, 204, 208, 88, 77, 219, 144];
      accounts: [
        {
          name: 'saleHandler';
          writable: true;
        },
        {
          name: 'payer';
          writable: true;
          signer: true;
        },
      ];
      args: [];
    },
    {
      name: 'enableStep';
      discriminator: [178, 157, 57, 104, 246, 119, 140, 175];
      accounts: [
        {
          name: 'step';
          writable: true;
        },
        {
          name: 'saleHandler';
          writable: true;
        },
        {
          name: 'payer';
          writable: true;
          signer: true;
        },
      ];
      args: [];
    },
    {
      name: 'init';
      discriminator: [220, 59, 207, 236, 108, 250, 47, 100];
      accounts: [
        {
          name: 'saleHandler';
          writable: true;
          pda: {
            seeds: [];
          };
        },
        {
          name: 'payer';
          writable: true;
          signer: true;
        },
        {
          name: 'systemProgram';
          address: '11111111111111111111111111111111';
        },
      ];
      args: [];
    },
    {
      name: 'initPartner';
      discriminator: [221, 214, 183, 69, 22, 40, 219, 145];
      accounts: [
        {
          name: 'partner';
          writable: true;
          pda: {
            seeds: [
              {
                kind: 'const';
                value: [80, 65, 82, 84, 78, 69, 82];
              },
              {
                kind: 'const';
                value: [95];
              },
              {
                kind: 'arg';
                path: 'partnerCode';
              },
            ];
          };
        },
        {
          name: 'payer';
          writable: true;
          signer: true;
        },
        {
          name: 'systemProgram';
          address: '11111111111111111111111111111111';
        },
      ];
      args: [
        {
          name: 'partnerCode';
          type: 'string';
        },
        {
          name: 'mainInterest';
          type: 'u64';
        },
        {
          name: 'secondaryInterest';
          type: 'u64';
        },
      ];
    },
    {
      name: 'initStep';
      discriminator: [79, 37, 14, 204, 178, 148, 196, 192];
      accounts: [
        {
          name: 'step';
          writable: true;
          pda: {
            seeds: [
              {
                kind: 'const';
                value: [83, 84, 69, 80];
              },
              {
                kind: 'const';
                value: [95];
              },
              {
                kind: 'arg';
                path: 'id';
              },
            ];
          };
        },
        {
          name: 'payer';
          writable: true;
          signer: true;
        },
        {
          name: 'systemProgram';
          address: '11111111111111111111111111111111';
        },
      ];
      args: [
        {
          name: 'id';
          type: 'i16';
        },
        {
          name: 'price';
          type: 'u64';
        },
        {
          name: 'totalSupply';
          type: 'u128';
        },
      ];
    },
    {
      name: 'purchaseWithSol';
      discriminator: [27, 238, 240, 155, 170, 180, 26, 118];
      accounts: [
        {
          name: 'saleHandler';
          writable: true;
        },
        {
          name: 'payer';
          writable: true;
          signer: true;
        },
        {
          name: 'step';
          writable: true;
        },
        {
          name: 'purchaser';
          writable: true;
          pda: {
            seeds: [
              {
                kind: 'const';
                value: [80, 85, 82, 67, 72, 65, 83, 69, 82];
              },
              {
                kind: 'const';
                value: [95];
              },
              {
                kind: 'account';
                path: 'payer';
              },
            ];
          };
        },
        {
          name: 'partner';
          writable: true;
          pda: {
            seeds: [
              {
                kind: 'const';
                value: [80, 65, 82, 84, 78, 69, 82];
              },
              {
                kind: 'const';
                value: [95];
              },
              {
                kind: 'arg';
                path: 'partnerCode';
              },
            ];
          };
        },
        {
          name: 'priceUpdate';
        },
        {
          name: 'bankInfo';
          writable: true;
        },
        {
          name: 'systemProgram';
          address: '11111111111111111111111111111111';
        },
      ];
      args: [
        {
          name: 'partnerCode';
          type: 'string';
        },
        {
          name: 'amount';
          type: 'u64';
        },
      ];
    },
    {
      name: 'purchaseWithUsdc';
      discriminator: [239, 251, 159, 72, 189, 180, 47, 135];
      accounts: [
        {
          name: 'saleHandler';
          writable: true;
        },
        {
          name: 'payer';
          writable: true;
          signer: true;
        },
        {
          name: 'step';
          writable: true;
        },
        {
          name: 'purchaser';
          writable: true;
          pda: {
            seeds: [
              {
                kind: 'const';
                value: [80, 85, 82, 67, 72, 65, 83, 69, 82];
              },
              {
                kind: 'const';
                value: [95];
              },
              {
                kind: 'account';
                path: 'payer';
              },
            ];
          };
        },
        {
          name: 'partner';
          writable: true;
          pda: {
            seeds: [
              {
                kind: 'const';
                value: [80, 65, 82, 84, 78, 69, 82];
              },
              {
                kind: 'const';
                value: [95];
              },
              {
                kind: 'arg';
                path: 'partnerCode';
              },
            ];
          };
        },
        {
          name: 'purchaserAta';
          writable: true;
        },
        {
          name: 'bankAta';
          writable: true;
        },
        {
          name: 'partnerPdaAta';
          writable: true;
        },
        {
          name: 'tokenProgram';
          address: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA';
        },
        {
          name: 'systemProgram';
          address: '11111111111111111111111111111111';
        },
      ];
      args: [
        {
          name: 'partnerCode';
          type: 'string';
        },
        {
          name: 'amount';
          type: 'u64';
        },
      ];
    },
    {
      name: 'purchaseWithUsdt';
      discriminator: [209, 71, 158, 181, 243, 126, 63, 241];
      accounts: [
        {
          name: 'saleHandler';
          writable: true;
        },
        {
          name: 'payer';
          writable: true;
          signer: true;
        },
        {
          name: 'step';
          writable: true;
        },
        {
          name: 'purchaser';
          writable: true;
          pda: {
            seeds: [
              {
                kind: 'const';
                value: [80, 85, 82, 67, 72, 65, 83, 69, 82];
              },
              {
                kind: 'const';
                value: [95];
              },
              {
                kind: 'account';
                path: 'payer';
              },
            ];
          };
        },
        {
          name: 'partner';
          writable: true;
          pda: {
            seeds: [
              {
                kind: 'const';
                value: [80, 65, 82, 84, 78, 69, 82];
              },
              {
                kind: 'const';
                value: [95];
              },
              {
                kind: 'arg';
                path: 'partnerCode';
              },
            ];
          };
        },
        {
          name: 'purchaserAta';
          writable: true;
        },
        {
          name: 'bankAta';
          writable: true;
        },
        {
          name: 'partnerPdaAta';
          writable: true;
        },
        {
          name: 'tokenProgram';
          address: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA';
        },
        {
          name: 'systemProgram';
          address: '11111111111111111111111111111111';
        },
      ];
      args: [
        {
          name: 'partnerCode';
          type: 'string';
        },
        {
          name: 'amount';
          type: 'u64';
        },
      ];
    },
    {
      name: 'receiveSol';
      discriminator: [121, 244, 250, 3, 8, 229, 225, 1];
      accounts: [
        {
          name: 'partner';
          writable: true;
          pda: {
            seeds: [
              {
                kind: 'const';
                value: [80, 65, 82, 84, 78, 69, 82];
              },
              {
                kind: 'const';
                value: [95];
              },
              {
                kind: 'arg';
                path: 'partnerCode';
              },
            ];
          };
        },
        {
          name: 'ixSysvar';
          address: 'Sysvar1nstructions1111111111111111111111111';
        },
        {
          name: 'payer';
          writable: true;
          signer: true;
        },
      ];
      args: [
        {
          name: 'partner';
          type: 'string';
        },
        {
          name: 'deadline';
          type: 'u128';
        },
        {
          name: 'sig';
          type: {
            array: ['u8', 64];
          };
        },
        {
          name: 'idx';
          type: 'u32';
        },
      ];
    },
    {
      name: 'receiveUsdc';
      discriminator: [234, 4, 133, 7, 111, 131, 48, 237];
      accounts: [
        {
          name: 'partner';
          writable: true;
          pda: {
            seeds: [
              {
                kind: 'const';
                value: [80, 65, 82, 84, 78, 69, 82];
              },
              {
                kind: 'const';
                value: [95];
              },
              {
                kind: 'arg';
                path: 'partnerCode';
              },
            ];
          };
        },
        {
          name: 'partnerAta';
          writable: true;
        },
        {
          name: 'partnerPdaAta';
          writable: true;
        },
        {
          name: 'tokenProgram';
          address: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA';
        },
        {
          name: 'ixSysvar';
          address: 'Sysvar1nstructions1111111111111111111111111';
        },
        {
          name: 'payer';
          writable: true;
          signer: true;
        },
      ];
      args: [
        {
          name: 'partner';
          type: 'string';
        },
        {
          name: 'deadline';
          type: 'u128';
        },
        {
          name: 'sig';
          type: {
            array: ['u8', 64];
          };
        },
        {
          name: 'idx';
          type: 'u32';
        },
      ];
    },
    {
      name: 'receiveUsdt';
      discriminator: [192, 212, 105, 29, 61, 88, 125, 227];
      accounts: [
        {
          name: 'partner';
          writable: true;
          pda: {
            seeds: [
              {
                kind: 'const';
                value: [80, 65, 82, 84, 78, 69, 82];
              },
              {
                kind: 'const';
                value: [95];
              },
              {
                kind: 'arg';
                path: 'partnerCode';
              },
            ];
          };
        },
        {
          name: 'partnerAta';
          writable: true;
        },
        {
          name: 'partnerPdaAta';
          writable: true;
        },
        {
          name: 'tokenProgram';
          address: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA';
        },
        {
          name: 'ixSysvar';
          address: 'Sysvar1nstructions1111111111111111111111111';
        },
        {
          name: 'payer';
          writable: true;
          signer: true;
        },
      ];
      args: [
        {
          name: 'partner';
          type: 'string';
        },
        {
          name: 'deadline';
          type: 'u128';
        },
        {
          name: 'sig';
          type: {
            array: ['u8', 64];
          };
        },
        {
          name: 'idx';
          type: 'u32';
        },
      ];
    },
    {
      name: 'setPartnerInterest';
      discriminator: [12, 74, 170, 118, 125, 171, 78, 169];
      accounts: [
        {
          name: 'partner';
          writable: true;
        },
        {
          name: 'payer';
          writable: true;
          signer: true;
        },
      ];
      args: [
        {
          name: 'mainInterest';
          type: 'u64';
        },
        {
          name: 'secondaryInterest';
          type: 'u64';
        },
      ];
    },
    {
      name: 'setSaleHandlerCap';
      discriminator: [176, 174, 114, 22, 87, 53, 72, 6];
      accounts: [
        {
          name: 'saleHandler';
          writable: true;
        },
        {
          name: 'payer';
          writable: true;
          signer: true;
        },
      ];
      args: [
        {
          name: 'maxCap';
          type: 'u64';
        },
        {
          name: 'minCap';
          type: 'u64';
        },
      ];
    },
    {
      name: 'setSaleHandlerPartnerInterest';
      discriminator: [66, 243, 19, 3, 139, 168, 76, 185];
      accounts: [
        {
          name: 'saleHandler';
          writable: true;
        },
        {
          name: 'payer';
          writable: true;
          signer: true;
        },
      ];
      args: [
        {
          name: 'mainInterest';
          type: 'u64';
        },
        {
          name: 'secondaryInterest';
          type: 'u64';
        },
      ];
    },
    {
      name: 'setSaleHandlerPurchaseBonus';
      discriminator: [48, 27, 155, 123, 142, 125, 123, 115];
      accounts: [
        {
          name: 'saleHandler';
          writable: true;
        },
        {
          name: 'payer';
          writable: true;
          signer: true;
        },
      ];
      args: [
        {
          name: 'thresholds';
          type: {
            vec: 'u64';
          };
        },
        {
          name: 'percents';
          type: {
            vec: 'u64';
          };
        },
      ];
    },
    {
      name: 'setStepPrice';
      discriminator: [158, 185, 23, 146, 123, 228, 216, 239];
      accounts: [
        {
          name: 'step';
          writable: true;
        },
        {
          name: 'payer';
          writable: true;
          signer: true;
        },
      ];
      args: [
        {
          name: 'price';
          type: 'u64';
        },
      ];
    },
    {
      name: 'setStepSupply';
      discriminator: [43, 27, 231, 48, 68, 147, 129, 0];
      accounts: [
        {
          name: 'step';
          writable: true;
        },
        {
          name: 'payer';
          writable: true;
          signer: true;
        },
      ];
      args: [
        {
          name: 'totalSupply';
          type: 'u128';
        },
      ];
    },
  ];
  accounts: [
    {
      name: 'partner';
      discriminator: [122, 43, 246, 239, 141, 56, 243, 182];
    },
    {
      name: 'priceUpdateV2';
      discriminator: [34, 241, 35, 99, 157, 126, 244, 205];
    },
    {
      name: 'purchaser';
      discriminator: [97, 76, 239, 54, 67, 65, 19, 121];
    },
    {
      name: 'saleHandler';
      discriminator: [220, 151, 165, 55, 199, 17, 104, 156];
    },
    {
      name: 'step';
      discriminator: [215, 98, 129, 236, 116, 128, 24, 137];
    },
  ];
  events: [
    {
      name: 'purchaseWithSol';
      discriminator: [214, 189, 229, 190, 99, 63, 237, 211];
    },
    {
      name: 'purchaseWithUsdc';
      discriminator: [93, 119, 171, 151, 188, 64, 202, 186];
    },
    {
      name: 'purchaseWithUsdt';
      discriminator: [20, 69, 116, 47, 61, 69, 239, 138];
    },
    {
      name: 'receiveSol';
      discriminator: [63, 102, 203, 174, 235, 47, 21, 217];
    },
    {
      name: 'receiveUsdc';
      discriminator: [211, 98, 63, 202, 17, 92, 228, 159];
    },
    {
      name: 'receiveUsdt';
      discriminator: [32, 152, 86, 93, 220, 243, 230, 201];
    },
  ];
  errors: [
    {
      code: 6000;
      name: 'unauthorized';
      msg: 'unauthorized';
    },
    {
      code: 6001;
      name: 'signatureVerificationFailed';
      msg: 'Signature verification failed.';
    },
    {
      code: 6002;
      name: 'saleHandlerEnabled';
      msg: 'SaleHandler already enabled';
    },
    {
      code: 6003;
      name: 'saleHandlerDisabled';
      msg: 'SaleHandler already disabled';
    },
    {
      code: 6004;
      name: 'saleHandlerNotEnabled';
      msg: 'SaleHandler not enabled';
    },
    {
      code: 6005;
      name: 'saleHandlerMinCapTooLarge';
      msg: 'SaleHandler min cap larger than max cap';
    },
    {
      code: 6006;
      name: 'saleHandlerMinCapNotReached';
      msg: 'SaleHandler min cap not reached';
    },
    {
      code: 6007;
      name: 'saleHandlerMaxCapExceeded';
      msg: 'SaleHandler max cap exceeded';
    },
    {
      code: 6008;
      name: 'saleHandlerMainPartnerInterestTooLarge';
      msg: 'SaleHandler main partner interest too large';
    },
    {
      code: 6009;
      name: 'saleHandlerSecondaryPartnerInterestTooLarge';
      msg: 'SaleHandler secondary partner interest too large';
    },
    {
      code: 6010;
      name: 'stepSupplyTooSmall';
      msg: 'Step supply is too small';
    },
    {
      code: 6011;
      name: 'stepEnabled';
      msg: 'Step already enabled';
    },
    {
      code: 6012;
      name: 'stepDisabled';
      msg: 'Step already disabled';
    },
    {
      code: 6013;
      name: 'stepNotEnabled';
      msg: 'Step not enabled';
    },
    {
      code: 6014;
      name: 'stepSupplyExceeded';
      msg: 'Step total supply exceeded';
    },
    {
      code: 6015;
      name: 'inactiveStep';
      msg: 'Inactive step account';
    },
    {
      code: 6016;
      name: 'wrongPriceFeedId';
      msg: 'Wrong price feed account';
    },
    {
      code: 6017;
      name: 'wrongStablecoin';
      msg: 'Wrong stablecoin account';
    },
    {
      code: 6018;
      name: 'wrongBank';
      msg: 'Wrong bank account';
    },
    {
      code: 6019;
      name: 'priceIsDown';
      msg: 'Oracle price is down';
    },
    {
      code: 6020;
      name: 'partnerNoFunds';
      msg: 'Partner no funds';
    },
    {
      code: 6021;
      name: 'expiredSignature';
      msg: 'Expired signature';
    },
    {
      code: 6022;
      name: 'wrongBonusesLens';
      msg: 'Wrong Bonuses Lens';
    },
    {
      code: 6023;
      name: 'wrongBonusesValues';
      msg: 'Wrong Bonuses Values';
    },
  ];
  types: [
    {
      name: 'partner';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'mainInterest';
            type: 'u64';
          },
          {
            name: 'secondaryInterest';
            type: 'u64';
          },
          {
            name: 'solReward';
            type: 'u64';
          },
          {
            name: 'usdtReward';
            type: 'u64';
          },
          {
            name: 'usdcReward';
            type: 'u64';
          },
          {
            name: 'tokenReward';
            type: 'u128';
          },
          {
            name: 'enabled';
            type: 'bool';
          },
        ];
      };
    },
    {
      name: 'priceFeedMessage';
      repr: {
        kind: 'c';
      };
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'feedId';
            type: {
              array: ['u8', 32];
            };
          },
          {
            name: 'price';
            type: 'i64';
          },
          {
            name: 'conf';
            type: 'u64';
          },
          {
            name: 'exponent';
            type: 'i32';
          },
          {
            name: 'publishTime';
            docs: ['The timestamp of this price update in seconds'];
            type: 'i64';
          },
          {
            name: 'prevPublishTime';
            docs: [
              'The timestamp of the previous price update. This field is intended to allow users to',
              'identify the single unique price update for any moment in time:',
              'for any time t, the unique update is the one such that prev_publish_time < t <= publish_time.',
              '',
              'Note that there may not be such an update while we are migrating to the new message-sending logic,',
              'as some price updates on pythnet may not be sent to other chains (because the message-sending',
              'logic may not have triggered). We can solve this problem by making the message-sending mandatory',
              '(which we can do once publishers have migrated over).',
              '',
              'Additionally, this field may be equal to publish_time if the message is sent on a slot where',
              'where the aggregation was unsuccesful. This problem will go away once all publishers have',
              'migrated over to a recent version of pyth-agent.',
            ];
            type: 'i64';
          },
          {
            name: 'emaPrice';
            type: 'i64';
          },
          {
            name: 'emaConf';
            type: 'u64';
          },
        ];
      };
    },
    {
      name: 'priceUpdateV2';
      docs: [
        'A price update account. This account is used by the Pyth Receiver program to store a verified price update from a Pyth price feed.',
        'It contains:',
        '- `write_authority`: The write authority for this account. This authority can close this account to reclaim rent or update the account to contain a different price update.',
        '- `verification_level`: The [`VerificationLevel`] of this price update. This represents how many Wormhole guardian signatures have been verified for this price update.',
        '- `price_message`: The actual price update.',
        '- `posted_slot`: The slot at which this price update was posted.',
      ];
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'writeAuthority';
            type: 'pubkey';
          },
          {
            name: 'verificationLevel';
            type: {
              defined: {
                name: 'verificationLevel';
              };
            };
          },
          {
            name: 'priceMessage';
            type: {
              defined: {
                name: 'priceFeedMessage';
              };
            };
          },
          {
            name: 'postedSlot';
            type: 'u64';
          },
        ];
      };
    },
    {
      name: 'purchaseWithSol';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'step';
            type: 'i16';
          },
          {
            name: 'purchaser';
            type: 'pubkey';
          },
          {
            name: 'partner';
            type: 'string';
          },
          {
            name: 'usdEquivalent';
            type: 'u128';
          },
          {
            name: 'solAmount';
            type: 'u64';
          },
          {
            name: 'tokenAmount';
            type: 'u128';
          },
        ];
      };
    },
    {
      name: 'purchaseWithUsdc';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'step';
            type: 'i16';
          },
          {
            name: 'purchaser';
            type: 'pubkey';
          },
          {
            name: 'partner';
            type: 'string';
          },
          {
            name: 'usdEquivalent';
            type: 'u128';
          },
          {
            name: 'usdcAmount';
            type: 'u64';
          },
          {
            name: 'tokenAmount';
            type: 'u128';
          },
        ];
      };
    },
    {
      name: 'purchaseWithUsdt';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'step';
            type: 'i16';
          },
          {
            name: 'purchaser';
            type: 'pubkey';
          },
          {
            name: 'partner';
            type: 'string';
          },
          {
            name: 'usdEquivalent';
            type: 'u128';
          },
          {
            name: 'usdtAmount';
            type: 'u64';
          },
          {
            name: 'tokenAmount';
            type: 'u128';
          },
        ];
      };
    },
    {
      name: 'purchaser';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'purchased';
            type: 'u128';
          },
        ];
      };
    },
    {
      name: 'receiveSol';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'partner';
            type: 'string';
          },
          {
            name: 'amount';
            type: 'u64';
          },
        ];
      };
    },
    {
      name: 'receiveUsdc';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'partner';
            type: 'string';
          },
          {
            name: 'amount';
            type: 'u64';
          },
        ];
      };
    },
    {
      name: 'receiveUsdt';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'partner';
            type: 'string';
          },
          {
            name: 'amount';
            type: 'u64';
          },
        ];
      };
    },
    {
      name: 'saleHandler';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'maxCap';
            type: 'u64';
          },
          {
            name: 'minCap';
            type: 'u64';
          },
          {
            name: 'mainInterest';
            type: 'u64';
          },
          {
            name: 'secondaryInterest';
            type: 'u64';
          },
          {
            name: 'totalSold';
            type: 'u128';
          },
          {
            name: 'step';
            type: 'i16';
          },
          {
            name: 'status';
            type: {
              defined: {
                name: 'sale_handler::state::sale_handler::Status';
              };
            };
          },
          {
            name: 'enabled';
            type: 'bool';
          },
          {
            name: 'bonusPercents';
            type: {
              vec: 'u64';
            };
          },
          {
            name: 'bonusThresholds';
            type: {
              vec: 'u64';
            };
          },
        ];
      };
    },
    {
      name: 'step';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'id';
            type: 'i16';
          },
          {
            name: 'price';
            type: 'u64';
          },
          {
            name: 'totalSold';
            type: 'u128';
          },
          {
            name: 'totalSupply';
            type: 'u128';
          },
          {
            name: 'status';
            type: {
              defined: {
                name: 'sale_handler::state::step::Status';
              };
            };
          },
        ];
      };
    },
    {
      name: 'verificationLevel';
      docs: [
        'Pyth price updates are bridged to all blockchains via Wormhole.',
        'Using the price updates on another chain requires verifying the signatures of the Wormhole guardians.',
        'The usual process is to check the signatures for two thirds of the total number of guardians, but this can be cumbersome on Solana because of the transaction size limits,',
        'so we also allow for partial verification.',
        '',
        'This enum represents how much a price update has been verified:',
        '- If `Full`, we have verified the signatures for two thirds of the current guardians.',
        '- If `Partial`, only `num_signatures` guardian signatures have been checked.',
        '',
        '# Warning',
        'Using partially verified price updates is dangerous, as it lowers the threshold of guardians that need to collude to produce a malicious price update.',
      ];
      type: {
        kind: 'enum';
        variants: [
          {
            name: 'partial';
            fields: [
              {
                name: 'numSignatures';
                type: 'u8';
              },
            ];
          },
          {
            name: 'full';
          },
        ];
      };
    },
    {
      name: 'sale_handler::state::sale_handler::Status';
      type: {
        kind: 'enum';
        variants: [
          {
            name: 'none';
          },
          {
            name: 'enabled';
          },
          {
            name: 'disabled';
          },
        ];
      };
    },
    {
      name: 'sale_handler::state::step::Status';
      type: {
        kind: 'enum';
        variants: [
          {
            name: 'none';
          },
          {
            name: 'enabled';
          },
          {
            name: 'disabled';
          },
        ];
      };
    },
  ];
};
