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
  channelId: string;
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
  channelId,
  contentId,
  adminApiParams,
}: GetChannelContentTranslationsProps): Promise<
  ConnectedXMResponse<ChannelContentTranslation[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/channels/${channelId}/contents/${contentId}/translations`,
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
        channelId,
        contentId,
      }),
    params,
    {
      ...options,
      enabled: !!channelId && !!contentId && (options.enabled ?? true),
    }
  );
};
