import { GetAdminAPI } from "@src/AdminAPI";
import { AccountInvitation, ConnectedXMResponse } from "@src/interfaces";

import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";

import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group Accounts
 */
export const ACCOUNT_INVITATIONS_QUERY_KEY = () => ["ACCOUNT_INVITATIONS"];

/**
 * @category Setters
 * @group Accounts
 */
export const SET_ACCOUNT_INVITATIONS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof ACCOUNT_INVITATIONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetAccountInvitations>>
) => {
  client.setQueryData(ACCOUNT_INVITATIONS_QUERY_KEY(...keyParams), response);
};

interface GetAccountInvitationsProps extends InfiniteQueryParams {}

/**
 * @category Queries
 * @group Accounts
 */
export const GetAccountInvitations = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetAccountInvitationsProps): Promise<
  ConnectedXMResponse<AccountInvitation[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/accounts/invitations`, {
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
 * @group Accounts
 */
export const useGetAccountInvitations = (
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetAccountInvitations>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetAccountInvitations>>
  >(
    ACCOUNT_INVITATIONS_QUERY_KEY(),
    (params: InfiniteQueryParams) => GetAccountInvitations({ ...params }),
    params,
    options
  );
};
