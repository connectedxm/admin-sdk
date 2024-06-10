import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";

import { Content } from "@src/interfaces";
import {
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { CONTENT_TYPE_QUERY_KEY } from "./useGetContentType";
import { QueryClient } from "@tanstack/react-query";

export const CONTENT_TYPE_CONTENTS_QUERY_KEY = (
  contentTypeId: string,
  status?: string
) => {
  let keys = [...CONTENT_TYPE_QUERY_KEY(contentTypeId), "CONTENTS"];
  if (status) keys.push(status);
  return keys;
};

export const SET_CONTENT_TYPE_CONTENTS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof CONTENT_TYPE_CONTENTS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetContentTypeContents>>
) => {
  client.setQueryData(CONTENT_TYPE_CONTENTS_QUERY_KEY(...keyParams), response);
};

interface GetContentTypeContentsProps extends InfiniteQueryParams {
  contentTypeId: string;
  status?: string;
}

export const GetContentTypeContents = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  contentTypeId,
  status,
}: GetContentTypeContentsProps): Promise<ConnectedXMResponse<Content[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/contentTypes/${contentTypeId}/contents`,
    {
      params: {
        page: pageParam || undefined,
        pageSize: pageSize || undefined,
        orderBy: orderBy || undefined,
        search: search || undefined,
        status: status || undefined,
      },
    }
  );
  return data;
};

const useGetContentTypeContents = (contentTypeId: string, status?: string) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetContentTypeContents>>
  >(
    CONTENT_TYPE_CONTENTS_QUERY_KEY(contentTypeId, status),
    (params: any) => GetContentTypeContents(params),
    {
      contentTypeId,
      status,
    },
    {
      enabled: !!contentTypeId,
    }
  );
};

export default useGetContentTypeContents;
