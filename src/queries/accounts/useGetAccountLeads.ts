import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, Lead, LeadStatus } from "@src/interfaces";

import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";

import { QueryClient } from "@tanstack/react-query";
import { ACCOUNT_QUERY_KEY } from "./useGetAccount";

/**
 * @category Keys
 * @group Accounts
 */
export const ACCOUNT_LEADS_QUERY_KEY = (accountId: string) => [
  ...ACCOUNT_QUERY_KEY(accountId),
  "LEADS",
];

/**
 * @category Setters
 * @group Accounts
 */
export const SET_ACCOUNT_LEADS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof ACCOUNT_LEADS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetAccountLeads>>
) => {
  client.setQueryData(ACCOUNT_LEADS_QUERY_KEY(...keyParams), response);
};

interface GetAccountLeadsProps extends InfiniteQueryParams {
  accountId: string;
  status?: keyof typeof LeadStatus;
  eventId?: string;
}

/**
 * @category Queries
 * @group Accounts
 */
export const GetAccountLeads = async ({
  accountId,
  status,
  eventId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetAccountLeadsProps): Promise<ConnectedXMResponse<Lead[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/accounts/${accountId}/leads`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
      status: status || undefined,
      eventId: eventId || undefined,
    },
  });
  return data;
};
/**
 * @category Hooks
 * @group Accounts
 */
export const useGetAccountLeads = (
  accountId: string = "",
  status?: keyof typeof LeadStatus,
  eventId?: string,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetAccountLeads>>
  > = {}
) => {
  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetAccountLeads>>>(
    ACCOUNT_LEADS_QUERY_KEY(accountId),
    (params: InfiniteQueryParams) =>
      GetAccountLeads({
        ...params,
        accountId,
        status,
        eventId,
      }),
    params,
    options,
    "accounts"
  );
};
