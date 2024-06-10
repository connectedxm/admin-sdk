import { ConnectedXMResponse } from "@src/interfaces";
import { Series } from "@src/interfaces";
import {
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { QueryClient } from "@tanstack/react-query";

export const SERIES_LIST_QUERY_KEY = () => {
  let keys = ["SERIES"];
  return keys;
};

export const SET_SERIES_LIST_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof SERIES_LIST_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetSeriesList>>
) => {
  client.setQueryData(SERIES_LIST_QUERY_KEY(...keyParams), response);
};

interface GetSeriesListProps extends InfiniteQueryParams {
  past: boolean;
}

export const GetSeriesList = async ({
  pageParam,
  pageSize,
  orderBy,
  past,
  search,
}: GetSeriesListProps): Promise<ConnectedXMResponse<Series[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/series`, {
    params: {
      past: past || undefined,
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });

  return data;
};

const useGetSeriesList = () => {
  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetSeriesList>>>(
    SERIES_LIST_QUERY_KEY(),
    (params: any) => GetSeriesList(params),
    {},
    {}
  );
};

export default useGetSeriesList;
