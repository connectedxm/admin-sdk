import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { RegistrationSection } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";
import { EVENT_QUERY_KEY } from "../useGetEvent";

/**
 * Endpoint to fetch sections of a specific event.
 * This function retrieves data about various sections within an event, allowing users to access detailed information about each section.
 * It is designed for applications that require comprehensive event section data.
 * @name GetEventSections
 * @param {string} eventId (path) The ID of the event
 * @version 1.3
 **/

export const EVENT_SECTIONS_QUERY_KEY = (eventId: string) => [
  ...EVENT_QUERY_KEY(eventId),
  "SECTIONS",
];

export const SET_EVENT_SECTIONS_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_SECTIONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventSections>>
) => {
  client.setQueryData(EVENT_SECTIONS_QUERY_KEY(...keyParams), response);
};

interface GetEventSectionsProps extends InfiniteQueryParams {
  eventId: string;
}

export const GetEventSections = async ({
  eventId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetEventSectionsProps): Promise<
  ConnectedXMResponse<RegistrationSection[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/events/${eventId}/sections`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });
  return data;
};

export const useGetEventSections = (
  eventId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventSections>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventSections>>
  >(
    EVENT_SECTIONS_QUERY_KEY(eventId),
    (params: InfiniteQueryParams) =>
      GetEventSections({
        ...params,
        eventId,
      }),
    params,
    {
      ...options,
      enabled: !!eventId && (options.enabled ?? true),
    },
    "events"
  );
};
