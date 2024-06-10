import {
  useConnectedInfiniteQuery,
  InfiniteQueryParams,
} from "../useConnectedInfiniteQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { Sponsorship } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";

export const SPONSORSHIPS_QUERY_KEY = () => ["SPONSORSHIPS"];

export const SET_SPONSORSHIPS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof SPONSORSHIPS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetSponsorships>>
) => {
  client.setQueryData(SPONSORSHIPS_QUERY_KEY(...keyParams), response);
};

interface GetSponsorshipsParams extends InfiniteQueryParams {}

export const GetSponsorships = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
}: GetSponsorshipsParams): Promise<ConnectedXMResponse<Sponsorship[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/sponsorships`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });

  return data;
};

const useGetSponsorships = () => {
  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetSponsorships>>>(
    SPONSORSHIPS_QUERY_KEY(),
    (params: any) => GetSponsorships(params),
    {},
    {}
  );
};

export default useGetSponsorships;
