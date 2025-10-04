import { ConnectedXMResponse } from "@src/interfaces";
import { EventPass } from "@src/interfaces";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../useConnectedSingleQuery";
import { GetAdminAPI } from "@src/AdminAPI";
import { EVENT_PASSES_QUERY_KEY } from "./useGetEventPasses";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_PASS_QUERY_KEY = (eventId: string, passId: string) => [
  ...EVENT_PASSES_QUERY_KEY(eventId),
  passId,
];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_PASS_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_PASS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventPass>>
) => {
  client.setQueryData(EVENT_PASS_QUERY_KEY(...keyParams), response);
};

interface GetEventPassProps extends SingleQueryParams {
  eventId: string;
  passId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventPass = async ({
  eventId,
  passId,
  adminApiParams,
}: GetEventPassProps): Promise<ConnectedXMResponse<EventPass>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/events/${eventId}/passes/${passId}`);
  return data;
};
/**
 * @category Hooks
 * @group Events
 */
export const useGetEventPass = (
  eventId: string = "",
  passId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetEventPass>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventPass>>(
    EVENT_PASS_QUERY_KEY(eventId, passId),
    (params: SingleQueryParams) =>
      GetEventPass({
        eventId,
        passId,
        ...params,
      }),
    {
      ...options,
      enabled: !!eventId && !!passId && (options?.enabled ?? true),
    }
  );
};
