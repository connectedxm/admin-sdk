import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";

import { ContentType } from "@src/interfaces";
import {
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { QueryClient } from "@tanstack/react-query";

export const CONTENT_TYPES_QUERY_KEY = () => ["CONTENT_TYPES"];

export const SET_CONTENT_TYPES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof CONTENT_TYPES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetContentTypes>>
) => {
  client.setQueryData(CONTENT_TYPES_QUERY_KEY(...keyParams), response);
};

interface GetContentTypesProps extends InfiniteQueryParams {}

export const GetContentTypes = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
}: GetContentTypesProps): Promise<ConnectedXMResponse<ContentType[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/contentTypes`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });
  return data;
};

const useGetContentTypes = () => {
  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetContentTypes>>>(
    CONTENT_TYPES_QUERY_KEY(),
    (params: any) => GetContentTypes(params),
    {},
    {}
  );
};

export default useGetContentTypes;
