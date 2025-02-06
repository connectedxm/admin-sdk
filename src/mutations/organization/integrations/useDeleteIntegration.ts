import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../../useConnectedMutation";
import { ConnectedXMResponse } from "@src/interfaces";
import { INTEGRATIONS_QUERY_KEY, INTEGRATION_QUERY_KEY } from "@src/queries";

/**
 * Endpoint to delete a specific integration within an organization.
 * This function allows for the removal of an integration by its unique identifier.
 * It ensures that the integration is deleted and updates the query cache accordingly.
 * @name DeleteIntegration
 * @param {string} integrationId (path) - The ID of the integration to be deleted
 * @version 1.3
 **/

export interface DeleteIntegrationParams extends MutationParams {
  integrationId: string;
}

export const DeleteIntegration = async ({
  integrationId,
  adminApiParams,
  queryClient,
}: DeleteIntegrationParams): Promise<ConnectedXMResponse<null>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.delete<ConnectedXMResponse<null>>(
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