import { ConnectedXMResponse } from "@src/interfaces";
import { Registration } from "@src/interfaces";
import useConnectedSingleQuery from "@src/queries/useConnectedSingleQuery";
import { EVENT_REGISTRATIONS_QUERY_KEY } from "./useGetEventRegistrations";

export const EVENT_REGISTRATION_QUERY_KEY = (
  eventId: string,
  registrationId: string
) => [...EVENT_REGISTRATIONS_QUERY_KEY(eventId), registrationId];

export const SET_EVENT_REGISTRATION_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_REGISTRATION_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventRegistration>>
) => {
  client.setQueryData(EVENT_REGISTRATION_QUERY_KEY(...keyParams), response);
};

interface GetEventRegistrationProps {
  eventId: string;
  registrationId: string;
}

export const GetEventRegistration = async ({
  eventId,
  registrationId,
}: GetEventRegistrationProps): Promise<ConnectedXMResponse<Registration>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/registrations/${registrationId}`
  );
  return data;
};

const useGetEventRegistration = (
  eventId: string,
  registrationId: string = ""
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventRegistration>>((
    EVENT_REGISTRATION_QUERY_KEY(eventId, registrationId),
    () => GetEventRegistration({ eventId, registrationId }),
    {
      enabled: !!eventId && !!registrationId,
    }
  );
};

export default useGetEventRegistration;
