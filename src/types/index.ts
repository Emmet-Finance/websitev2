export * from './chains';
export * from './consts';
export * from './emmetBridge';
export * from './explorer';
export * from './tokens';

export enum AttestationStatus {
    complete = 'complete',
    pending_confirmations = 'pending_confirmations',
}

export interface Attestation {
    message: string | null
    status: AttestationStatus
}

export interface AttestationResponse {
    attestation: string | null
    status: AttestationStatus
}

// ERRORS

// Provider errors: https://eips.ethereum.org/EIPS/eip-1193#provider-errors

export const enum WalletProviderError {
    USER_REJECTED_REQUEST = 4001,
    UNAUTHORIZED = 4100,
    UNSUPPORTED_METHOD = 4200,
    DISCONNECTED = 4900,
    CHAIN_DISCONECTED = 4901,
    CHAIN_NOT_ADDED = 4902,
}

// RPC Errors: https://eips.ethereum.org/EIPS/eip-1474#error-codes
export const enum RPCError {
    PARSE_ERROR = -32700,
    INVALID_REQUEST = -32600,
    METHOD_NOT_FOUND = -32601,
    INVALID_PARAMS = -32602,
    INTERNAL_ERROR = -32603,
    INVALID_INPUT = -32000,
    RESOURCE_NOT_FOUND = -32001,
    RESOURCE_UNAVAILABLE = -32002,
    TRANSCTION_REJECTED = -32003,
    METHOD_NOT_SUPPORTED = -32004,
    LIMIT_EXCEEDED = -32005,
    JSON_RPC_VERSION_NOT_SUPPORTED = -32006
}