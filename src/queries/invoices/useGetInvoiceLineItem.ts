import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";
import { InvoiceLineItem } from "@src/interfaces";
import { INVOICE_LINE_ITEMS_QUERY_KEY } from "./useGetInvoiceLineItems";
import { GetAdminAPI } from "@src/AdminAPI";

export const INVOICE_LINE_ITEM_QUERY_KEY = (
  invoiceId: string,
  lineItemId: string
) => [...INVOICE_LINE_ITEMS_QUERY_KEY(invoiceId), lineItemId];

export const SET_INVOICE_LINE_ITEM_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof INVOICE_LINE_ITEM_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetInvoiceLineItem>>
) => {
  client.setQueryData(INVOICE_LINE_ITEM_QUERY_KEY(...keyParams), response);
};

interface GetInvoiceLineItemProps extends SingleQueryParams {
  invoiceId: string;
  lineItemId: string;
}

export const GetInvoiceLineItem = async ({
  invoiceId,
  lineItemId,
  adminApiParams,
}: GetInvoiceLineItemProps): Promise<ConnectedXMResponse<InvoiceLineItem>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/invoices/${invoiceId}/items/${lineItemId}`
  );
  return data;
};

const useGetInvoiceLineItem = (
  invoiceId: string = "",
  lineItemId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetInvoiceLineItem>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetInvoiceLineItem>>(
    INVOICE_LINE_ITEM_QUERY_KEY(invoiceId, lineItemId),
    (params: SingleQueryParams) =>
      GetInvoiceLineItem({ invoiceId, lineItemId, ...params }),
    {
      ...options,
      enabled: !!invoiceId && !!lineItemId && (options?.enabled ?? true),
    }
  );
};

export default useGetInvoiceLineItem;
