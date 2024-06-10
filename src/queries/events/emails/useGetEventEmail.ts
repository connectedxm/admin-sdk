import useConnectedSingleQuery from "@src/queries/useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { EventEmail, EventEmailType } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";
import { EVENT_QUERY_KEY } from "../useGetEvent";

export const EVENT_EMAIL_QUERY_KEY = (
  eventId: string,
  type: EventEmailType
) => [...EVENT_QUERY_KEY(eventId), "EVENT_EMAIL", type];

export const SET_EVENT_EMAIL_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_EMAIL_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventEmail>>
) => {
  client.setQueryData(EVENT_EMAIL_QUERY_KEY(...keyParams), response);
};

interface GetEventEmailProps {
  eventId: string;
  type: EventEmailType;
}

export const GetEventEmail = async ({
  eventId,
  type,
}: GetEventEmailProps): Promise<ConnectedXMResponse<EventEmail>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/events/${eventId}/emails/${type}`);
  return data;
};

const useGetEventEmail = (eventId: string, type: EventEmailType) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventEmail>>(
    EVENT_EMAIL_QUERY_KEY(eventId, type),
    () => GetEventEmail({ type, eventId }),
    {
      enabled: !!type,
    }
  );
};

export default useGetEventEmail;
