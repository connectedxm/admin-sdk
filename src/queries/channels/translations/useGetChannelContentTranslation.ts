import { ConnectedXMResponse } from "@src/interfaces";
import { ChannelContentTranslation } from "@src/interfaces";
import { CHANNEL_CONTENT_TRANSLATIONS_QUERY_KEY } from "./useGetChannelContentTranslations";
import { GetAdminAPI } from "@src/AdminAPI";
import {
  useConnectedSingleQuery,
  SingleQueryOptions,
  SingleQueryParams,
} from "@src/queries/useConnectedSingleQuery";

/**
 * Fetches a specific translation of channel content by its content ID and locale.
 * This function is used to retrieve the translated content for a given channel, identified by content ID and locale.
 * It is designed for applications that need to display content in multiple languages.
 * @name GetChannelContentTranslation
 * @param {string} contentId (path) The ID of the content
 * @param {string} locale (path) The locale of the translation
 * @version 1.3
 **/

export const CHANNEL_CONTENT_TRANSLATION_QUERY_KEY = (
  channelId: string,
  contentId: string,
  locale: string
) => [...CHANNEL_CONTENT_TRANSLATIONS_QUERY_KEY(channelId, contentId), locale];

/**
 * @category Setters
 * @group Channels
 */
export const SET_CHANNEL_CONTENT_TRANSLATION_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof CHANNEL_CONTENT_TRANSLATION_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetChannelContentTranslation>>
) => {
  client.setQueryData(
    CHANNEL_CONTENT_TRANSLATION_QUERY_KEY(...keyParams),
    response
  );
};

interface GetChannelContentTranslationProps extends SingleQueryParams {
  contentId: string;
  locale: string;
}

/**
 * @category Queries
 * @group Channels
 */
export const GetChannelContentTranslation = async ({
  contentId,
  locale,
  adminApiParams,
}: GetChannelContentTranslationProps): Promise<
  ConnectedXMResponse<ChannelContentTranslation | null>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/contents/${contentId}/translations/${locale}`
  );
  return data;
};

/**
 * @category Hooks
 * @group Channels
 */
export const useGetChannelContentTranslation = (
  channelId: string = "",
  contentId: string = "",
  locale: string = "",
  options: SingleQueryOptions<
    ReturnType<typeof GetChannelContentTranslation>
  > = {}
) => {
  return useConnectedSingleQuery<
    ReturnType<typeof GetChannelContentTranslation>
  >(
    CHANNEL_CONTENT_TRANSLATION_QUERY_KEY(channelId, contentId, locale),
    (params: SingleQueryParams) =>
      GetChannelContentTranslation({
        ...params,
        contentId,
        locale,
      }),
    {
      ...options,
      enabled: !!channelId && !!contentId && !!locale && locale !== "en",
    },
    "channels"
  );
};
