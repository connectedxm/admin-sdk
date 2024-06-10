import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";

import { SponsorshipLevel } from "@src/interfaces";
import {
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { QueryClient } from "@tanstack/react-query";

export const LEVELS_QUERY_KEY = () => ["LEVELS"];

export const SET_LEVELS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof LEVELS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetLevels>>
) => {
  client.setQueryData(LEVELS_QUERY_KEY(...keyParams), response);
};

interface GetLevelsProps extends InfiniteQueryParams {}

export const GetLevels = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
}: GetLevelsProps): Promise<ConnectedXMResponse<SponsorshipLevel[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/levels`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });
  return data;
};

const useGetLevels = () => {
  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetLevels>>>(
    LEVELS_QUERY_KEY(),
    (params: any) => GetLevels(params),
    {},
    {}
  );
};

export default useGetLevels;
