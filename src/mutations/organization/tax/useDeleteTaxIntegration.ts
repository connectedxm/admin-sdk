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
 * @category Params
 * @group Integration
 */
export interface DeleteTaxIntegrationParams extends MutationParams {
  type: keyof typeof TaxIntegrationType;
}

/**
 * @category Methods
 * @group Integration
 */
export const DeleteTaxIntegration = async ({
  type,
  adminApiParams,
  queryClient,
}: DeleteTaxIntegrationParams): Promise<ConnectedXMResponse<null>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<null>>(
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

/**
 * @category Mutations
 * @group Integration
 */
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
  >(DeleteTaxIntegration, options);
};
