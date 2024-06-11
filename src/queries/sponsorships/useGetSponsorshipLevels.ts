import { GetAdminAPI } from "@src/AdminAPI";
import {
  useConnectedInfiniteQuery,
  InfiniteQueryParams,
  InfiniteQueryOptions,
} from "../useConnectedInfiniteQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { SponsorshipLevel } from "@src/interfaces";
import { SPONSORSHIP_QUERY_KEY } from "./useGetSponsorship";
import { QueryClient } from "@tanstack/react-query";

export const SPONSORSHIP_LEVELS_QUERY_KEY = (sponsorshipId: string) => [
  ...SPONSORSHIP_QUERY_KEY(sponsorshipId),
  "LEVELS",
];

export const SET_SPONSORSHIP_LEVELS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof SPONSORSHIP_LEVELS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetSponsorshipLevels>>
) => {
  client.setQueryData(SPONSORSHIP_LEVELS_QUERY_KEY(...keyParams), response);
};

interface GetSponsorshipLevelsParams extends InfiniteQueryParams {
  sponsorshipId: string;
}

export const GetSponsorshipLevels = async ({
  sponsorshipId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetSponsorshipLevelsParams): Promise<
  ConnectedXMResponse<SponsorshipLevel[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/sponsorships/${sponsorshipId}/levels`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });

  return data;
};

const useGetSponsorshipLevels = (
  sponsorshipId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetSponsorshipLevels>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetSponsorshipLevels>>
  >(
    SPONSORSHIP_LEVELS_QUERY_KEY(sponsorshipId),
    (params: InfiniteQueryParams) =>
      GetSponsorshipLevels({ ...params, sponsorshipId }),
    params,
    {
      ...options,
      enabled: !!sponsorshipId && (options.enabled ?? true),
    }
  );
};

export default useGetSponsorshipLevels;
