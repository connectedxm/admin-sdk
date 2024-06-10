import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { Speaker } from "@src/interfaces";
import { EVENT_SPEAKERS_QUERY_KEY } from "./useGetEventSpeakers";
import { GetAdminAPI } from "@src/AdminAPI";

export const EVENT_SPEAKER_QUERY_KEY = (eventId: string, speakerId: string) => [
  ...EVENT_SPEAKERS_QUERY_KEY(eventId),
  speakerId,
];

export const SET_EVENT_SPEAKER_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_SPEAKER_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventSpeaker>>
) => {
  client.setQueryData(EVENT_SPEAKER_QUERY_KEY(...keyParams), response);
};

interface GetEventSpeakerProps extends SingleQueryParams {
  eventId: string;
  speakerId: string;
}

export const GetEventSpeaker = async ({
  eventId,
  speakerId,
  adminApiParams,
}: GetEventSpeakerProps): Promise<ConnectedXMResponse<Speaker>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/speakers/${speakerId}`
  );
  return data;
};

const useGetEventSpeaker = (
  eventId: string = "",
  speakerId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetEventSpeaker>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventSpeaker>>(
    EVENT_SPEAKER_QUERY_KEY(eventId, speakerId),
    (params: SingleQueryParams) =>
      GetEventSpeaker({ eventId, speakerId, ...params }),
    {
      ...options,
      enabled: !!eventId && !!speakerId,
    }
  );
};

export default useGetEventSpeaker;
