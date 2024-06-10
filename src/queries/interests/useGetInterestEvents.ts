import { ConnectedXMResponse } from "@src/interfaces";

import { Event } from "@src/interfaces";
import {
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { INTEREST_QUERY_KEY } from "./useGetInterest";
import { QueryClient } from "@tanstack/react-query";

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

export const QUERY_KEY = "INTEREST_EVENTS";

const useGetInterestEvents = (interestId: string) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetInterestEvents>>
  >(
    INTEREST_EVENTS_QUERY_KEY(interestId),
    (params: any) => GetInterestEvents(params),
    {
      interestId,
    },
    {
      enabled: !!interestId,
    }
  );
};

export default useGetInterestEvents;
