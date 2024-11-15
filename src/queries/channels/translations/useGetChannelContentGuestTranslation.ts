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
 * @category Keys
 * @group Channels
 */
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
