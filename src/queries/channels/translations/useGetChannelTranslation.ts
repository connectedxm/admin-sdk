import { ConnectedXMResponse } from "@src/interfaces";
import { ChannelTranslation } from "@src/interfaces";
import { CHANNEL_TRANSLATIONS_QUERY_KEY } from "./useGetChannelTranslations";
import { GetAdminAPI } from "@src/AdminAPI";
import {
  useConnectedSingleQuery,
  SingleQueryOptions,
  SingleQueryParams,
} from "@src/queries/useConnectedSingleQuery";

/**
 * Retrieves the translation for a specific channel and locale.
 * This function is used to fetch the translation data for a given channel ID and locale, 
 * allowing applications to display localized content for channels.
 * @name GetChannelTranslation
 * @param {string} channelId (path) - The ID of the channel
 * @param {string} locale (path) - The locale for the translation
 * @version 1.3
 */
export const CHANNEL_TRANSLATION_QUERY_KEY = (
  channelId: string,
  locale: string
) => [...CHANNEL_TRANSLATIONS_QUERY_KEY(channelId), locale];

/**
 * @category Setters
 * @group Channels
 */
export const SET_CHANNEL_TRANSLATION_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof CHANNEL_TRANSLATION_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetChannelTranslation>>
) => {
  client.setQueryData(CHANNEL_TRANSLATION_QUERY_KEY(...keyParams), response);
};

interface GetChannelTranslationProps extends SingleQueryParams {
  channelId: string;
  locale: string;
}

/**
 * @category Queries
 * @group Channels
 */
export const GetChannelTranslation = async ({
  channelId,
  locale,
  adminApiParams,
}: GetChannelTranslationProps): Promise<
  ConnectedXMResponse<ChannelTranslation | null>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/channels/${channelId}/translations/${locale}`
  );
  return data;
};

/**
 * @category Hooks
 * @group Channels
 */
export const useGetChannelTranslation = (
  channelId: string = "",
  locale: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetChannelTranslation>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetChannelTranslation>>(
    CHANNEL_TRANSLATION_QUERY_KEY(channelId, locale),
    (params: SingleQueryParams) =>
      GetChannelTranslation({
        channelId,
        locale,
        ...params,
      }),
    {
      ...options,
      enabled: !!channelId && !!locale && locale !== "en",
    },
    "channels"
  );
};