import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { Integration, ConnectedXMResponse } from "@src/interfaces";
import {
  INTEGRATIONS_QUERY_KEY,
  SET_INTEGRATION_QUERY_DATA,
} from "@src/queries";
import { IntegrationCreateInputs } from "@src/params";

/**
 * @category Params
 * @group Integration
 */
export interface CreateIntegrationParams extends MutationParams {
  integration: IntegrationCreateInputs;
}

/**
 * @category Methods
 * @group Integration
 */
export const CreateIntegration = async ({
  integration,
  adminApiParams,
  queryClient,
}: CreateIntegrationParams): Promise<ConnectedXMResponse<Integration>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<Integration>>(
    `/organization/integrations`,
    integration
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: INTEGRATIONS_QUERY_KEY() });
    SET_INTEGRATION_QUERY_DATA(queryClient, [data.data?.id], data);
  }
  return data;
};

/**
 * @category Mutations
 * @group Integration
 */
export const useCreateIntegration = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateIntegration>>,
      Omit<CreateIntegrationParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateIntegrationParams,
    Awaited<ReturnType<typeof CreateIntegration>>
  >(CreateIntegration, options);
};
