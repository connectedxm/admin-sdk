import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { Content } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";
import { CHANNEL_CONTENTS_QUERY_KEY } from "./useGetChannelContents";

export const CHANNEL_CONTENT_QUERY_KEY = (
  channelId: string,
  contentId: string
) => [...CHANNEL_CONTENTS_QUERY_KEY(channelId), contentId];

export const SET_CHANNEL_CONTENT_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof CHANNEL_CONTENT_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetChannelContent>>
) => {
  client.setQueryData(CHANNEL_CONTENT_QUERY_KEY(...keyParams), response);
};

interface GetChannelContentProps extends SingleQueryParams {
  contentId: string;
}

export const GetChannelContent = async ({
  contentId,
  adminApiParams,
}: GetChannelContentProps): Promise<ConnectedXMResponse<Content>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/contents/${contentId}`);
  return data;
};
export const useGetChannelContent = (
  channelId: string = "",
  contentId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetChannelContent>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetChannelContent>>(
    CHANNEL_CONTENT_QUERY_KEY(channelId, contentId),
    (params: SingleQueryParams) => GetChannelContent({ contentId, ...params }),
    {
      ...options,
      enabled: !!contentId && (options?.enabled ?? true),
    }
  );
};
