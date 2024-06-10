import { GetAdminAPI } from '@src/AdminAPI';
import { ConnectedXMResponse } from "@src/interfaces";
import { Registration } from "@src/interfaces";
import useConnectedSingleQuery from "@src/queries/useConnectedSingleQuery";
import { EVENT_QUERY_KEY } from "../useGetEvent";

export const EVENT_ACCOUNT_REGISTRATION_QUERY_KEY = (
  eventId: string,
  accountId: string
) => [...EVENT_QUERY_KEY(eventId), "REGISTRATION", accountId];

export const SET_EVENT_ACCOUNT_REGISTRATION_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_ACCOUNT_REGISTRATION_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventAccountRegistration>>
) => {
  client.setQueryData(
    EVENT_ACCOUNT_REGISTRATION_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventAccountRegistrationProps {
  eventId: string;
  accountId: string;
}

export const GetEventAccountRegistration = async ({
  eventId,
  accountId,
}: GetEventAccountRegistrationProps): Promise<
  ConnectedXMResponse<Registration>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/registrations/account`,
    { params: { accountId } }
  );
  return data;
};

const useGetEventAccountRegistration = (eventId: string, accountId: string) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventAccountRegistration>>((
    EVENT_ACCOUNT_REGISTRATION_QUERY_KEY(eventId, accountId),
    () => GetEventAccountRegistration({ eventId, accountId }),
    {
      enabled: !!eventId && !!accountId,
      retry: false,
    }
  );
};

export default useGetEventAccountRegistration;
