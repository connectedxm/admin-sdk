import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { Series, ConnectedXMResponse } from "@src/interfaces";
import { SERIES_LIST_QUERY_KEY, SET_SERIES_QUERY_DATA } from "@src/queries";
import { SeriesUpdateInputs } from "@src/params";

/**
 * Endpoint to update a series in the system.
 * This function allows for updating the details of an existing series by providing the series ID and the new series data.
 * It is designed to be used in applications where series data needs to be modified.
 * @name UpdateSeries
 * @param {string} seriesId (path) The id of the series
 * @param {SeriesUpdateInputs} series (body) The series update inputs
 * @version 1.3
 **/

export interface UpdateSeriesParams extends MutationParams {
  seriesId: string;
  series: SeriesUpdateInputs;
}

export const UpdateSeries = async ({
  seriesId,
  series,
  adminApiParams,
  queryClient,
}: UpdateSeriesParams): Promise<ConnectedXMResponse<Series>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.put<ConnectedXMResponse<Series>>(
    `/series/${seriesId}`,
    {
      ...series,
      id: undefined,
      image: undefined,
      createdAt: undefined,
      updatedAt: undefined,
    }
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: SERIES_LIST_QUERY_KEY() });
    SET_SERIES_QUERY_DATA(queryClient, [seriesId || data.data.id], data);
  }
  return data;
};

export const useUpdateSeries = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateSeries>>,
      Omit<UpdateSeriesParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateSeriesParams,
    Awaited<ReturnType<typeof UpdateSeries>>
  >(UpdateSeries, options, {
    domain: "events",
    type: "update",
  });
};
