import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";

import { Account } from "@src/interfaces";
import {
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { QueryClient } from "@tanstack/react-query";
import { CONTENT_TYPE_CONTENT_QUERY_KEY } from "./useGetContentTypeContent";

export const CONTENT_TYPE_CONTENT_AUTHORS_QUERY_KEY = (
  contentTypeId: string,
  contentId: string
) => [...CONTENT_TYPE_CONTENT_QUERY_KEY(contentTypeId, contentId), "AUTHORS"];

export const SET_CONTENT_TYPE_CONTENT_AUTHORS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof CONTENT_TYPE_CONTENT_AUTHORS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetContentTypeContentAuthors>>
) => {
  client.setQueryData(
    CONTENT_TYPE_CONTENT_AUTHORS_QUERY_KEY(...keyParams),
    response
  );
};

interface GetContentTypeContentAuthorsProps extends InfiniteQueryParams {
  contentId: string;
  status?: string;
}

export const GetContentTypeContentAuthors = async ({
  contentId,
  pageParam,
  pageSize,
  orderBy,
  search,
}: GetContentTypeContentAuthorsProps): Promise<
  ConnectedXMResponse<Account[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/contents/${contentId}/authors`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });
  return data;
};

const useGetContentTypeContentAuthors = (
  contentTypeId: string,
  contentId: string
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetContentTypeContentAuthors>>
  >(
    CONTENT_TYPE_CONTENT_AUTHORS_QUERY_KEY(contentTypeId, contentId),
    (params: any) => GetContentTypeContentAuthors(params),
    {
      contentTypeId,
      contentId,
    },
    {
      enabled: !!contentTypeId && !!contentId,
    }
  );
};

export default useGetContentTypeContentAuthors;
