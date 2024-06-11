import { GetAdminAPI } from "@src/AdminAPI";
import {
  useConnectedInfiniteQuery,
  InfiniteQueryParams,
  InfiniteQueryOptions,
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
  adminApiParams,
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

const useGetSponsorships = (
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetSponsorships>>
  > = {}
) => {
  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetSponsorships>>>(
    SPONSORSHIPS_QUERY_KEY(),
    (params: InfiniteQueryParams) => GetSponsorships(params),
    params,
    options
  );
};

export default useGetSponsorships;
