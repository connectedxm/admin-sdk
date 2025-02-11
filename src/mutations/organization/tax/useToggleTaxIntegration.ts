import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../../useConnectedMutation";
import {
  TaxIntegration,
  ConnectedXMResponse,
  TaxIntegrationType,
} from "@src/interfaces";
import {
  TAX_INTEGRATIONS_QUERY_KEY,
  SET_TAX_INTEGRATION_QUERY_DATA,
} from "@src/queries";

/**
 * Endpoint to toggle tax integration features for an organization.
 * This function allows the modification of tax integration settings by specifying the type of integration.
 * It is designed to be used in applications where tax integration features need to be enabled or disabled.
 * @name ToggleTaxIntegration
 * @param {keyof typeof TaxIntegrationType} type (path) The type of tax integration
 * @version 1.3
 **/

export interface ToggleTaxIntegrationParams extends MutationParams {
  type: keyof typeof TaxIntegrationType;
}

export const ToggleTaxIntegration = async ({
  type,
  adminApiParams,
  queryClient,
}: ToggleTaxIntegrationParams): Promise<
  ConnectedXMResponse<TaxIntegration>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);

  const { data } = await adminApi.put<ConnectedXMResponse<TaxIntegration>>(
    `/organization/tax/${type}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: TAX_INTEGRATIONS_QUERY_KEY() });
    SET_TAX_INTEGRATION_QUERY_DATA(queryClient, [type], data);
  }
  return data;
};

export const useToggleTaxIntegration = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof ToggleTaxIntegration>>,
      Omit<ToggleTaxIntegrationParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    ToggleTaxIntegrationParams,
    Awaited<ReturnType<typeof ToggleTaxIntegration>>
  >(ToggleTaxIntegration, options, {
    domain: "org",
    type: "update",
  });
};
