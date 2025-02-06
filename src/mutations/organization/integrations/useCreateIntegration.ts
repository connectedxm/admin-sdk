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
import { IntegrationCreateInputs } from "@src/params";

/**
 * Endpoint to create a new integration for an organization.
 * This function allows the creation of a new integration by providing the necessary integration details.
 * It is designed to be used in applications where organizations need to add new integrations to their system.
 * @name CreateIntegration
 * @param {IntegrationCreateInputs} integration (body) - The integration details to be created
 * @version 1.3
 **/

export interface CreateIntegrationParams extends MutationParams {
  integration: IntegrationCreateInputs;
}

export const CreateIntegration = async ({
  integration,
  adminApiParams,
  queryClient,
}: CreateIntegrationParams): Promise<ConnectedXMResponse<Integration>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.post<ConnectedXMResponse<Integration>>(
    `/organization/integrations`,
    integration
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: INTEGRATIONS_QUERY_KEY() });
    SET_INTEGRATION_QUERY_DATA(queryClient, [data.data?.id], data);
  }
  return data;
};

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
  >(CreateIntegration, options, {
    domain: "org",
    type: "create",
  });
};