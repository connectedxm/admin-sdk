import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";

import { Sponsorship } from "@src/interfaces";
import {
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { LEVEL_QUERY_KEY } from "./useGetLevel";
import { QueryClient } from "@tanstack/react-query";

export const LEVEL_SPONSORSHIPS_QUERY_KEY = (levelId: string) => [
  ...LEVEL_QUERY_KEY(levelId),
  "SPONSORSHIPS",
];

export const SET_LEVEL_SPONSORSHIPS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof LEVEL_SPONSORSHIPS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetLevelSponsorships>>
) => {
  client.setQueryData(LEVEL_SPONSORSHIPS_QUERY_KEY(...keyParams), response);
};
interface GetLevelSponsorshipsProps extends InfiniteQueryParams {
  levelId: string;
}

export const GetLevelSponsorships = async ({
  levelId,
  pageParam,
  pageSize,
  search,
}: GetLevelSponsorshipsProps): Promise<ConnectedXMResponse<Sponsorship[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/levels/${levelId}/sponsorships`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      search: search || undefined,
    },
  });
  return data;
};

const useGetLevelSponsorships = (levelId: string) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetLevelSponsorships>>
  >(
    LEVEL_SPONSORSHIPS_QUERY_KEY(levelId),
    (params: any) => GetLevelSponsorships(params),
    {
      levelId,
    },
    {
      enabled: !!levelId,
    }
  );
};

export default useGetLevelSponsorships;
