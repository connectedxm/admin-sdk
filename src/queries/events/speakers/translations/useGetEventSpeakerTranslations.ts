import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { EventSpeakerTranslation } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../../useConnectedInfiniteQuery";
import { EVENT_SPEAKER_QUERY_KEY } from "../useGetEventSpeaker";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_SPEAKER_TRANSLATIONS_QUERY_KEY = (
  eventId: string,
  speakerId: string
) => [...EVENT_SPEAKER_QUERY_KEY(eventId, speakerId), "TRANSLATIONS"];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_SPEAKER_TRANSLATIONS_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_SPEAKER_TRANSLATIONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventSpeakerTranslations>>
) => {
  client.setQueryData(
    EVENT_SPEAKER_TRANSLATIONS_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventSpeakerTranslationsProps extends InfiniteQueryParams {
  eventId: string;
  speakerId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventSpeakerTranslations = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  eventId,
  speakerId,
  adminApiParams,
}: GetEventSpeakerTranslationsProps): Promise<
  ConnectedXMResponse<EventSpeakerTranslation[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/speakers/${speakerId}/translations`,
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
export const useGetEventSpeakerTranslations = (
  eventId: string = "",
  speakerId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventSpeakerTranslations>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventSpeakerTranslations>>
  >(
    EVENT_SPEAKER_TRANSLATIONS_QUERY_KEY(eventId, speakerId),
    (params: InfiniteQueryParams) =>
      GetEventSpeakerTranslations({
        ...params,
        eventId,
        speakerId,
      }),
    params,
    {
      ...options,
      enabled: !!eventId && !!speakerId && (options.enabled ?? true),
    },
    "events"
  );
};
