import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { ConnectedXMResponse, Series } from "@src/interfaces";
import { SET_SERIES_QUERY_DATA, SERIES_EVENTS_QUERY_KEY } from "@src/queries";

/**
 * @category Params
 * @group Series
 */
export interface RemoveSeriesEventParams extends MutationParams {
  seriesId: string;
  eventId: string;
}

/**
 * @category Methods
 * @group Series
 */
export const RemoveSeriesEvent = async ({
  seriesId,
  eventId,
  adminApiParams,
  queryClient,
}: RemoveSeriesEventParams): Promise<ConnectedXMResponse<Series>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<Series>>(
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

/**
 * @category Mutations
 * @group Series
 */
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
  >(RemoveSeriesEvent, options);
};
