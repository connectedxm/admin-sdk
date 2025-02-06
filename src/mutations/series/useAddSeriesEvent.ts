import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { ConnectedXMResponse, Series } from "@src/interfaces";
import { SET_SERIES_QUERY_DATA, SERIES_EVENTS_QUERY_KEY } from "@src/queries";

/**
 * Endpoint to add an event to a specific series.
 * This function allows users to associate an event with a series by providing the series and event identifiers.
 * It is designed to update the series with the new event and refresh the relevant query data.
 * @name AddSeriesEvent
 * @param {string} seriesId (path) - The id of the series
 * @param {string} eventId (path) - The id of the event
 * @version 1.3
 **/

export interface AddSeriesEventParams extends MutationParams {
  seriesId: string;
  eventId: string;
}

export const AddSeriesEvent = async ({
  seriesId,
  eventId,
  adminApiParams,
  queryClient,
}: AddSeriesEventParams): Promise<ConnectedXMResponse<Series>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.post<ConnectedXMResponse<Series>>(
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

export const useAddSeriesEvent = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof AddSeriesEvent>>,
      Omit<AddSeriesEventParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    AddSeriesEventParams,
    Awaited<ReturnType<typeof AddSeriesEvent>>
  >(AddSeriesEvent, options, {
    domain: "events",
    type: "update",
  });
};