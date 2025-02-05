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
 * Fetches details of a specific email receipt by its unique ID.
 * This function is used to retrieve detailed information about an email receipt, 
 * which can be useful for tracking and auditing email communications.
 * @name GetEmailReceipt
 * @param {string} emailReceiptId - The ID of the email receipt
 * @version 1.2
 **/

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

interface GetEmailReceiptParams extends SingleQueryParams {
  emailReceiptId: string;
}

export const GetEmailReceipt = async ({
  emailReceiptId,
  adminApiParams,
}: GetEmailReceiptParams): Promise<ConnectedXMResponse<EmailReceipt>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/logs/email-receipts/${emailReceiptId}`);

  return data;
};

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
    },
    "org"
  );
};