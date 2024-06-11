import { ConnectedXMResponse } from "@src/interfaces";
import { Account } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";
import { EVENT_SESSION_QUERY_KEY } from "./useGetEventSession";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_SESSION_ACCOUNTS_QUERY_KEY = (
  eventId: string,
  sessionId: string
) => [...EVENT_SESSION_QUERY_KEY(eventId, sessionId), "ACCOUNTS"];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_SESSION_ACCOUNTS_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_SESSION_ACCOUNTS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventSessionAccounts>>
) => {
  client.setQueryData(EVENT_SESSION_ACCOUNTS_QUERY_KEY(...keyParams), response);
};

interface GetEventSessionAccountsProps extends InfiniteQueryParams {
  eventId: string;
  sessionId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventSessionAccounts = async ({
  eventId,
  sessionId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetEventSessionAccountsProps): Promise<ConnectedXMResponse<Account[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/sessions/${sessionId}/accounts`,
    {
      params: {
        page: pageParam || undefined,
        pageSize: pageSize || undefined,
        orderBy: orderBy || undefined,
        search: search || undefined,
      },
    }
  );
  return data;
};
/**
 * @category Hooks
 * @group Events
 */
export const useGetEventSessionAccounts = (
  eventId: string = "",
  sessionId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventSessionAccounts>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventSessionAccounts>>
  >(
    EVENT_SESSION_ACCOUNTS_QUERY_KEY(eventId, sessionId),
    (params: InfiniteQueryParams) =>
      GetEventSessionAccounts({
        ...params,
        eventId,
        sessionId,
      }),
    params,
    {
      ...options,
      enabled: !!eventId && !!sessionId && (options.enabled ?? true),
    }
  );
};
