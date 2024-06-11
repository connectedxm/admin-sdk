import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { FAQSection } from "@src/interfaces";
import useConnectedInfiniteQuery, {
  InfiniteQueryParams,
} from "../../useConnectedInfiniteQuery";
import { EVENT_QUERY_KEY } from "../useGetEvent";
import { QueryClient } from "@tanstack/react-query";

export const EVENT_FAQ_SECTIONS_QUERY_KEY = (eventId: string) => [
  ...EVENT_QUERY_KEY(eventId),
  "FAQ_SECTIONS",
];

export const SET_EVENT_FAQ_SECTIONS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_FAQ_SECTIONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventFAQSections>>
) => {
  client.setQueryData(EVENT_FAQ_SECTIONS_QUERY_KEY(...keyParams), response);
};

interface GetEventFAQSectionsProps extends InfiniteQueryParams {
  eventId: string;
}

export const GetEventFAQSections = async ({
  eventId,
  pageParam,
  pageSize,
  orderBy,
  search,
}: GetEventFAQSectionsProps): Promise<ConnectedXMResponse<FAQSection[]>> => {
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

const useGetEventFAQSections = (eventId: string) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventFAQSections>>
  >(
    EVENT_FAQ_SECTIONS_QUERY_KEY(eventId),
    (params: InfiniteQueryParams) => GetEventFAQSections(params),
    {
      eventId,
    },
    {
      enabled: !!eventId,
    }
  );
};

export default useGetEventFAQSections;
