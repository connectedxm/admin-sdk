import { GetAdminAPI } from "@src/AdminAPI";
import {
  ChannelContentGuestTranslation,
  ConnectedXMResponse,
} from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";
import { CHANNEL_CONTENT_GUEST_QUERY_KEY } from "../useGetChannelContentGuest";

/**
 * @category Keys
 * @group Channels
 */
export const CHANNEL_CONTENT_GUEST_TRANSLATIONS_QUERY_KEY = (
  channelId: string,
  contentId: string,
  guestId: string
) => [
  ...CHANNEL_CONTENT_GUEST_QUERY_KEY(channelId, contentId, guestId),
  "TRANSLATIONS",
];

/**
 * @category Setters
 * @group Channels
 */
export const SET_CHANNEL_CONTENT_GUEST_TRANSLATIONS_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof CHANNEL_CONTENT_GUEST_TRANSLATIONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetChannelContentGuestTranslations>>
) => {
  client.setQueryData(
    CHANNEL_CONTENT_GUEST_TRANSLATIONS_QUERY_KEY(...keyParams),
    response
  );
};

interface GetChannelContentGuestTranslationsProps extends InfiniteQueryParams {
  channelId: string;
  contentId: string;
  guestId: string;
}

/**
 * @category Queries
 * @group Channels
 */
export const GetChannelContentGuestTranslations = async ({
  channelId,
  contentId,
  guestId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetChannelContentGuestTranslationsProps): Promise<
  ConnectedXMResponse<ChannelContentGuestTranslation[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/channels/${channelId}/contents/${contentId}/guests/${guestId}/translations`,
    {
      params: {
        page: pageParam || undefined,
        pageSize: pageSize || undefined,
        orderBy: orderBy || undefined,
        search: search || undefined,
      },
    }
  );
  return data;
};
/**
 * @category Hooks
 * @group Channels
 */
export const useGetChannelContentGuestTranslations = (
  channelId: string = "",
  contentId: string = "",
  guestId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetChannelContentGuestTranslations>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetChannelContentGuestTranslations>>
  >(
    CHANNEL_CONTENT_GUEST_TRANSLATIONS_QUERY_KEY(channelId, contentId, guestId),
    (params: InfiniteQueryParams) =>
      GetChannelContentGuestTranslations({
        ...params,
        channelId,
        contentId,
        guestId,
      }),
    params,
    {
      ...options,
      enabled:
        !!contentId && !!channelId && !!guestId && (options?.enabled ?? true),
    }
  );
};
