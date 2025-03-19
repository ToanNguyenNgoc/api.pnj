export type VnPayTransactionType = {
  vnp_Amount: string; // Transaction amount in smallest currency unit (e.g., VND x 100)
  vnp_BankCode: string; // Bank code used for payment
  vnp_CardType: string; // Card type used (e.g., QRCODE, ATM, etc.)
  vnp_OrderInfo: string; // Base64-encoded order information
  vnp_PayDate: string; // Payment date in YYYYMMDDHHMMSS format
  vnp_ResponseCode: string; // Response code (e.g., "24" for a failed transaction)
  vnp_TmnCode: string; // Merchant terminal code
  vnp_TransactionNo: string; // Transaction number (if successful)
  vnp_TransactionStatus: string; // Transaction status code
  vnp_TxnRef: string; // Transaction reference, usually Base64-encoded
  vnp_SecureHash: string; // Secure hash for verifying integrity
};
