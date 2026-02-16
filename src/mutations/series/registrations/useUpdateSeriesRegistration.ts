import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, SeriesRegistration } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { SeriesRegistrationUpdateInputs } from "@src/params";
import {
  SERIES_REGISTRATIONS_QUERY_KEY,
  SET_SERIES_REGISTRATION_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Series
 */
export interface UpdateSeriesRegistrationParams extends MutationParams {
  seriesId: string;
  registrationId: string;
  registration: SeriesRegistrationUpdateInputs;
}

/**
 * @category Methods
 * @group Series
 */
export const UpdateSeriesRegistration = async ({
  seriesId,
  registrationId,
  registration,
  adminApiParams,
  queryClient,
}: UpdateSeriesRegistrationParams): Promise<
  ConnectedXMResponse<SeriesRegistration>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put<
    ConnectedXMResponse<SeriesRegistration>
  >(`/series/${seriesId}/registrations/${registrationId}`, registration);

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
export const useUpdateSeriesRegistration = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateSeriesRegistration>>,
      Omit<UpdateSeriesRegistrationParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateSeriesRegistrationParams,
    Awaited<ReturnType<typeof UpdateSeriesRegistration>>
  >(UpdateSeriesRegistration, options);
};
