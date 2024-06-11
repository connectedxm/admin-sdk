import { ConnectedXMResponse } from "@src/interfaces";

import { Event } from "@src/interfaces";
import {
  InfiniteQueryParams,
  InfiniteQueryOptions,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { INTEREST_QUERY_KEY } from "./useGetInterest";
import { QueryClient } from "@tanstack/react-query";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * @category Keys
 * @group Interests
 */
export const INTEREST_EVENTS_QUERY_KEY = (interestId: string) => [
  ...INTEREST_QUERY_KEY(interestId),
  "EVENTS",
];

/**
 * @category Setters
 * @group Interests
 */
export const SET_INTEREST_EVENTS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof INTEREST_EVENTS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetInterestEvents>>
) => {
  client.setQueryData(INTEREST_EVENTS_QUERY_KEY(...keyParams), response);
};

interface GetInterestEventsProps extends InfiniteQueryParams {
  interestId: string;
}

/**
 * @category Queries
 * @group Interests
 */
export const GetInterestEvents = async ({
  interestId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetInterestEventsProps): Promise<ConnectedXMResponse<Event[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/interests/${interestId}/events`, {
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
 * @group Interests
 */
export const useGetInterestEvents = (
  interestId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetInterestEvents>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetInterestEvents>>
  >(
    INTEREST_EVENTS_QUERY_KEY(interestId),
    (params: InfiniteQueryParams) =>
      GetInterestEvents({ interestId, ...params }),
    params,
    {
      ...options,
      enabled: !!interestId && (options.enabled ?? true),
    }
  );
};
