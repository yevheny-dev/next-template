export interface EvmClaimSignature {
  v: number;
  r: string;
  s: string;
}

export interface ClaimSignResponse {
  signature: string | EvmClaimSignature;
  deadline: number;
}
