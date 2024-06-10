import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";

import { InvoiceLineItem } from "@src/interfaces";
import {
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { QueryClient } from "@tanstack/react-query";
import { INVOICE_QUERY_KEY } from "./useGetInvoice";

export const INVOICE_LINE_ITEMS_QUERY_KEY = (invoiceId: string) => [
  ...INVOICE_QUERY_KEY(invoiceId),
  "LINE_ITEMS",
];

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

export const GetInvoiceLineItems = async ({
  invoiceId,
  pageParam,
  pageSize,
  orderBy,
  search,
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

const useGetInvoiceLineItems = (invoiceId: string) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetInvoiceLineItems>>
  >(
    INVOICE_LINE_ITEMS_QUERY_KEY(invoiceId),
    (params: any) => GetInvoiceLineItems(params),
    {
      invoiceId,
    },
    {
      enabled: !!invoiceId,
    }
  );
};

export default useGetInvoiceLineItems;
