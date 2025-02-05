import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../../useConnectedMutation";
import { Integration, ConnectedXMResponse } from "@src/interfaces";
import {
  INTEGRATIONS_QUERY_KEY,
  SET_INTEGRATION_QUERY_DATA,
} from "@src/queries";
import { IntegrationUpdateInputs } from "@src/params";

/**
 * Endpoint to update an existing integration within an organization.
 * This function allows users to modify the details of a specific integration by providing the integration ID and the updated inputs.
 * It ensures that the integration data is updated in the system and invalidates the relevant queries to maintain data consistency.
 * @name UpdateIntegration
 * @param {string} integrationId - The ID of the integration
 * @param {IntegrationUpdateInputs} integration - The integration update inputs
 * @version 1.2
**/

export interface UpdateIntegrationParams extends MutationParams {
  integrationId: string;
  integration: IntegrationUpdateInputs;
}

export const UpdateIntegration = async ({
  integrationId,
  integration,
  adminApiParams,
  queryClient,
}: UpdateIntegrationParams): Promise<ConnectedXMResponse<Integration>> => {
  if (!integrationId) throw new Error("Integration ID undefined");
  const adminApi = await GetAdminAPI(adminApiParams);

  const { data } = await adminApi.put<ConnectedXMResponse<Integration>>(
    `/organization/integrations/${integrationId}`,
    integration
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: INTEGRATIONS_QUERY_KEY() });
    SET_INTEGRATION_QUERY_DATA(queryClient, [integrationId], data);
  }
  return data;
};

export const useUpdateIntegration = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateIntegration>>,
      Omit<UpdateIntegrationParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateIntegrationParams,
    Awaited<ReturnType<typeof UpdateIntegration>>
  >(UpdateIntegration, options, {
    domain: "org",
    type: "update",
  });
};