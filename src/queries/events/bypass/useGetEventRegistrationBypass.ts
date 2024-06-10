import { GetAdminAPI } from '@src/AdminAPI';
import { useConnectedSingleQuery } from "../../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { EventRegistrationBypass } from "@src/interfaces";
import { EVENT_REGISTRATION_BYPASS_LIST_QUERY_KEY } from "./useGetEventRegistrationBypassList";
import { QueryClient } from "@tanstack/react-query";

export const EVENT_REGISTRATION_BYPASS_QUERY_KEY = (
  eventId: string,
  bypassId: number
) => [
  ...EVENT_REGISTRATION_BYPASS_LIST_QUERY_KEY(eventId),
  bypassId.toString(),
];

export const SET_EVENT_REGISTRATION_BYPASS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_REGISTRATION_BYPASS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventRegistrationBypass>>
) => {
  client.setQueryData(
    EVENT_REGISTRATION_BYPASS_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventRegistrationBypassProps {
  eventId: string;
  bypassId: number;
}

export const GetEventRegistrationBypass = async ({
  eventId,
  bypassId,
}: GetEventRegistrationBypassProps): Promise<
  ConnectedXMResponse<EventRegistrationBypass>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/events/${eventId}/bypass/${bypassId}`);
  return data;
};

const useGetEventRegistrationBypass = (eventId: string, bypassId: number) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventRegistrationBypass>>((
    EVENT_REGISTRATION_BYPASS_QUERY_KEY(eventId, bypassId),
    () => GetEventRegistrationBypass({ eventId, bypassId }),
    {
      enabled: !!eventId && !!bypassId,
    }
  );
};

export default useGetEventRegistrationBypass;
