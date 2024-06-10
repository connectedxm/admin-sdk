import { useConnectedSingleQuery } from "../../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { EventPage } from "@src/interfaces";
import { EVENT_PAGES_QUERY_KEY } from "./useGetEventPages";
import { QueryClient } from "@tanstack/react-query";

export const EVENT_PAGE_QUERY_KEY = (eventId: string, pageId: string) => [
  ...EVENT_PAGES_QUERY_KEY(eventId),
  pageId,
];

export const SET_EVENT_PAGE_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_PAGE_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventPage>>
) => {
  client.setQueryData(EVENT_PAGE_QUERY_KEY(...keyParams), response);
};

interface GetEventPageProps {
  eventId: string;
  pageId: string;
}

export const GetEventPage = async ({
  eventId,
  pageId,
}: GetEventPageProps): Promise<ConnectedXMResponse<EventPage>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/events/${eventId}/pages/${pageId}`);
  return data;
};

const useGetEventPage = (eventId: string, pageId: string) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventPage>>(
    EVENT_PAGE_QUERY_KEY(eventId, pageId),
    () => GetEventPage({ eventId, pageId: pageId || "unknown" }),
    {
      enabled: !!eventId && !!pageId,
    }
  );
};

export default useGetEventPage;
