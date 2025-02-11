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

/**
 * Endpoint to fetch a specific invoice line item by its ID.
 * This function retrieves detailed information about a particular line item within an invoice.
 * It is intended for use in applications that require access to specific invoice line item data.
 * @name GetInvoiceLineItem
 * @param {string} invoiceId (path) The ID of the invoice
 * @param {string} lineItemId (path) The ID of the line item
 * @version 1.3
 **/

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

export const useGetInvoiceLineItem = (
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
    },
    "invoices"
  );
};
