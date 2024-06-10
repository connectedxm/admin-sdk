import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../useConnectedSingleQuery";
import { EVENT_QUERY_KEY } from "../useGetEvent";

export const EVENT_REGISTRATION_COUNTS_QUERY_KEY = (eventId: string) => [
  ...EVENT_QUERY_KEY(eventId),
  "REGISTRATION_COUNTS",
];

export const SET_EVENT_REGISTRATION_COUNTS_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_REGISTRATION_COUNTS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventRegistrationCounts>>
) => {
  client.setQueryData(
    EVENT_REGISTRATION_COUNTS_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventRegistrationCountsProps extends SingleQueryParams {
  eventId: string;
}

export const GetEventRegistrationCounts = async ({
  eventId,
  adminApiParams,
}: GetEventRegistrationCountsProps): Promise<ConnectedXMResponse<any>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/registrations/counts`
  );
  return data;
};

const useGetEventRegistrationCounts = (
  eventId: string = "",
  options: SingleQueryOptions<
    ReturnType<typeof GetEventRegistrationCounts>
  > = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventRegistrationCounts>>(
    EVENT_REGISTRATION_COUNTS_QUERY_KEY(eventId),
    (params: SingleQueryParams) =>
      GetEventRegistrationCounts({ eventId, ...params }),
    {
      ...options,
      enabled: !!eventId && (options?.enabled ?? true),
    }
  );
};

export default useGetEventRegistrationCounts;
