import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { SupportTicket } from "@src/interfaces";
import {
  InfiniteQueryParams,
  InfiniteQueryOptions,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { QueryClient } from "@tanstack/react-query";

/**
 * Endpoint to fetch and manage support tickets with pagination and filtering capabilities.
 * This function allows users to retrieve support tickets based on their status and type, 
 * providing options for pagination and additional query parameters.
 * It is designed for applications that require detailed management and retrieval of support tickets.
 * @name GetSupportTickets
 * @param {string} status - The status of the support tickets
 * @param {string} type - The type of the support tickets
 * @version 1.2
 **/

export const SUPPORT_TICKETS_QUERY_KEY = (status?: string, type?: string) => [
  "SUPPORT_TICKETS",
  type,
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
  status: string;
  type: string;
}

export const GetSupportTickets = async ({
  type,
  status,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetSupportTicketsProps): Promise<ConnectedXMResponse<SupportTicket[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/supportTickets`, {
    params: {
      status: status || undefined,
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      type: type || undefined,
      search: search || undefined,
    },
  });
  return data;
};

export const useGetSupportTickets = (
  type: string,
  status: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetSupportTickets>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetSupportTickets>>
  >(
    SUPPORT_TICKETS_QUERY_KEY(status, type),
    (params: InfiniteQueryParams) =>
      GetSupportTickets({
        type,
        status,
        ...params,
      }),
    params,
    options,
    "support"
  );
};