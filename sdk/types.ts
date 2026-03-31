export interface Proof {
  wallet?: string;
  platform: string;
  userId: string;
  username?: string;
  proof_hash: string;
  signature: string;
  nonce: string;
  issuedAt: number;
  version: string;
}

export interface VerifyResponse {
  valid: boolean;
  wallet: string;
  proofs: Proof[];
}
