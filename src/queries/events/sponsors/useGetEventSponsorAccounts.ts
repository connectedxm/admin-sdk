import { ConnectedXMResponse } from "@src/interfaces";

import { Account } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";
import { EVENT_QUERY_KEY } from "../useGetEvent";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_SPONSOR_ACCOUNTS_QUERY_KEY = (eventId: string) => [
  ...EVENT_QUERY_KEY(eventId),
  "SPONSOR_ACCOUNTS",
];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_SPONSOR_ACCOUNTS_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_SPONSOR_ACCOUNTS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventSponsorAccounts>>
) => {
  client.setQueryData(EVENT_SPONSOR_ACCOUNTS_QUERY_KEY(...keyParams), response);
};

interface GetEventSponsorAccountsProps extends InfiniteQueryParams {
  eventId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventSponsorAccounts = async ({
  eventId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetEventSponsorAccountsProps): Promise<ConnectedXMResponse<Account[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/events/${eventId}/sponsors/accounts`, {
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
 * @group Events
 */
export const useGetEventSponsorAccounts = (
  eventId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventSponsorAccounts>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventSponsorAccounts>>
  >(
    EVENT_SPONSOR_ACCOUNTS_QUERY_KEY(eventId),
    (params: InfiniteQueryParams) =>
      GetEventSponsorAccounts({
        ...params,
        eventId,
      }),
    params,
    {
      ...options,
      enabled: !!eventId && (options.enabled ?? true),
    }
  );
};
