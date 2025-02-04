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
 * Endpoint to create a new series within the application.
 * This function allows users to add a new series by providing the necessary series data.
 * It ensures that the series is created and updates the query cache accordingly.
 * @name CreateSeries
 * @param {SeriesCreateInputs} series - The series data to be created
 * @version 1.2
 **/
export interface CreateSeriesParams extends MutationParams {
  series: SeriesCreateInputs;
}

export const CreateSeries = async ({
  series,
  adminApiParams,
  queryClient,
}: CreateSeriesParams): Promise<ConnectedXMResponse<Series>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.post<ConnectedXMResponse<Series>>(
    `/series`,
    series
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: SERIES_LIST_QUERY_KEY() });
    SET_SERIES_QUERY_DATA(queryClient, [data?.data?.id], data);
  }
  return data;
};

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