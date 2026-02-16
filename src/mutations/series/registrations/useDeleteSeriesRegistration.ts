import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  SERIES_REGISTRATIONS_QUERY_KEY,
  SERIES_REGISTRATION_QUERY_KEY,
} from "@src/queries";

/**
 * @category Params
 * @group Series
 */
export interface DeleteSeriesRegistrationParams extends MutationParams {
  seriesId: string;
  registrationId: string;
}

/**
 * @category Methods
 * @group Series
 */
export const DeleteSeriesRegistration = async ({
  seriesId,
  registrationId,
  adminApiParams,
  queryClient,
}: DeleteSeriesRegistrationParams): Promise<ConnectedXMResponse<null>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.delete<ConnectedXMResponse<null>>(
    `/series/${seriesId}/registrations/${registrationId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: SERIES_REGISTRATIONS_QUERY_KEY(seriesId),
    });
    queryClient.removeQueries({
      queryKey: SERIES_REGISTRATION_QUERY_KEY(seriesId, registrationId),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Series
 */
export const useDeleteSeriesRegistration = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteSeriesRegistration>>,
      Omit<
        DeleteSeriesRegistrationParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteSeriesRegistrationParams,
    Awaited<ReturnType<typeof DeleteSeriesRegistration>>
  >(DeleteSeriesRegistration, options);
};
