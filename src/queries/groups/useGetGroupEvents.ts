import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import {
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { Event } from "@src/interfaces";
import { GROUP_QUERY_KEY } from "./useGetGroup";
import { QueryClient } from "@tanstack/react-query";

export const GROUP_EVENTS_QUERY_KEY = (groupId: string, past?: boolean) => [
  ...GROUP_QUERY_KEY(groupId),
  "EVENTS",
  past ? (past ? "past" : "upcoming") : "all",
];

export const SET_GROUP_EVENTS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof GROUP_EVENTS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetGroupEvents>>
) => {
  client.setQueryData(GROUP_EVENTS_QUERY_KEY(...keyParams), response);
};

interface GetGroupEventsProps extends InfiniteQueryParams {
  groupId: string;
  past: boolean;
}

export const GetGroupEvents = async ({
  groupId,
  pageParam,
  pageSize,
  orderBy,
  past,
  search,
}: GetGroupEventsProps): Promise<ConnectedXMResponse<Event[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/groups/${groupId}/events`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      past: past ? "true" : undefined,
      search: search || undefined,
    },
  });
  return data;
};

const useGetGroupEvents = (groupId: string, past?: boolean) => {
  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetGroupEvents>>>(
    GROUP_EVENTS_QUERY_KEY(groupId, past),
    (params: any) => GetGroupEvents(params),
    {
      groupId,
      past,
    },
    {
      enabled: !!groupId,
    }
  );
};

export default useGetGroupEvents;
