import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { EventOnSiteBadgeField } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";
import { EVENTS_QUERY_KEY } from "../useGetEvents";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";

/**
 * Endpoint to manage fetching and updating of ZPL template badge fields for events.
 * This function allows for the retrieval of on-site badge fields associated with a specific event's ZPL template.
 * It is designed to be used in applications where event-specific badge field data is required.
 * @name GetEventZplTemplateBadgeFields
 * @param {string} eventId (path) The id of the event
 * @version 1.3
 **/

export const EVENT_ZPL_TEMPLATE_BADGE_FIELDS_QUERY_KEY = (eventId: string) => [
  ...EVENTS_QUERY_KEY(),
  eventId,
  "ON_SITE_BADGE_FIELDS",
];

export const SET_EVENT_ZPL_TEMPLATE_BADGE_FIELDS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_ZPL_TEMPLATE_BADGE_FIELDS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventZplTemplateBadgeFields>>
) => {
  client.setQueryData(
    EVENT_ZPL_TEMPLATE_BADGE_FIELDS_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventZplTemplateBadgeFieldsProps extends InfiniteQueryParams {
  eventId: string;
}

export const GetEventZplTemplateBadgeFields = async ({
  eventId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetEventZplTemplateBadgeFieldsProps): Promise<
  ConnectedXMResponse<EventOnSiteBadgeField[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/zpl-template/fields`,
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

export const useGetEventZplTemplateBadgeFields = (
  eventId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventZplTemplateBadgeFields>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventZplTemplateBadgeFields>>
  >(
    EVENT_ZPL_TEMPLATE_BADGE_FIELDS_QUERY_KEY(eventId),
    (params: InfiniteQueryParams) =>
      GetEventZplTemplateBadgeFields({ ...params, eventId }),
    params,
    {
      ...options,
      enabled: !!eventId && (options.enabled ?? true),
    },
    "events"
  );
};
