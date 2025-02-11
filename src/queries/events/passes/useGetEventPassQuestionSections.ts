import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, RegistrationSection } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "@src/queries/useConnectedInfiniteQuery";
import { QueryClient } from "@tanstack/react-query";
import { EVENT_PASS_QUERY_KEY } from "./useGetEventPass";

/**
 * Retrieves the question sections associated with a specific event pass.
 * This endpoint is used to fetch detailed information about the question sections for a given event pass,
 * which is part of an attendee's registration process. It is essential for applications that need to display
 * or process the question sections related to event passes.
 * @name GetEventPassQuestionSections
 * @param {string} eventId (path) The id of the event
 * @param {string} accountId (path) The id of the account
 * @param {string} passId (path) The id of the pass
 * @version 1.3
 **/

export const EVENT_PASS_QUESTION_SECTIONS_QUERY_KEY = (
  eventId: string,
  passId: string
) => [...EVENT_PASS_QUERY_KEY(eventId, passId), "SECTIONS"];

export const SET_EVENT_PASS_QUESTION_SECTIONS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_PASS_QUESTION_SECTIONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventPassQuestionSections>>
) => {
  client.setQueryData(
    EVENT_PASS_QUESTION_SECTIONS_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventPassQuestionSectionsProps extends InfiniteQueryParams {
  eventId: string;
  accountId: string;
  passId: string;
}

export const GetEventPassQuestionSections = async ({
  eventId,
  accountId,
  passId,
  adminApiParams,
}: GetEventPassQuestionSectionsProps): Promise<
  ConnectedXMResponse<RegistrationSection[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get<
    ConnectedXMResponse<RegistrationSection[]>
  >(`/events/${eventId}/attendees/${accountId}/passes/${passId}/questions`);
  return data;
};

export const useGetEventPassQuestionSections = (
  eventId: string = "",
  accountId: string = "",
  passId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventPassQuestionSections>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventPassQuestionSections>>
  >(
    EVENT_PASS_QUESTION_SECTIONS_QUERY_KEY(eventId, passId),
    (params: InfiniteQueryParams) =>
      GetEventPassQuestionSections({
        ...params,
        eventId,
        accountId,
        passId,
      }),
    params,
    {
      ...options,
      enabled: !!eventId && !!accountId && !!passId,
    },
    "events"
  );
};
