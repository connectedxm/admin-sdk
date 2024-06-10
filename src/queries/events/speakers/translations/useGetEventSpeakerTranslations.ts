import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { SpeakerTranslation } from "@src/interfaces";
import useConnectedInfiniteQuery, {
  InfiniteQueryParams,
} from "@/context/queries/useConnectedInfiniteQuery";
import { EVENT_SPEAKER_QUERY_KEY } from "../useGetEventSpeaker";

export const EVENT_SPEAKER_TRANSLATIONS_QUERY_KEY = (
  eventId: string,
  speakerId: string
) => [...EVENT_SPEAKER_QUERY_KEY(eventId, speakerId), "TRANSLATIONS"];

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

export const GetEventSpeakerTranslations = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  eventId,
  speakerId,
}: GetEventSpeakerTranslationsProps): Promise<
  ConnectedXMResponse<SpeakerTranslation[]>
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

const useGetEventSpeakerTranslations = (eventId: string, speakerId: string) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventSpeakerTranslations>>
  >(
    EVENT_SPEAKER_TRANSLATIONS_QUERY_KEY(eventId, speakerId),
    (params: any) => GetEventSpeakerTranslations(params),
    {
      eventId,
      speakerId,
    },
    {
      enabled: !!eventId,
    }
  );
};

export default useGetEventSpeakerTranslations;
