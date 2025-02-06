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
 * Fetches events associated with a specific interest.
 * This function is designed to retrieve a list of events that are related to a given interest, identified by its ID.
 * It is useful for applications that need to display or process events linked to particular interests.
 * @name GetInterestEvents
 * @param {string} interestId (path) - The id of the interest
 * @version 1.3
 **/

export const INTEREST_EVENTS_QUERY_KEY = (interestId: string) => [
  ...INTEREST_QUERY_KEY(interestId),
  "EVENTS",
];

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
    },
    "interests"
  );
};