import { ConnectedXMResponse } from "@src/interfaces";
import { EventPassType } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";
import { EVENT_SECTION_QUERY_KEY } from "./useGetEventSection";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * Fetches pass types for a specific event section with pagination support.
 * This function is designed to retrieve different pass types available for a given event section,
 * allowing for paginated data fetching to efficiently handle large datasets.
 * It is useful in scenarios where detailed information about event pass types is required.
 * @name GetEventSectionPassTypes
 * @param {string} eventId (path) The id of the event
 * @param {string} sectionId (path) The id of the section
 * @version 1.3
 **/

export const EVENT_SECTION_PASS_TYPES_QUERY_KEY = (
  eventId: string,
  sectionId: string
) => [...EVENT_SECTION_QUERY_KEY(eventId, sectionId), "PASS_TYPES"];

export const SET_EVENT_SECTION_PASS_TYPES_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_SECTION_PASS_TYPES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventSectionPassTypes>>
) => {
  client.setQueryData(
    EVENT_SECTION_PASS_TYPES_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventSectionPassTypesProps extends InfiniteQueryParams {
  eventId: string;
  sectionId: string;
}

export const GetEventSectionPassTypes = async ({
  eventId,
  sectionId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetEventSectionPassTypesProps): Promise<
  ConnectedXMResponse<EventPassType[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/sections/${sectionId}/passTypes`,
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

export const useGetEventSectionPassTypes = (
  eventId: string = "",
  sectionId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventSectionPassTypes>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventSectionPassTypes>>
  >(
    EVENT_SECTION_PASS_TYPES_QUERY_KEY(eventId, sectionId),
    (params: InfiniteQueryParams) =>
      GetEventSectionPassTypes({
        ...params,
        eventId,
        sectionId,
      }),
    params,
    {
      ...options,
      enabled: !!eventId && !!sectionId,
    },
    "events"
  );
};
