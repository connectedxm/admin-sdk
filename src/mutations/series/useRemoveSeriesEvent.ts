import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { ConnectedXMResponse, Series } from "@src/interfaces";
import { SET_SERIES_QUERY_DATA, SERIES_EVENTS_QUERY_KEY } from "@src/queries";

/**
 * Endpoint to remove a specific event from a series.
 * This function allows the removal of an event identified by its ID from a series, also identified by its ID.
 * It is designed to be used in applications where managing series events is required.
 * @name RemoveSeriesEvent
 * @param {string} seriesId (path) The ID of the series
 * @param {string} eventId (path) The ID of the event
 * @version 1.3
 **/

export interface RemoveSeriesEventParams extends MutationParams {
  seriesId: string;
  eventId: string;
}

export const RemoveSeriesEvent = async ({
  seriesId,
  eventId,
  adminApiParams,
  queryClient,
}: RemoveSeriesEventParams): Promise<ConnectedXMResponse<Series>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.delete<ConnectedXMResponse<Series>>(
    `/series/${seriesId}/events/${eventId}`
  );
  if (queryClient && data.status === "ok") {
    SET_SERIES_QUERY_DATA(queryClient, [seriesId], data);
    queryClient.invalidateQueries({
      queryKey: SERIES_EVENTS_QUERY_KEY(seriesId),
    });
  }
  return data;
};

export const useRemoveSeriesEvent = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof RemoveSeriesEvent>>,
      Omit<RemoveSeriesEventParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    RemoveSeriesEventParams,
    Awaited<ReturnType<typeof RemoveSeriesEvent>>
  >(RemoveSeriesEvent, options, {
    domain: "events",
    type: "update",
  });
};
