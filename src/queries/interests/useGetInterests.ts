import { ConnectedXMResponse } from "@src/interfaces";
import { Interest } from "@src/interfaces";
import {
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { QueryClient } from "@tanstack/react-query";

export const INTERESTS_QUERY_KEY = () => ["INTERESTS"];

export const SET_INTERESTS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof INTERESTS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetInterests>>
) => {
  client.setQueryData(INTERESTS_QUERY_KEY(...keyParams), response);
};

interface GetInterestsProps extends InfiniteQueryParams {}

export const GetInterests = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
}: GetInterestsProps): Promise<ConnectedXMResponse<Interest[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/interests`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });
  return data;
};

const useGetInterests = () => {
  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetInterests>>>(
    INTERESTS_QUERY_KEY(),
    (params: any) => GetInterests(params),
    {},
    {}
  );
};

export default useGetInterests;
