import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import {
  RegistrationQuestion,
  RegistrationQuestionResponse,
} from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";
import { EVENT_PASS_QUERY_KEY } from "./useGetEventPass";

export interface RegistrationQuestionWithResponse extends RegistrationQuestion {
  responses: RegistrationQuestionResponse[];
}

/**
 * @category Keys
 * @group Events
 */
export const EVENT_PASS_RESPONSES_QUERY_KEY = (
  eventId: string,
  passId: string
) => [...EVENT_PASS_QUERY_KEY(eventId, passId), "RESPONSES"];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_PASS_RESPONSES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_PASS_RESPONSES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventPassResponses>>
) => {
  client.setQueryData(EVENT_PASS_RESPONSES_QUERY_KEY(...keyParams), response);
};

interface GetEventPassResponsesProps extends InfiniteQueryParams {
  eventId: string;
  passId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventPassResponses = async ({
  eventId,
  passId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetEventPassResponsesProps): Promise<
  ConnectedXMResponse<RegistrationQuestionResponse[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/passes/${passId}/responses`,
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
export const useGetEventPassResponses = (
  eventId: string = "",
  passId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventPassResponses>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventPassResponses>>
  >(
    EVENT_PASS_RESPONSES_QUERY_KEY(eventId, passId),
    (params: InfiniteQueryParams) =>
      GetEventPassResponses({
        ...params,
        eventId,
        passId,
      }),
    params,
    {
      ...options,
      enabled: !!eventId && !!passId && (options.enabled ?? true),
    },
    "events"
  );
};
