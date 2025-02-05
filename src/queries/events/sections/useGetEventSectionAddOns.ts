import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { EventAddOn } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";
import { EVENT_SECTION_QUERY_KEY } from "./useGetEventSection";

/**
 * Fetches add-ons for a specific event section, supporting pagination and filtering.
 * This function is designed to retrieve a list of add-ons associated with a particular event section.
 * It supports pagination and filtering to allow for efficient data retrieval and management.
 * @name GetEventSectionAddOns
 * @param {string} eventId - The id of the event
 * @param {string} sectionId - The id of the section
 * @version 1.2
 **/

export const EVENT_SECTION_ADDONS_QUERY_KEY = (
  eventId: string,
  sectionId: string
) => [...EVENT_SECTION_QUERY_KEY(eventId, sectionId), "ADDONS"];

export const SET_EVENT_SECTION_ADDONS_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_SECTION_ADDONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventSectionAddOns>>
) => {
  client.setQueryData(EVENT_SECTION_ADDONS_QUERY_KEY(...keyParams), response);
};

interface GetEventSectionAddOnsProps extends InfiniteQueryParams {
  eventId: string;
  sectionId: string;
}

export const GetEventSectionAddOns = async ({
  eventId,
  sectionId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetEventSectionAddOnsProps): Promise<ConnectedXMResponse<EventAddOn[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/sections/${sectionId}/addOns`,
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

export const useGetEventSectionAddOns = (
  eventId: string = "",
  sectionId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventSectionAddOns>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventSectionAddOns>>
  >(
    EVENT_SECTION_ADDONS_QUERY_KEY(eventId, sectionId),
    (params: InfiniteQueryParams) =>
      GetEventSectionAddOns({
        ...params,
        eventId,
        sectionId,
      }),
    params,
    {
      ...options,
      enabled: !!eventId && !!sectionId && (options.enabled ?? true),
    },
    "events"
  );
};