interface CallbackMetadataItem {
  Name: string;
  Value: string | number | Date;
}

interface CallbackMetadata {
  Item: CallbackMetadataItem[];
}

interface StkCallback {
  MerchantRequestID: string;
  CheckoutRequestID: string;
  ResultCode: number;
  ResultDesc: string;
  CallbackMetadata: CallbackMetadata;
}

interface CallbackBody {
  stkCallback: StkCallback;
}

export async function POST() {}
