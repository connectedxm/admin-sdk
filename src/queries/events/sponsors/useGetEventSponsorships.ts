import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";

import { Sponsorship } from "@src/interfaces";
import useConnectedInfiniteQuery, {
  InfiniteQueryParams,
} from "../../useConnectedInfiniteQuery";
import { EVENT_QUERY_KEY } from "../useGetEvent";

export const EVENT_SPONSORSHIPS_QUERY_KEY = (eventId: string) => [
  ...EVENT_QUERY_KEY(eventId),
  "SPONSORSHIPS",
];

export const SET_EVENT_SPONSORSHIPS_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_SPONSORSHIPS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventSponsorships>>
) => {
  client.setQueryData(EVENT_SPONSORSHIPS_QUERY_KEY(...keyParams), response);
};

interface GetEventSponsorshipsProps extends InfiniteQueryParams {
  eventId: string;
}

export const GetEventSponsorships = async ({
  eventId,
  pageParam,
  pageSize,
  orderBy,
  search,
}: GetEventSponsorshipsProps): Promise<ConnectedXMResponse<Sponsorship[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/sponsors/sponsorships`,
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

const useGetEventSponsorships = (eventId: string) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventSponsorships>>
  >(
    EVENT_SPONSORSHIPS_QUERY_KEY(eventId),
    (params: any) => GetEventSponsorships(params),
    {
      eventId,
    },
    {
      enabled: !!eventId,
    }
  );
};

export default useGetEventSponsorships;
