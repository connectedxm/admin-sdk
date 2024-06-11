import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { EmailReceipt } from "@src/interfaces";
import { EMAIL_RECEIPTS_QUERY_KEY } from "./useGetEmailReceipts";
import { QueryClient } from "@tanstack/react-query";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * @category Key
 * @group Emails
 */
export const EMAIL_RECEIPT_QUERY_KEY = (emailReceiptId: string) => [
  ...EMAIL_RECEIPTS_QUERY_KEY(),
  emailReceiptId,
];

/**
 * @category Setters
 * @group Emails
 */
export const SET_EMAIL_RECEIPT_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EMAIL_RECEIPT_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEmailReceipt>>
) => {
  client.setQueryData(EMAIL_RECEIPT_QUERY_KEY(...keyParams), response);
};

interface GetEmailReceiptParams extends SingleQueryParams {
  emailReceiptId: string;
}

/**
 * @category Query
 * @group Emails
 */
export const GetEmailReceipt = async ({
  emailReceiptId,
  adminApiParams,
}: GetEmailReceiptParams): Promise<ConnectedXMResponse<EmailReceipt>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/logs/email-receipts/${emailReceiptId}`);

  return data;
};

/**
 * @category Hooks
 * @group Emails
 */
export const useGetEmailReceipt = (
  emailReceiptId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetEmailReceipt>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEmailReceipt>>(
    EMAIL_RECEIPT_QUERY_KEY(emailReceiptId),
    (params: SingleQueryParams) =>
      GetEmailReceipt({ emailReceiptId, ...params }),
    {
      ...options,
      enabled: !!emailReceiptId,
    }
  );
};
