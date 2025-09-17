import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { ConnectedXMResponse, Series } from "@src/interfaces";
import { SET_SERIES_QUERY_DATA } from "@src/queries";

/**
 * @category Params
 * @group Series
 */
export interface ConnectSeriesTemplateParams extends MutationParams {
  seriesId: string;
  templateId: string;
}

/**
 * @category Methods
 * @group Series
 */
export const ConnectSeriesTemplate = async ({
  seriesId,
  templateId,
  adminApiParams,
  queryClient,
}: ConnectSeriesTemplateParams): Promise<ConnectedXMResponse<Series>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put<ConnectedXMResponse<Series>>(
    `/series/${seriesId}/template/${templateId}`
  );
  if (queryClient && data.status === "ok") {
    SET_SERIES_QUERY_DATA(queryClient, [seriesId], data);
  }
  return data;
};

/**
 * @category Mutations
 * @group Series
 */
export const useConnectSeriesTemplate = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof ConnectSeriesTemplate>>,
      Omit<ConnectSeriesTemplateParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    ConnectSeriesTemplateParams,
    Awaited<ReturnType<typeof ConnectSeriesTemplate>>
  >(ConnectSeriesTemplate, options, {
    domain: "events",
    type: "update",
  });
};
