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
 * @category Params
 * @group Series
 */
export interface UpdateSeriesParams extends MutationParams {
  seriesId: string;
  series: SeriesUpdateInputs;
}

/**
 * @category Methods
 * @group Series
 */
export const UpdateSeries = async ({
  seriesId,
  series,
  adminApiParams,
  queryClient,
}: UpdateSeriesParams): Promise<ConnectedXMResponse<Series>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put<ConnectedXMResponse<Series>>(
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

/**
 * @category Mutations
 * @group Series
 */
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
  >(UpdateSeries, options);
};
