import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { EventMediaItemTranslation } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../../useConnectedInfiniteQuery";
import { EVENT_MEDIA_ITEM_QUERY_KEY } from "../useGetEventMediaItem";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_MEDIA_ITEM_TRANSLATIONS_QUERY_KEY = (
  eventId: string,
  mediaId: string
) => [...EVENT_MEDIA_ITEM_QUERY_KEY(eventId, mediaId), "TRANSLATIONS"];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_MEDIA_ITEM_TRANSLATIONS_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_MEDIA_ITEM_TRANSLATIONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventMediaItemTranslations>>
) => {
  client.setQueryData(
    EVENT_MEDIA_ITEM_TRANSLATIONS_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventMediaItemTranslationsProps extends InfiniteQueryParams {
  eventId: string;
  mediaId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventMediaItemTranslations = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  eventId,
  mediaId,
  adminApiParams,
}: GetEventMediaItemTranslationsProps): Promise<
  ConnectedXMResponse<EventMediaItemTranslation[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/media/${mediaId}/translations`,
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
 * @group Events
 */
export const useGetEventMediaItemTranslations = (
  eventId: string = "",
  mediaId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventMediaItemTranslations>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventMediaItemTranslations>>
  >(
    EVENT_MEDIA_ITEM_TRANSLATIONS_QUERY_KEY(eventId, mediaId),
    (params: InfiniteQueryParams) =>
      GetEventMediaItemTranslations({
        ...params,
        eventId,
        mediaId,
      }),
    params,
    {
      ...options,
      enabled: !!eventId && !!mediaId && (options.enabled ?? true),
    }
  );
};
