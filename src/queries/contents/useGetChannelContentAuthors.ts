import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";

import { Account } from "@src/interfaces";
import {
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { QueryClient } from "@tanstack/react-query";
import { CHANNEL_CONTENT_QUERY_KEY } from "./useGetChannelContent";

export const CHANNEL_CONTENT_AUTHORS_QUERY_KEY = (
  channelId: string,
  contentId: string
) => [...CHANNEL_CONTENT_QUERY_KEY(channelId, contentId), "AUTHORS"];

export const SET_CHANNEL_CONTENT_AUTHORS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof CHANNEL_CONTENT_AUTHORS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetChannelContentAuthors>>
) => {
  client.setQueryData(
    CHANNEL_CONTENT_AUTHORS_QUERY_KEY(...keyParams),
    response
  );
};

interface GetChannelContentAuthorsProps extends InfiniteQueryParams {
  contentId: string;
  status?: string;
}

export const GetChannelContentAuthors = async ({
  contentId,
  pageParam,
  pageSize,
  orderBy,
  search,
}: GetChannelContentAuthorsProps): Promise<ConnectedXMResponse<Account[]>> => {
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

const useGetChannelContentAuthors = (channelId: string, contentId: string) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetChannelContentAuthors>>
  >(
    CHANNEL_CONTENT_AUTHORS_QUERY_KEY(channelId, contentId),
    (params: any) => GetChannelContentAuthors(params),
    {
      channelId,
      contentId,
    },
    {
      enabled: !!channelId && !!contentId,
    }
  );
};

export default useGetChannelContentAuthors;
