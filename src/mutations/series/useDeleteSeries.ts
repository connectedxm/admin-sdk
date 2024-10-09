import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { ConnectedXMResponse } from "@src/interfaces";
import { SERIES_LIST_QUERY_KEY, SERIES_QUERY_KEY } from "@src/queries";

/**
 * @category Params
 * @group Series
 */
export interface DeleteSeriesParams extends MutationParams {
  seriesId: string;
}

/**
 * @category Methods
 * @group Series
 */
export const DeleteSeries = async ({
  seriesId,
  adminApiParams,
  queryClient,
}: DeleteSeriesParams): Promise<ConnectedXMResponse<null>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<null>>(
    `/series/${seriesId}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: SERIES_LIST_QUERY_KEY() });
    queryClient.removeQueries({ queryKey: SERIES_QUERY_KEY(seriesId) });
  }
  return data;
};

/**
 * @category Mutations
 * @group Series
 */
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
