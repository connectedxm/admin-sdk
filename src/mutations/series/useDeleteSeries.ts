import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { ConnectedXMResponse } from "@src/interfaces";
import { SERIES_LIST_QUERY_KEY, SERIES_QUERY_KEY } from "@src/queries";

/**
 * Endpoint to delete a series by its unique identifier.
 * This function allows for the removal of a series from the system, ensuring that associated queries are invalidated and removed.
 * It is designed to be used in applications where series management is required, providing a mechanism to delete series data.
 * @name DeleteSeries
 * @param {string} seriesId (path) - The id of the series
 * @version 1.3
 **/
export interface DeleteSeriesParams extends MutationParams {
  seriesId: string;
}

export const DeleteSeries = async ({
  seriesId,
  adminApiParams,
  queryClient,
}: DeleteSeriesParams): Promise<ConnectedXMResponse<null>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.delete<ConnectedXMResponse<null>>(
    `/series/${seriesId}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: SERIES_LIST_QUERY_KEY() });
    queryClient.removeQueries({ queryKey: SERIES_QUERY_KEY(seriesId) });
  }
  return data;
};

export const useDeleteSeries = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteSeries>>,
      Omit<DeleteSeriesParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteSeriesParams,
    Awaited<ReturnType<typeof DeleteSeries>>
  >(DeleteSeries, options, {
    domain: "events",
    type: "del",
  });
};