import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { Registration } from "@src/interfaces";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../useConnectedSingleQuery";
import { EVENT_QUERY_KEY } from "../useGetEvent";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_ACCOUNT_REGISTRATION_QUERY_KEY = (
  eventId: string,
  accountId: string
) => [...EVENT_QUERY_KEY(eventId), "REGISTRATION", accountId];

/**
 * @category Setters
 * @group Events
 */
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

interface GetEventAccountRegistrationProps extends SingleQueryParams {
  eventId: string;
  accountId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventAccountRegistration = async ({
  eventId,
  accountId,
  adminApiParams,
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
/**
 * @category Hooks
 * @group Events
 */
export const useGetEventAccountRegistration = (
  eventId: string = "",
  accountId: string = "",
  options: SingleQueryOptions<
    ReturnType<typeof GetEventAccountRegistration>
  > = {}
) => {
  return useConnectedSingleQuery<
    ReturnType<typeof GetEventAccountRegistration>
  >(
    EVENT_ACCOUNT_REGISTRATION_QUERY_KEY(eventId, accountId),
    (params: SingleQueryParams) =>
      GetEventAccountRegistration({ eventId, accountId, ...params }),
    {
      ...options,
      enabled: !!eventId && !!accountId && (options?.enabled ?? true),
      retry: false,
    }
  );
};
