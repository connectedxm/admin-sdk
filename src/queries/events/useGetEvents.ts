import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { Event } from "@src/interfaces";
import { useConnectedInfiniteQuery } from "../useConnectedInfiniteQuery";
import { QueryClient } from "@tanstack/react-query";

export const EVENTS_QUERY_KEY = (past?: string) => {
  let keys = ["EVENTS"];
  if (past) keys = [...keys, past];
  return keys;
};

export const SET_EVENTS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENTS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEvents>>
) => {
  client.setQueryData(EVENTS_QUERY_KEY(...keyParams), response);
};

interface GetEventsProps extends InfiniteQueryParams {
  past: boolean;
}

export const GetEvents = async ({
  pageParam,
  pageSize,
  orderBy,
  past,
  search,
}: GetEventsProps): Promise<ConnectedXMResponse<Event[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/events`, {
    params: {
      past: past || undefined,
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });

  return data;
};

const useGetEvents = (past?: string) => {
  return useConnectedInfiniteQuery<ReturnType<typeof GetEvents>>(
    EVENTS_QUERY_KEY(past),
    (params: InfiniteQueryParams) => GetEvents(params),
    {
      past,
    },
    {}
  );
};

export default useGetEvents;
