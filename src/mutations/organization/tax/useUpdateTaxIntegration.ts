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
import { TaxIntegrationUpdateInputs } from "@src/params";

/**
 * @category Params
 * @group Integration
 */
export interface UpdateTaxIntegrationParams extends MutationParams {
  type: keyof typeof TaxIntegrationType;
  taxIntegration: TaxIntegrationUpdateInputs;
}

/**
 * @category Methods
 * @group Integration
 */
export const UpdateTaxIntegration = async ({
  type,
  taxIntegration,
  adminApiParams,
}: UpdateTaxIntegrationParams): Promise<
  ConnectedXMResponse<TaxIntegration>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.put<ConnectedXMResponse<TaxIntegration>>(
    `/organization/tax/${type}`,
    taxIntegration
  );

  return data;
};

/**
 * @category Mutations
 * @group Integration
 */
export const useUpdateTaxIntegration = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateTaxIntegration>>,
      Omit<UpdateTaxIntegrationParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateTaxIntegrationParams,
    Awaited<ReturnType<typeof UpdateTaxIntegration>>
  >(UpdateTaxIntegration, options);
};
