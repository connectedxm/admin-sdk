import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { SeriesRegistrationResponsesUpdateInputs } from "@src/params";
import {
  SERIES_REGISTRATION_QUERY_KEY,
  SERIES_REGISTRATION_RESPONSES_QUERY_KEY,
} from "@src/queries";

/**
 * @category Params
 * @group Series
 */
export interface UpdateSeriesRegistrationResponsesParams extends MutationParams {
  seriesId: string;
  registrationId: string;
  responses: SeriesRegistrationResponsesUpdateInputs["responses"];
}

/**
 * @category Methods
 * @group Series
 */
export const UpdateSeriesRegistrationResponses = async ({
  seriesId,
  registrationId,
  responses,
  adminApiParams,
  queryClient,
}: UpdateSeriesRegistrationResponsesParams): Promise<ConnectedXMResponse<null>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put(
    `/series/${seriesId}/registrations/${registrationId}/responses`,
    { responses }
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: SERIES_REGISTRATION_QUERY_KEY(seriesId, registrationId),
    });
    queryClient.invalidateQueries({
      queryKey: SERIES_REGISTRATION_RESPONSES_QUERY_KEY(
        seriesId,
        registrationId
      ),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Series
 */
export const useUpdateSeriesRegistrationResponses = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateSeriesRegistrationResponses>>,
      Omit<
        UpdateSeriesRegistrationResponsesParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateSeriesRegistrationResponsesParams,
    Awaited<ReturnType<typeof UpdateSeriesRegistrationResponses>>
  >(UpdateSeriesRegistrationResponses, options);
};
