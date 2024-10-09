import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { ChannelContent } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";
import { CHANNEL_CONTENTS_QUERY_KEY } from "./useGetChannelContents";

/**
 * @category Keys
 * @group Channels
 */
export const CHANNEL_CONTENT_QUERY_KEY = (
  channelId: string,
  contentId: string
) => [...CHANNEL_CONTENTS_QUERY_KEY(channelId), contentId];

/**
 * @category Setters
 * @group Channels
 */
export const SET_CHANNEL_CONTENT_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof CHANNEL_CONTENT_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetChannelContent>>
) => {
  client.setQueryData(CHANNEL_CONTENT_QUERY_KEY(...keyParams), response);
};

interface GetChannelContentProps extends SingleQueryParams {
  channelId: string;
  contentId: string;
}

/**
 * @category Queries
 * @group Channels
 */
export const GetChannelContent = async ({
  channelId,
  contentId,
  adminApiParams,
}: GetChannelContentProps): Promise<ConnectedXMResponse<ChannelContent>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/channels/${channelId}/contents/${contentId}`
  );
  return data;
};
/**
 * @category Hooks
 * @group Channels
 */
export const useGetChannelContent = (
  channelId: string = "",
  contentId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetChannelContent>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetChannelContent>>(
    CHANNEL_CONTENT_QUERY_KEY(channelId, contentId),
    (params: SingleQueryParams) =>
      GetChannelContent({ channelId, contentId, ...params }),
    {
      ...options,
      enabled: !!channelId && !!contentId && (options?.enabled ?? true),
    },
    "contents"
  );
};
