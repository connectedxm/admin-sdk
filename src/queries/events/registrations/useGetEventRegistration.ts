import { ConnectedXMResponse } from "@src/interfaces";
import { Registration } from "@src/interfaces";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../useConnectedSingleQuery";
import { EVENT_REGISTRATIONS_QUERY_KEY } from "./useGetEventRegistrations";
import { GetAdminAPI } from "@src/AdminAPI";

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

interface GetEventRegistrationProps extends SingleQueryParams {
  eventId: string;
  registrationId: string;
}

export const GetEventRegistration = async ({
  eventId,
  registrationId,
  adminApiParams,
}: GetEventRegistrationProps): Promise<ConnectedXMResponse<Registration>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/registrations/${registrationId}`
  );
  return data;
};
export const useGetEventRegistration = (
  eventId: string,
  registrationId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetEventRegistration>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventRegistration>>(
    EVENT_REGISTRATION_QUERY_KEY(eventId, registrationId),
    (params: SingleQueryParams) =>
      GetEventRegistration({ eventId, registrationId, ...params }),
    {
      ...options,
      enabled: !!eventId && !!registrationId && (options?.enabled ?? true),
    }
  );
};
