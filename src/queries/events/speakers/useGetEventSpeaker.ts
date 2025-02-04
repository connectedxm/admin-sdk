import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { EventSpeaker } from "@src/interfaces";
import { EVENT_SPEAKERS_QUERY_KEY } from "./useGetEventSpeakers";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * Fetches details of a specific event speaker by their ID within a given event.
 * This function is designed to retrieve comprehensive information about a speaker associated with a particular event.
 * It is useful in scenarios where detailed speaker data is required for event management or display purposes.
 * @name GetEventSpeaker
 * @param {string} eventId - The ID of the event
 * @param {string} speakerId - The ID of the speaker
 * @version 1.2
**/

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
}: GetEventSpeakerProps): Promise<ConnectedXMResponse<EventSpeaker>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/speakers/${speakerId}`
  );
  return data;
};

export const useGetEventSpeaker = (
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
    },
    "events"
  );
};