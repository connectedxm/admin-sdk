import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMResponse,
  SeriesRegistration,
} from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { SeriesRegistrationCreateInputs } from "@src/params";
import {
  SERIES_REGISTRATIONS_QUERY_KEY,
  SET_SERIES_REGISTRATION_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Series
 */
export interface CreateSeriesRegistrationParams extends MutationParams {
  seriesId: string;
  registration: SeriesRegistrationCreateInputs;
}

/**
 * @category Methods
 * @group Series
 */
export const CreateSeriesRegistration = async ({
  seriesId,
  registration,
  adminApiParams,
  queryClient,
}: CreateSeriesRegistrationParams): Promise<
  ConnectedXMResponse<SeriesRegistration>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<
    ConnectedXMResponse<SeriesRegistration>
  >(`/series/${seriesId}/registrations`, registration);
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: SERIES_REGISTRATIONS_QUERY_KEY(seriesId),
    });
    if (data.data?.id) {
      SET_SERIES_REGISTRATION_QUERY_DATA(
        queryClient,
        [seriesId, data.data.id],
        data
      );
    }
  }
  return data;
};

/**
 * @category Mutations
 * @group Series
 */
export const useCreateSeriesRegistration = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateSeriesRegistration>>,
      Omit<
        CreateSeriesRegistrationParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateSeriesRegistrationParams,
    Awaited<ReturnType<typeof CreateSeriesRegistration>>
  >(CreateSeriesRegistration, options);
};
