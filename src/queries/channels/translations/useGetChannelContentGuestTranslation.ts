import {
  ChannelContentGuestTranslation,
  ConnectedXMResponse,
} from "@src/interfaces";
import { GetAdminAPI } from "@src/AdminAPI";
import {
  useConnectedSingleQuery,
  SingleQueryOptions,
  SingleQueryParams,
} from "@src/queries/useConnectedSingleQuery";
import { CHANNEL_CONTENT_GUEST_TRANSLATIONS_QUERY_KEY } from "./useGetChannelContentGuestTranslations";

/**
 * Retrieves a specific guest translation for channel content based on the provided identifiers.
 * This function is used to fetch the translation of content for a guest in a specific locale within a channel.
 * It is useful in scenarios where content needs to be displayed in different languages for different guests.
 * @name GetChannelContentGuestTranslation
 * @param {string} channelId (path) The ID of the channel
 * @param {string} contentId (path) The ID of the content
 * @param {string} guestId (path) The ID of the guest
 * @param {string} locale (path) The locale for the translation
 * @version 1.3
 **/

export const CHANNEL_CONTENT_GUEST_TRANSLATION_QUERY_KEY = (
  channelId: string,
  contentId: string,
  guestId: string,
  locale: string
) => [
  ...CHANNEL_CONTENT_GUEST_TRANSLATIONS_QUERY_KEY(
    channelId,
    contentId,
    guestId
  ),
  locale,
];

/**
 * @category Setters
 * @group Channels
 */
export const SET_CHANNEL_CONTENT_GUEST_TRANSLATION_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof CHANNEL_CONTENT_GUEST_TRANSLATION_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetChannelContentGuestTranslation>>
) => {
  client.setQueryData(
    CHANNEL_CONTENT_GUEST_TRANSLATION_QUERY_KEY(...keyParams),
    response
  );
};

interface GetChannelContentGuestTranslationProps extends SingleQueryParams {
  channelId: string;
  contentId: string;
  guestId: string;
  locale: string;
}

/**
 * @category Queries
 * @group Channels
 */
export const GetChannelContentGuestTranslation = async ({
  channelId,
  contentId,
  guestId,
  locale,
  adminApiParams,
}: GetChannelContentGuestTranslationProps): Promise<
  ConnectedXMResponse<ChannelContentGuestTranslation | null>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/channels/${channelId}/contents/${contentId}/guests/${guestId}/translations/${locale}`
  );
  return data;
};
/**
 * @category Hooks
 * @group Channels
 */
export const useGetChannelContentGuestTranslation = (
  channelId: string = "",
  contentId: string = "",
  guestId: string = "",
  locale: string = "",
  options: SingleQueryOptions<
    ReturnType<typeof GetChannelContentGuestTranslation>
  > = {}
) => {
  return useConnectedSingleQuery<
    ReturnType<typeof GetChannelContentGuestTranslation>
  >(
    CHANNEL_CONTENT_GUEST_TRANSLATION_QUERY_KEY(
      channelId,
      contentId,
      guestId,
      locale
    ),
    (params: SingleQueryParams) =>
      GetChannelContentGuestTranslation({
        ...params,
        channelId,
        contentId,
        guestId,
        locale,
      }),
    {
      ...options,
      enabled:
        !!channelId &&
        !!contentId &&
        !!locale &&
        !!guestId &&
        locale !== "en" &&
        (options?.enabled ?? true),
    },
    "channels"
  );
};
