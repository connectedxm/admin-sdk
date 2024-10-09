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
 * @category Keys
 * @group Invoices
 */
export const INVOICE_PAYMENTS_QUERY_KEY = (invoiceId: string) => [
  ...INVOICE_QUERY_KEY(invoiceId),
  "PAYMENTS",
];

/**
 * @category Setters
 * @group Invoices
 */
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

/**
 * @category Queries
 * @group Invoices
 */
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
/**
 * @category Hooks
 * @group Invoices
 */
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
