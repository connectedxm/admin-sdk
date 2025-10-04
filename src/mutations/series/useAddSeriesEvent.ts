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
export interface AddSeriesEventParams extends MutationParams {
  seriesId: string;
  eventId: string;
}

/**
 * @category Methods
 * @group Series
 */
export const AddSeriesEvent = async ({
  seriesId,
  eventId,
  adminApiParams,
  queryClient,
}: AddSeriesEventParams): Promise<ConnectedXMResponse<Series>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<Series>>(
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
  >(AddSeriesEvent, options);
};
