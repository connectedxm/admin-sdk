import { ConnectedXMResponse } from "@src/interfaces";
import { EventAddOn } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";
import { EVENT_PASS_TYPE_QUERY_KEY } from "./useGetEventPassType";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * Fetches add-ons for a specific event pass type with support for pagination and filtering.
 * This function is designed to retrieve additional features or services associated with a particular event pass type.
 * It supports pagination and filtering to efficiently manage and access large sets of add-on data.
 * @name GetEventPassTypeAddOns
 * @param {string} eventId (path) - The id of the event
 * @param {string} passTypeId (path) - The id of the pass type
 * @version 1.3
 **/

export const EVENT_PASS_TYPE_ADD_ONS_QUERY_KEY = (
  eventId: string,
  passTypeId: string
) => [...EVENT_PASS_TYPE_QUERY_KEY(eventId, passTypeId), "ADD_ONS"];

export const SET_EVENT_PASS_TYPE_ADD_ONS_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_PASS_TYPE_ADD_ONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventPassTypeAddOns>>
) => {
  client.setQueryData(
    EVENT_PASS_TYPE_ADD_ONS_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventPassTypeAddOnsProps extends InfiniteQueryParams {
  eventId: string;
  passTypeId: string;
}

export const GetEventPassTypeAddOns = async ({
  eventId,
  passTypeId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetEventPassTypeAddOnsProps): Promise<ConnectedXMResponse<EventAddOn[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/passTypes/${passTypeId}/addOns`,
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

export const useGetEventPassTypeAddOns = (
  eventId: string = "",
  passTypeId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventPassTypeAddOns>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventPassTypeAddOns>>
  >(
    EVENT_PASS_TYPE_ADD_ONS_QUERY_KEY(eventId, passTypeId),
    (params: InfiniteQueryParams) =>
      GetEventPassTypeAddOns({
        ...params,
        eventId,
        passTypeId,
      }),
    params,
    {
      ...options,
      enabled: !!eventId && !!passTypeId && (options.enabled ?? true),
    },
    "events"
  );
};