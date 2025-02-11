import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { FaqSection } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";
import { EVENT_QUERY_KEY } from "../useGetEvent";
import { QueryClient } from "@tanstack/react-query";

/**
 * Retrieves FAQ sections for a specific event.
 * This function fetches a list of frequently asked questions associated with a given event,
 * allowing users to access detailed information about the event's FAQs.
 * @name GetEventFaqSections
 * @param {string} eventId (path) The id of the event
 * @version 1.3
 **/

export const EVENT_FAQ_SECTIONS_QUERY_KEY = (eventId: string) => [
  ...EVENT_QUERY_KEY(eventId),
  "FAQ_SECTIONS",
];

export const SET_EVENT_FAQ_SECTIONS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_FAQ_SECTIONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventFaqSections>>
) => {
  client.setQueryData(EVENT_FAQ_SECTIONS_QUERY_KEY(...keyParams), response);
};

interface GetEventFaqSectionsProps extends InfiniteQueryParams {
  eventId: string;
}

export const GetEventFaqSections = async ({
  eventId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetEventFaqSectionsProps): Promise<ConnectedXMResponse<FaqSection[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/events/${eventId}/faqs`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });
  return data;
};

export const useGetEventFaqSections = (
  eventId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventFaqSections>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventFaqSections>>
  >(
    EVENT_FAQ_SECTIONS_QUERY_KEY(eventId),
    (params: InfiniteQueryParams) =>
      GetEventFaqSections({
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
