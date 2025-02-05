import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { RegistrationQuestionResponseChange } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";
import { EVENT_PASS_RESPONSE_QUERY_KEY } from "./useGetEventPassResponse";

/**
 * Fetches the changes made to event pass responses, providing capabilities for pagination and filtering.
 * This function is designed to retrieve a list of changes associated with a specific event pass response question.
 * It is useful for applications that need to track modifications over time for auditing or review purposes.
 * @name GetEventPassResponseChanges
 * @param {string} eventId - The id of the event
 * @param {string} passId - The id of the pass
 * @param {string} questionId - The id of the question
 * @version 1.2
 **/

export const EVENT_PASS_RESPONSE_CHANGES_QUERY_KEY = (
  eventId: string,
  passId: string,
  questionId: string
) => [...EVENT_PASS_RESPONSE_QUERY_KEY(eventId, passId, questionId), "CHANGES"];

export const SET_EVENT_PASS_RESPONSE_CHANGES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_PASS_RESPONSE_CHANGES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventPassResponseChanges>>
) => {
  client.setQueryData(
    EVENT_PASS_RESPONSE_CHANGES_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventPassResponseChangesProps extends InfiniteQueryParams {
  eventId: string;
  passId: string;
  questionId: string;
}

export const GetEventPassResponseChanges = async ({
  eventId,
  passId,
  questionId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetEventPassResponseChangesProps): Promise<
  ConnectedXMResponse<RegistrationQuestionResponseChange[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/passes/${passId}/responses/${questionId}/changes`,
    {
      params: {
        page: pageParam || undefined,
        pageSize: pageSize || undefined,
        orderBy: orderBy || undefined,
        search: search || undefined,
      },
    }
 );
  return data;
};

export const useGetEventPassResponseChanges = (
  eventId: string = "",
  passId: string = "",
  questionId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventPassResponseChanges>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventPassResponseChanges>>
  >(
    EVENT_PASS_RESPONSE_CHANGES_QUERY_KEY(eventId, passId, questionId),
    (params: InfiniteQueryParams) =>
      GetEventPassResponseChanges({
        ...params,
        eventId,
        questionId,
        passId,
      }),
    params,
    {
      ...options,
      enabled:
        !!eventId && !!questionId && !!passId && (options.enabled ?? true),
    },
    "events"
  );
};