import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { EventPage } from "@src/interfaces";
import useConnectedInfiniteQuery, {
  InfiniteQueryParams,
} from "../../useConnectedInfiniteQuery";
import { EVENTS_QUERY_KEY } from "../useGetEvents";
import { QueryClient } from "@tanstack/react-query";

export const EVENT_PAGES_QUERY_KEY = (eventId: string) => [
  ...EVENTS_QUERY_KEY(eventId),
  "PAGES",
];

export const SET_EVENT_PAGES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_PAGES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventPages>>
) => {
  client.setQueryData(EVENT_PAGES_QUERY_KEY(...keyParams), response);
};

interface GetEventPagesProps extends InfiniteQueryParams {
  eventId: string;
}

export const GetEventPages = async ({
  eventId,
  pageParam,
  pageSize,
  orderBy,
  search,
}: GetEventPagesProps): Promise<ConnectedXMResponse<EventPage[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/events/${eventId}/pages`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });
  return data;
};

const useGetEventPages = (eventId: string) => {
  return useConnectedInfiniteQuery<ReturnType<typeof GetEventPages>>(
    EVENT_PAGES_QUERY_KEY(eventId),
    (params: any) => GetEventPages(params),
    {
      eventId,
    },
    {
      enabled: !!eventId,
    }
  );
};

export default useGetEventPages;
