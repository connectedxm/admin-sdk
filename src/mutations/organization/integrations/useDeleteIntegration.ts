import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../../useConnectedMutation";
import { ConnectedXMResponse } from "@src/interfaces";
import { INTEGRATIONS_QUERY_KEY, INTEGRATION_QUERY_KEY } from "@src/queries";

/**
 * @category Params
 * @group Integration
 */
export interface DeleteIntegrationParams extends MutationParams {
  integrationId: string;
}

/**
 * @category Methods
 * @group Integration
 */
export const DeleteIntegration = async ({
  integrationId,
  adminApiParams,
  queryClient,
}: DeleteIntegrationParams): Promise<ConnectedXMResponse<null>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<null>>(
    `/organization/integrations/${integrationId}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: INTEGRATIONS_QUERY_KEY() });
    queryClient.removeQueries({
      queryKey: INTEGRATION_QUERY_KEY(integrationId),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Integration
 */
export const useDeleteIntegration = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteIntegration>>,
      Omit<DeleteIntegrationParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteIntegrationParams,
    Awaited<ReturnType<typeof DeleteIntegration>>
  >(DeleteIntegration, options, {
    domain: "org",
    type: "del",
  });
};
