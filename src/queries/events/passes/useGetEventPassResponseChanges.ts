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
 * @category Keys
 * @group Events
 */
export const EVENT_PASS_RESPONSE_CHANGES_QUERY_KEY = (
  eventId: string,
  passId: string,
  questionId: string
) => [...EVENT_PASS_RESPONSE_QUERY_KEY(eventId, passId, questionId), "CHANGES"];

/**
 * @category Setters
 * @group Events
 */
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

/**
 * @category Queries
 * @group Events
 */
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
/**
 * @category Hooks
 * @group Events
 */
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
    }
  );
};
