import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { ChannelTranslation } from "@src/interfaces";
import { CHANNEL_QUERY_KEY } from "../useGetChannel";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "@src/queries/useConnectedInfiniteQuery";

/**
 * Retrieves translations for a specific channel by its ID.
 * This function is designed to fetch a list of translations associated with a given channel, 
 * allowing applications to display or manage channel-specific translations.
 * It supports infinite scrolling through pagination parameters.
 * @name GetChannelTranslations
 * @param {string} channelId - The ID of the channel
 * @version 1.2
 **/

/**
 * @category Keys
 * @group Channels
 */
export const CHANNEL_TRANSLATIONS_QUERY_KEY = (channelId: string) => [
  ...CHANNEL_QUERY_KEY(channelId),
  "TRANSLATIONS",
];

/**
 * @category Setters
 * @group Channels
 */
export const SET_CHANNEL_TRANSLATIONS_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof CHANNEL_TRANSLATIONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetChannelTranslations>>
) => {
  client.setQueryData(CHANNEL_TRANSLATIONS_QUERY_KEY(...keyParams), response);
};

interface GetChannelTranslationsProps extends InfiniteQueryParams {
  channelId: string;
}

/**
 * @category Queries
 * @group Channels
 */
export const GetChannelTranslations = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  channelId,
  adminApiParams,
}: GetChannelTranslationsProps): Promise<
  ConnectedXMResponse<ChannelTranslation[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/channels/${channelId}/translations`, {
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
export const useGetChannelTranslations = (
  channelId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetChannelTranslations>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetChannelTranslations>>
  >(
    CHANNEL_TRANSLATIONS_QUERY_KEY(channelId),
    (params: InfiniteQueryParams) =>
      GetChannelTranslations({
        channelId,
        ...params,
      }),
    params,
    {
      ...options,
      enabled: !!channelId,
    },
    "channels"
  );
};