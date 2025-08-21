import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, RegistrationFollowup } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "@src/queries/useConnectedInfiniteQuery";
import { QueryClient } from "@tanstack/react-query";
import { EVENT_PASS_QUERY_KEY } from "./useGetEventPass";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_PASS_QUESTION_FOLLOWUPS_QUERY_KEY = (
  eventId: string,
  passId: string
) => [...EVENT_PASS_QUERY_KEY(eventId, passId), "FOLLOWUPS"];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_PASS_QUESTION_FOLLOWUPS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_PASS_QUESTION_FOLLOWUPS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventPassQuestionFollowups>>
) => {
  client.setQueryData(
    EVENT_PASS_QUESTION_FOLLOWUPS_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventPassQuestionFollowupsProps extends InfiniteQueryParams {
  eventId: string;
  accountId: string;
  passId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventPassQuestionFollowups = async ({
  eventId,
  accountId,
  passId,
  adminApiParams,
}: GetEventPassQuestionFollowupsProps): Promise<
  ConnectedXMResponse<RegistrationFollowup[]>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.get<
    ConnectedXMResponse<RegistrationFollowup[]>
  >(`/events/${eventId}/attendees/${accountId}/passes/${passId}/followups`);
  return data;
};

/**
 * @category Hooks
 * @group Events
 */
export const useGetEventPassQuestionFollowups = (
  eventId: string = "",
  accountId: string = "",
  passId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventPassQuestionFollowups>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventPassQuestionFollowups>>
  >(
    EVENT_PASS_QUESTION_FOLLOWUPS_QUERY_KEY(eventId, passId),
    (params: InfiniteQueryParams) =>
      GetEventPassQuestionFollowups({
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
