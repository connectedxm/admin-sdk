import { ConnectedXMResponse, InvoiceStatus } from "@src/interfaces";
import { Invoice } from "@src/interfaces";
import {
  InfiniteQueryParams,
  InfiniteQueryOptions,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { QueryClient } from "@tanstack/react-query";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * @category Keys
 * @group Invoices
 */
export const INVOICES_QUERY_KEY = (
  status?: keyof typeof InvoiceStatus,
  accountId?: string,
  eventId?: string
) => {
  const key = ["INVOICES"];
  if (status) key.push(status);
  if (accountId) key.push(accountId);
  if (eventId) key.push(eventId);
  return key;
};

/**
 * @category Setters
 * @group Invoices
 */
export const SET_INVOICES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof INVOICES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetInvoices>>
) => {
  client.setQueryData(INVOICES_QUERY_KEY(...keyParams), response);
};

interface GetInvoicesProps extends InfiniteQueryParams {
  accountId?: string;
  eventId?: string;
  status?: keyof typeof InvoiceStatus;
}

/**
 * @category Queries
 * @group Invoices
 */
export const GetInvoices = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
  accountId,
  eventId,
  status,
}: GetInvoicesProps): Promise<ConnectedXMResponse<Invoice[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/invoices`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
      status: status || undefined,
      accountId: accountId || undefined,
      eventId: eventId || undefined,
    },
  });
  return data;
};
/**
 * @category Hooks
 * @group Invoices
 */
export const useGetInvoices = (
  status?: keyof typeof InvoiceStatus,
  accountId?: string,
  eventId?: string,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<Awaited<ReturnType<typeof GetInvoices>>> = {}
) => {
  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetInvoices>>>(
    INVOICES_QUERY_KEY(status, accountId, eventId),
    (params: InfiniteQueryParams) =>
      GetInvoices({ ...params, accountId, eventId, status }),
    params,
    options
  );
};
