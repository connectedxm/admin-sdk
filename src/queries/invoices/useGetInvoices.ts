import { ConnectedXMResponse } from "@src/interfaces";
import { Invoice } from "@src/interfaces";
import {
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { QueryClient } from "@tanstack/react-query";

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

const useGetInvoices = () => {
  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetInvoices>>>(
    INVOICES_QUERY_KEY(),
    (params: any) => GetInvoices(params),
    {},
    {}
  );
};

export default useGetInvoices;
