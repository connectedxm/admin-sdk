import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";

import { Account } from "@src/interfaces";
import useConnectedInfiniteQuery, {
  InfiniteQueryParams,
} from "../../useConnectedInfiniteQuery";
import { EVENT_QUERY_KEY } from "../useGetEvent";
import { QueryClient } from "@tanstack/react-query";

export const EVENT_SPONSORS_QUERY_KEY = (eventId: string) => [
  ...EVENT_QUERY_KEY(eventId),
  "SPONSORS",
];

export const SET_EVENT_SPONSORS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_SPONSORS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventSponsors>>
) => {
  client.setQueryData(EVENT_SPONSORS_QUERY_KEY(...keyParams), response);
};

interface GetEventSponsorsProps extends InfiniteQueryParams {
  eventId: string;
}

export const GetEventSponsors = async ({
  eventId,
  pageParam,
  pageSize,
  orderBy,
  search,
}: GetEventSponsorsProps): Promise<ConnectedXMResponse<Account[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/events/${eventId}/sponsors`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });
  return data;
};

const useGetEventSponsors = (eventId: string) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventSponsors>>
  >(
    EVENT_SPONSORS_QUERY_KEY(eventId),
    (params: any) => GetEventSponsors(params),
    {
      eventId,
    },
    {
      enabled: !!eventId,
    }
  );
};

export default useGetEventSponsors;
