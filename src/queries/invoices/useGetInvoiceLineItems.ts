import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";

import { InvoiceLineItem } from "@src/interfaces";
import {
  InfiniteQueryParams,
  InfiniteQueryOptions,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { QueryClient } from "@tanstack/react-query";
import { INVOICE_QUERY_KEY } from "./useGetInvoice";

/**
 * @category Keys
 * @group Invoices
 */
export const INVOICE_LINE_ITEMS_QUERY_KEY = (invoiceId: string) => [
  ...INVOICE_QUERY_KEY(invoiceId),
  "LINE_ITEMS",
];

/**
 * @category Setters
 * @group Invoices
 */
export const SET_INVOICE_LINE_ITEMS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof INVOICE_LINE_ITEMS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetInvoiceLineItems>>
) => {
  client.setQueryData(INVOICE_LINE_ITEMS_QUERY_KEY(...keyParams), response);
};

interface GetInvoiceLineItemsProps extends InfiniteQueryParams {
  invoiceId: string;
}

/**
 * @category Queries
 * @group Invoices
 */
export const GetInvoiceLineItems = async ({
  invoiceId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetInvoiceLineItemsProps): Promise<
  ConnectedXMResponse<InvoiceLineItem[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/invoices/${invoiceId}/items`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });
  return data;
};
/**
 * @category Hooks
 * @group Invoices
 */
export const useGetInvoiceLineItems = (
  invoiceId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetInvoiceLineItems>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetInvoiceLineItems>>
  >(
    INVOICE_LINE_ITEMS_QUERY_KEY(invoiceId),
    (params: InfiniteQueryParams) =>
      GetInvoiceLineItems({
        invoiceId,
        ...params,
      }),
    params,
    {
      ...options,
      enabled: !!invoiceId && (options.enabled ?? true),
    },
    "invoices"
  );
};
