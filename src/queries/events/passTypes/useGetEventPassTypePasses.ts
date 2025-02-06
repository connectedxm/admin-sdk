import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { EventPass } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";
import { EVENT_PASS_TYPE_QUERY_KEY } from "./useGetEventPassType";

/**
 * Endpoint to retrieve event pass type passes for a specific event and pass type.
 * This function allows users to fetch passes associated with a particular event and pass type, with an optional filter for checked-in status.
 * It is designed to be used in applications where event management and pass tracking are required.
 * @name GetEventPassTypePasses
 * @param {string} eventId (path) - The id of the event
 * @param {string} passTypeId (path) - The id of the pass type
 * @param {boolean} [checkedIn] (query) - Optional filtering by checkedIn status
 * @version 1.3
 **/

export const EVENT_PASS_TYPE_PASSES_QUERY_KEY = (
  eventId: string,
  passTypeId: string,
  checkedIn?: boolean
) => {
  const keys = [...EVENT_PASS_TYPE_QUERY_KEY(eventId, passTypeId), "PASSES"];
  if (typeof checkedIn === "boolean") {
    keys.push(checkedIn ? "CHECKED_IN" : "NOT_CHECKED");
  }
  return keys;
};

export const SET_EVENT_PASS_TYPE_PASSES_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_PASS_TYPE_PASSES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventPassTypePasses>>
) => {
  client.setQueryData(EVENT_PASS_TYPE_PASSES_QUERY_KEY(...keyParams), response);
};

interface GetEventPassTypePassesProps extends InfiniteQueryParams {
  eventId: string;
  passTypeId: string;
  checkedIn?: boolean;
}

export const GetEventPassTypePasses = async ({
  eventId,
  passTypeId,
  checkedIn,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetEventPassTypePassesProps): Promise<ConnectedXMResponse<EventPass[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/passTypes/${passTypeId}/passes`,
    {
      params: {
        checkedIn: typeof checkedIn !== "undefined" ? checkedIn : undefined,
        page: pageParam || undefined,
        pageSize: pageSize || undefined,
        orderBy: orderBy || undefined,
        search: search || undefined,
      },
    }
  );
  return data;
};

export const useGetEventPassTypePasses = (
  eventId: string = "",
  passTypeId: string = "",
  checkedIn?: boolean,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventPassTypePasses>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventPassTypePasses>>
  >(
    EVENT_PASS_TYPE_PASSES_QUERY_KEY(eventId, passTypeId, checkedIn),
    (params: InfiniteQueryParams) =>
      GetEventPassTypePasses({
        ...params,
        eventId,
        passTypeId,
        checkedIn,
      }),
    params,
    {
      ...options,
      enabled: !!passTypeId && (options.enabled ?? true),
    },
    "events"
  );
};