import { ConnectedXMResponse } from "@src/interfaces";
import { Invoice } from "@src/interfaces";
import {
  InfiniteQueryParams,
  InfiniteQueryOptions,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { QueryClient } from "@tanstack/react-query";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * Endpoint to retrieve a list of invoices.
 * This function provides a paginated list of invoices, allowing for optional sorting and filtering.
 * It is designed to be used in applications where invoice data needs to be displayed or processed.
 * @name GetInvoices
 * @version 1.3
 **/
export const INVOICES_QUERY_KEY = () => ["INVOICES"];

export const SET_INVOICES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof INVOICES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetInvoices>>
) => {
  client.setQueryData(INVOICES_QUERY_KEY(...keyParams), response);
};

interface GetInvoicesProps extends InfiniteQueryParams {}

export const GetInvoices = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetInvoicesProps): Promise<ConnectedXMResponse<Invoice[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/invoices`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });
  return data;
};

export const useGetInvoices = (
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<Awaited<ReturnType<typeof GetInvoices>>> = {}
) => {
  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetInvoices>>>(
    INVOICES_QUERY_KEY(),
    (params: InfiniteQueryParams) => GetInvoices(params),
    params,
    options,
    "invoices"
  );
};