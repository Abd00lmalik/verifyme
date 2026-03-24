import type { ProofRecord } from "@/lib/types";
import { MOCK_PROOFS, MOCK_WALLET } from "@/lib/mock-data";

export const proofStore = new Map<string, ProofRecord[]>();
proofStore.set(MOCK_WALLET, [...MOCK_PROOFS]);
