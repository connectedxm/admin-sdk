import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
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
 * @category Params
 * @group Integration
 */
export interface ToggleTaxIntegrationParams extends MutationParams {
  type: keyof typeof TaxIntegrationType;
}

/**
 * @category Methods
 * @group Integration
 */
export const ToggleTaxIntegration = async ({
  type,
  adminApiParams,
  queryClient,
}: ToggleTaxIntegrationParams): Promise<
  ConnectedXMResponse<TaxIntegration>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.put<ConnectedXMResponse<TaxIntegration>>(
    `/organization/tax/${type}/toggle`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: TAX_INTEGRATIONS_QUERY_KEY() });
    SET_TAX_INTEGRATION_QUERY_DATA(queryClient, [type], data);
  }
  return data;
};

/**
 * @category Mutations
 * @group Integration
 */
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
  >(ToggleTaxIntegration, options);
};
