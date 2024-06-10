import { useConnectedSingleQuery } from "../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { Event } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";
import { EVENTS_QUERY_KEY } from "./useGetEvents";

export const EVENT_QUERY_KEY = (eventId: string) => [
  ...EVENTS_QUERY_KEY(),
  eventId,
];

export const SET_EVENT_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEvent>>
) => {
  client.setQueryData(EVENT_QUERY_KEY(...keyParams), response);
};

interface GetEventProps {
  eventId: string;
}

export const GetEvent = async ({
  eventId,
}: GetEventProps): Promise<ConnectedXMResponse<Event>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/events/${eventId}`);
  return data;
};

const useGetEvent = (eventId: string) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEvent>>(
    EVENT_QUERY_KEY(eventId),
    () => GetEvent({ eventId }),
    {
      enabled: !!eventId,
    }
  );
};

export default useGetEvent;
