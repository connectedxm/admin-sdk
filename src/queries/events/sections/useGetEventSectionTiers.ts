import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { Tier } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";
import { EVENT_SECTION_QUERY_KEY } from "./useGetEventSection";

/**
 * Fetches tiers for a specific event section based on the provided parameters.
 * This function retrieves a list of tiers associated with a given event section,
 * allowing for filtering based on whether only allowed tiers should be included.
 * It is useful for applications that need to display or manage tier information
 * for event sections.
 * @name GetEventSectionTiers
 * @param {boolean} allowed (query) Indicates if only allowed tiers should be fetched
 * @param {string} eventId (path) The ID of the event
 * @param {string} sectionId (path) The ID of the section
 * @version 1.3
 **/

export const EVENT_SECTION_TIERS_QUERY_KEY = (
  allowed: boolean,
  eventId: string,
  sectionId: string
) => [
  ...EVENT_SECTION_QUERY_KEY(eventId, sectionId),
  "TIERS",
  allowed ? "ALLOWED" : "DISALLOWED",
];

export const SET_EVENT_SECTION_TIERS_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_SECTION_TIERS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventSectionTiers>>
) => {
  client.setQueryData(EVENT_SECTION_TIERS_QUERY_KEY(...keyParams), response);
};

interface GetEventSectionTiersProps extends InfiniteQueryParams {
  allowed: boolean;
  eventId: string;
  sectionId: string;
}

export const GetEventSectionTiers = async ({
  allowed,
  eventId,
  sectionId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetEventSectionTiersProps): Promise<ConnectedXMResponse<Tier[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/sections/${sectionId}/tiers`,
    {
      params: {
        allowed,
        page: pageParam || undefined,
        pageSize: pageSize || undefined,
        orderBy: orderBy || undefined,
        search: search || undefined,
      },
    }
  );
  return data;
};

export const useGetEventSectionTiers = (
  allowed: boolean,
  eventId: string = "",
  sectionId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventSectionTiers>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventSectionTiers>>
  >(
    EVENT_SECTION_TIERS_QUERY_KEY(allowed, eventId, sectionId),
    (params: InfiniteQueryParams) =>
      GetEventSectionTiers({
        ...params,
        allowed,
        eventId,
        sectionId,
      }),
    params,
    {
      ...options,
      enabled:
        typeof allowed === "boolean" &&
        !!eventId &&
        !!sectionId &&
        (options.enabled ?? true),
    },
    "events"
  );
};
