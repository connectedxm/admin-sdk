import { ConnectedXMResponse } from "@src/interfaces";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../useConnectedSingleQuery";
import { RegistrationQuestionResponse } from "@src/interfaces";
import { EVENT_PASS_RESPONSES_QUERY_KEY } from "./useGetEventPassResponses";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * Retrieves a specific response for a question associated with an event's pass.
 * This function is designed to fetch detailed information about a particular response to a question linked to an event pass.
 * It is useful in scenarios where precise data about event pass responses is required.
 * @name GetEventPassResponse
 * @param {string} eventId (path) - The id of the event
 * @param {string} passId (path) - The id of the pass
 * @param {string} questionId (path) - The id of the question
 * @version 1.3
 **/

export const EVENT_PASS_RESPONSE_QUERY_KEY = (
  eventId: string,
  passId: string,
  questionId: string
) => [...EVENT_PASS_RESPONSES_QUERY_KEY(eventId, passId), questionId];

export const SET_EVENT_PASS_RESPONSE_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_PASS_RESPONSE_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventPassResponse>>
) => {
  client.setQueryData(EVENT_PASS_RESPONSE_QUERY_KEY(...keyParams), response);
};

interface GetEventPassResponseProps extends SingleQueryParams {
  eventId: string;
  passId: string;
  questionId: string;
}

export const GetEventPassResponse = async ({
  eventId,
  passId,
  questionId,
  adminApiParams,
}: GetEventPassResponseProps): Promise<
  ConnectedXMResponse<RegistrationQuestionResponse>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/passes/${passId}/responses/${questionId}`
  );
  return data;
};

export const useGetEventPassResponse = (
  eventId: string = "",
  passId: string = "",
  questionId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetEventPassResponse>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventPassResponse>>(
    EVENT_PASS_RESPONSE_QUERY_KEY(eventId, passId, questionId),
    (params: SingleQueryParams) =>
      GetEventPassResponse({
        eventId,
        passId,
        questionId,
        ...params,
      }),
    {
      ...options,
      enabled: !!eventId && !!questionId && !!passId,
    },
    "events"
  );
};