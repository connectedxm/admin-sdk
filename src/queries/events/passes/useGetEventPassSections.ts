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
 * @category Keys
 * @group Events
 */
export const EVENT_PASS_SECTIONS_QUERY_KEY = (
  eventId: string,
  passId: string
) => [...EVENT_PASS_QUERY_KEY(eventId, passId), "SECTIONS"];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_PASS_SECTIONS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_PASS_SECTIONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventPassSections>>
) => {
  client.setQueryData(EVENT_PASS_SECTIONS_QUERY_KEY(...keyParams), response);
};

interface GetEventPassSectionsProps extends InfiniteQueryParams {
  eventId: string;
  passId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventPassSections = async ({
  eventId,
  passId,
  adminApiParams,
}: GetEventPassSectionsProps): Promise<
  ConnectedXMResponse<RegistrationSection[]>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.get<
    ConnectedXMResponse<RegistrationSection[]>
  >(`/events/${eventId}/passes/${passId}/sections`);
  return data;
};

/**
 * @category Hooks
 * @group Events
 */
export const useGetEventPassSections = (
  eventId: string = "",
  passId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventPassSections>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventPassSections>>
  >(
    EVENT_PASS_SECTIONS_QUERY_KEY(eventId, passId),
    (params: InfiniteQueryParams) =>
      GetEventPassSections({
        ...params,
        eventId,
        passId,
      }),
    params,
    {
      ...options,
      enabled: !!eventId && !!passId,
    },
    "events"
  );
};
