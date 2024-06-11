import {
  useConnectedInfiniteQuery,
  InfiniteQueryParams,
  InfiniteQueryOptions,
} from "../useConnectedInfiniteQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { Event } from "@src/interfaces";
import { SPONSORSHIP_QUERY_KEY } from "./useGetSponsorship";
import { QueryClient } from "@tanstack/react-query";
import { GetAdminAPI } from "@src/AdminAPI";

export const SPONSORSHIP_EVENTS_QUERY_KEY = (sponsorshipId: string) => [
  ...SPONSORSHIP_QUERY_KEY(sponsorshipId),
  "EVENTS",
];

export const SET_SPONSORSHIP_EVENTS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof SPONSORSHIP_EVENTS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetSponsorshipEvents>>
) => {
  client.setQueryData(SPONSORSHIP_EVENTS_QUERY_KEY(...keyParams), response);
};

interface GetSponsorshipEventsParams extends InfiniteQueryParams {
  sponsorshipId: string;
}

export const GetSponsorshipEvents = async ({
  sponsorshipId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetSponsorshipEventsParams): Promise<ConnectedXMResponse<Event[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/sponsorships/${sponsorshipId}/events`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });

  return data;
};

const useGetSponsorshipEvents = (
  sponsorshipId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetSponsorshipEvents>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetSponsorshipEvents>>
  >(
    SPONSORSHIP_EVENTS_QUERY_KEY(sponsorshipId),
    (params: InfiniteQueryParams) =>
      GetSponsorshipEvents({ ...params, sponsorshipId }),
    params,
    {
      ...options,
      enabled: !!sponsorshipId && (options.enabled ?? true),
    }
  );
};

export default useGetSponsorshipEvents;
