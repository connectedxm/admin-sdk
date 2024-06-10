import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { SupportTicket } from "@src/interfaces";
import {
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { QueryClient } from "@tanstack/react-query";

export const SUPPORT_TICKETS_QUERY_KEY = (status?: string) => [
  "SUPPORT_TICKETS",
  status,
];

export const SET_SUPPORT_TICKETS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof SUPPORT_TICKETS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetSupportTickets>>
) => {
  client.setQueryData(SUPPORT_TICKETS_QUERY_KEY(...keyParams), response);
};

interface GetSupportTicketsProps extends InfiniteQueryParams {
  status: String;
}

export const GetSupportTickets = async ({
  status,
  pageParam,
  pageSize,
  orderBy,
  search,
}: GetSupportTicketsProps): Promise<ConnectedXMResponse<SupportTicket[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/supportTickets`, {
    params: {
      status: status || undefined,
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });
  return data;
};

const useGetSupportTickets = (status?: string) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetSupportTickets>>
  >(
    SUPPORT_TICKETS_QUERY_KEY(status),
    (params: any) => GetSupportTickets(params),
    {
      status,
    },
    {}
  );
};

export default useGetSupportTickets;
