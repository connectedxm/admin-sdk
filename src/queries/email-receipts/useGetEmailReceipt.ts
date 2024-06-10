import { useConnectedSingleQuery } from "../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { EmailReceipt } from "@src/interfaces";
import { EMAIL_RECEIPTS_QUERY_KEY } from "./useGetEmailReceipts";
import { QueryClient } from "@tanstack/react-query";

export const EMAIL_RECEIPT_QUERY_KEY = (emailReceiptId: string) => [
  ...EMAIL_RECEIPTS_QUERY_KEY(),
  emailReceiptId,
];

export const SET_EMAIL_RECEIPT_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EMAIL_RECEIPT_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEmailReceipt>>
) => {
  client.setQueryData(EMAIL_RECEIPT_QUERY_KEY(...keyParams), response);
};

interface GetEmailReceiptParams {
  emailReceiptId: string;
}

export const GetEmailReceipt = async ({
  emailReceiptId,
}: GetEmailReceiptParams): Promise<ConnectedXMResponse<EmailReceipt>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/logs/email-receipts/${emailReceiptId}`);

  return data;
};

const useGetEmailReceipt = (emailReceiptId: string) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEmailReceipt>>(
    EMAIL_RECEIPT_QUERY_KEY(emailReceiptId),
    () => GetEmailReceipt({ emailReceiptId }),
    {
      enabled: !!emailReceiptId,
    }
  );
};

export default useGetEmailReceipt;
