import { CustomModule, ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../../../useConnectedMutation";
import { GetAdminAPI } from "@src/AdminAPI";
import { CustomModuleCreateInputs } from "@src/params";
import { CUSTOM_MODULES_QUERY_KEY } from "../../../../queries/organization/modules/custom/useGetCustomModules";
import { SET_CUSTOM_MODULE_QUERY_DATA } from "../../../../queries/organization/modules/custom/useGetCustomModule";

/**
 * @category Params
 * @group Organization
 */
export interface CreateCustomModuleParams extends MutationParams {
  module: CustomModuleCreateInputs;
}

/**
 * @category Methods
 * @group Organization
 */
export const CreateCustomModule = async ({
  module,
  adminApiParams,
  queryClient,
}: CreateCustomModuleParams): Promise<ConnectedXMResponse<CustomModule>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<CustomModule>>(
    `/organization/modules/custom`,
    module
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: CUSTOM_MODULES_QUERY_KEY() });
    SET_CUSTOM_MODULE_QUERY_DATA(queryClient, [data?.data.id], data);
  }
  return data;
};

/**
 * @category Mutations
 * @group Organization
 */
export const useCreateCustomModule = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateCustomModule>>,
      Omit<CreateCustomModuleParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateCustomModuleParams,
    Awaited<ReturnType<typeof CreateCustomModule>>
  >(CreateCustomModule, options, {
    domain: "org",
    type: "create",
  });
};
