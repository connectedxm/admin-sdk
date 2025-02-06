import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { ChannelContentTranslation } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";
import { CHANNEL_CONTENT_QUERY_KEY } from "../useGetChannelContent";

/**
 * Retrieves translations for a specific channel content by its ID.
 * This function is designed to fetch all available translations for a given content within a channel.
 * It is useful for applications that need to display or manage content in multiple languages.
 * @name GetChannelContentTranslations
 * @param {string} contentId (path) The ID of the content for which translations are being retrieved
 * @version 1.3
 **/

/**
 * @category Keys
 * @group Channels
 */
export const CHANNEL_CONTENT_TRANSLATIONS_QUERY_KEY = (
  channelId: string,
  contentId: string
) => [...CHANNEL_CONTENT_QUERY_KEY(channelId, contentId), "TRANSLATIONS"];

/**
 * @category Setters
 * @group Channels
 */
export const SET_CHANNEL_CONTENT_TRANSLATIONS_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof CHANNEL_CONTENT_TRANSLATIONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetChannelContentTranslations>>
) => {
  client.setQueryData(
    CHANNEL_CONTENT_TRANSLATIONS_QUERY_KEY(...keyParams),
    response
  );
};

interface GetChannelContentTranslationsProps extends InfiniteQueryParams {
  contentId: string;
}

/**
 * @category Queries
 * @group Channels
 */
export const GetChannelContentTranslations = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  contentId,
  adminApiParams,
}: GetChannelContentTranslationsProps): Promise<
  ConnectedXMResponse<ChannelContentTranslation[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/contents/${contentId}/translations`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });
  return data;
};

/**
 * @category Hooks
 * @group Channels
 */
export const useGetChannelContentTranslations = (
  channelId: string = "",
  contentId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetChannelContentTranslations>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetChannelContentTranslations>>
  >(
    CHANNEL_CONTENT_TRANSLATIONS_QUERY_KEY(channelId, contentId),
    (params: InfiniteQueryParams) =>
      GetChannelContentTranslations({
        ...params,
        contentId,
      }),
    params,
    {
      ...options,
      enabled: !!contentId,
    },
    "channels"
  );
};
