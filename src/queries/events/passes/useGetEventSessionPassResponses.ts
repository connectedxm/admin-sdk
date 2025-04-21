import {
  ConnectedXMResponse,
  EventSessionQuestionResponse,
} from "@src/interfaces";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../useConnectedSingleQuery";
import { GetAdminAPI } from "@src/AdminAPI";
import { EVENT_SESSION_PASS_QUERY_KEY } from "./useGetEventSessionPass";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_SESSION_PASS_RESPONSES_QUERY_KEY = (
  eventId: string,
  sessionPassId: string
) => [...EVENT_SESSION_PASS_QUERY_KEY(eventId, sessionPassId), "RESPONSES"];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_SESSION_PASS_RESPONSES_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_SESSION_PASS_RESPONSES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventSessionPassResponses>>
) => {
  client.setQueryData(
    EVENT_SESSION_PASS_RESPONSES_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventSessionPassResponsesProps extends SingleQueryParams {
  eventId: string;
  sessionPassId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventSessionPassResponses = async ({
  eventId,
  sessionPassId,
  adminApiParams,
}: GetEventSessionPassResponsesProps): Promise<
  ConnectedXMResponse<EventSessionQuestionResponse[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/sessionPasses/${sessionPassId}/responses`
  );
  return data;
};

/**
 * @category Hooks
 * @group Events
 */
export const useGetEventSessionPassResponses = (
  eventId: string = "",
  sessionPassId: string = "",
  options: SingleQueryOptions<
    ReturnType<typeof GetEventSessionPassResponses>
  > = {}
) => {
  return useConnectedSingleQuery<
    ReturnType<typeof GetEventSessionPassResponses>
  >(
    EVENT_SESSION_PASS_RESPONSES_QUERY_KEY(eventId, sessionPassId),
    (params: SingleQueryParams) =>
      GetEventSessionPassResponses({
        eventId,
        sessionPassId,
        ...params,
      }),
    {
      ...options,
      enabled: !!eventId && !!sessionPassId && (options?.enabled ?? true),
    },
    "events"
  );
};
