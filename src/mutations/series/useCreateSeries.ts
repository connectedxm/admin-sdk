import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { Series, ConnectedXMResponse } from "@src/interfaces";
import { SERIES_LIST_QUERY_KEY, SET_SERIES_QUERY_DATA } from "@src/queries";
import { SeriesCreateInputs } from "@src/params";

/**
 * @category Params
 * @group Series
 */
export interface CreateSeriesParams extends MutationParams {
  series: SeriesCreateInputs;
}

/**
 * @category Methods
 * @group Series
 */
export const CreateSeries = async ({
  series,
  adminApiParams,
  queryClient,
}: CreateSeriesParams): Promise<ConnectedXMResponse<Series>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<Series>>(
    `/series`,
    series
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: SERIES_LIST_QUERY_KEY() });
    SET_SERIES_QUERY_DATA(queryClient, [data?.data?.id], data);
  }
  return data;
};

/**
 * @category Mutations
 * @group Series
 */
export const useCreateSeries = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateSeries>>,
      Omit<CreateSeriesParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateSeriesParams,
    Awaited<ReturnType<typeof CreateSeries>>
  >(CreateSeries, options, {
    domain: "events",
    type: "create",
  });
};
