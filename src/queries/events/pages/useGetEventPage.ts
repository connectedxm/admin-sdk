import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { EventPage } from "@src/interfaces";
import { EVENT_PAGES_QUERY_KEY } from "./useGetEventPages";
import { QueryClient } from "@tanstack/react-query";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_PAGE_QUERY_KEY = (eventId: string, pageId: string) => [
  ...EVENT_PAGES_QUERY_KEY(eventId),
  pageId,
];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_PAGE_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_PAGE_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventPage>>
) => {
  client.setQueryData(EVENT_PAGE_QUERY_KEY(...keyParams), response);
};

interface GetEventPageProps extends SingleQueryParams {
  eventId: string;
  pageId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventPage = async ({
  eventId,
  pageId,
  adminApiParams,
}: GetEventPageProps): Promise<ConnectedXMResponse<EventPage>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/events/${eventId}/pages/${pageId}`);
  return data;
};
/**
 * @category Hooks
 * @group Events
 */
export const useGetEventPage = (
  eventId: string = "",
  pageId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetEventPage>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventPage>>(
    EVENT_PAGE_QUERY_KEY(eventId, pageId),
    (params: SingleQueryParams) => GetEventPage({ eventId, pageId, ...params }),
    {
      ...options,
      enabled: !!eventId && !!pageId && (options?.enabled ?? true),
    },
    "events"
  );
};
