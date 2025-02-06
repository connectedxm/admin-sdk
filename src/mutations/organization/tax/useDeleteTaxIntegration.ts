import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../../useConnectedMutation";
import { ConnectedXMResponse, TaxIntegrationType } from "@src/interfaces";
import {
  TAX_INTEGRATIONS_QUERY_KEY,
  TAX_INTEGRATION_QUERY_KEY,
} from "@src/queries";

/**
 * Endpoint to delete a specific tax integration within an organization.
 * This function allows the removal of a tax integration by specifying its type, 
 * ensuring that the integration is no longer active or available for use.
 * It is designed for administrative purposes where managing tax integrations is required.
 * @name DeleteTaxIntegration
 * @param {keyof typeof TaxIntegrationType} type (path) - The type of the tax integration
 * @version 1.3
 **/

export interface DeleteTaxIntegrationParams extends MutationParams {
  type: keyof typeof TaxIntegrationType;
}

export const DeleteTaxIntegration = async ({
  type,
  adminApiParams,
  queryClient,
}: DeleteTaxIntegrationParams): Promise<ConnectedXMResponse<null>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.delete<ConnectedXMResponse<null>>(
    `/organization/tax/${type}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: TAX_INTEGRATIONS_QUERY_KEY() });
    queryClient.removeQueries({
      queryKey: TAX_INTEGRATION_QUERY_KEY(type),
    });
  }
  return data;
};

export const useDeleteTaxIntegration = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteTaxIntegration>>,
      Omit<DeleteTaxIntegrationParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteTaxIntegrationParams,
    Awaited<ReturnType<typeof DeleteTaxIntegration>>
  >(DeleteTaxIntegration, options, {
    domain: "org",
    type: "del",
  });
};