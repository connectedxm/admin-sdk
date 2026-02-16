import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, SeriesRegistration } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  SERIES_REGISTRATIONS_QUERY_KEY,
  SET_SERIES_REGISTRATION_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Series
 */
export interface CancelSeriesRegistrationParams extends MutationParams {
  seriesId: string;
  registrationId: string;
}

/**
 * @category Methods
 * @group Series
 */
export const CancelSeriesRegistration = async ({
  seriesId,
  registrationId,
  adminApiParams,
  queryClient,
}: CancelSeriesRegistrationParams): Promise<
  ConnectedXMResponse<SeriesRegistration>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put<
    ConnectedXMResponse<SeriesRegistration>
  >(`/series/${seriesId}/registrations/${registrationId}/cancel`);

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: SERIES_REGISTRATIONS_QUERY_KEY(seriesId),
    });
    SET_SERIES_REGISTRATION_QUERY_DATA(
      queryClient,
      [seriesId, registrationId],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group Series
 */
export const useCancelSeriesRegistration = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CancelSeriesRegistration>>,
      Omit<CancelSeriesRegistrationParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CancelSeriesRegistrationParams,
    Awaited<ReturnType<typeof CancelSeriesRegistration>>
  >(CancelSeriesRegistration, options);
};
