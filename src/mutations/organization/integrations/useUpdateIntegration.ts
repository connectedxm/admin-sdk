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
 * @category Params
 * @group Integration
 */
export interface UpdateIntegrationParams extends MutationParams {
  integrationId: string;
  integration: IntegrationUpdateInputs;
}

/**
 * @category Methods
 * @group Integration
 */
export const UpdateIntegration = async ({
  integrationId,
  integration,
  adminApiParams,
  queryClient,
}: UpdateIntegrationParams): Promise<ConnectedXMResponse<Integration>> => {
  if (!integrationId) throw new Error("Integration ID undefined");
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.put<ConnectedXMResponse<Integration>>(
    `/organization/integrations/${integrationId}`,
    integration
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: INTEGRATIONS_QUERY_KEY() });
    SET_INTEGRATION_QUERY_DATA(queryClient, [integrationId], data);
  }
  return data;
};

/**
 * @category Mutations
 * @group Integration
 */
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
  >(UpdateIntegration, options);
};
