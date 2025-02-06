import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";

import {
  InfiniteQueryParams,
  InfiniteQueryOptions,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { QueryClient } from "@tanstack/react-query";
import { INVOICE_QUERY_KEY } from "./useGetInvoice";
import { Payment } from "@src/interfaces";

/**
 * Endpoint to retrieve a list of payments associated with a specific invoice.
 * This function allows users to fetch payment details for a given invoice by its ID.
 * It is designed to be used in applications where payment information for invoices is required.
 * @name GetInvoicePayments
 * @param {string} invoiceId (path) - The id of the invoice
 * @version 1.3
 **/

export const INVOICE_PAYMENTS_QUERY_KEY = (invoiceId: string) => [
  ...INVOICE_QUERY_KEY(invoiceId),
  "PAYMENTS",
];

export const SET_INVOICE_PAYMENTS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof INVOICE_PAYMENTS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetInvoicePayments>>
) => {
  client.setQueryData(INVOICE_PAYMENTS_QUERY_KEY(...keyParams), response);
};

interface GetInvoicePaymentsProps extends InfiniteQueryParams {
  invoiceId: string;
}

export const GetInvoicePayments = async ({
  invoiceId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetInvoicePaymentsProps): Promise<ConnectedXMResponse<Payment[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/invoices/${invoiceId}/payments`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });
  return data;
};

export const useGetInvoicePayments = (
  invoiceId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetInvoicePayments>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetInvoicePayments>>
  >(
    INVOICE_PAYMENTS_QUERY_KEY(invoiceId),
    (params: InfiniteQueryParams) =>
      GetInvoicePayments({
        ...params,
        invoiceId,
      }),
    params,
    {
      ...options,
      enabled: !!invoiceId && (options.enabled ?? true),
    },
    "invoices"
  );
};