import { CustomModule, ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { GetAdminAPI } from "@src/AdminAPI";
import { CustomModuleUpdateInputs } from "@src/params";
import { CUSTOM_MODULES_QUERY_KEY } from "../../../../queries/organization/modules/custom/useGetCustomModules";
import { SET_CUSTOM_MODULE_QUERY_DATA } from "../../../../queries/organization/modules/custom/useGetCustomModule";

/**
 * @category Params
 * @group Organization
 */
export interface UpdateCustomModuleParams extends MutationParams {
  moduleId: string;
  module: CustomModuleUpdateInputs;
}

/**
 * @category Methods
 * @group Organization
 */
export const UpdateCustomModule = async ({
  moduleId,
  module,
  adminApiParams,
  queryClient,
}: UpdateCustomModuleParams): Promise<ConnectedXMResponse<CustomModule>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put<ConnectedXMResponse<CustomModule>>(
    `/organization/modules/custom/${moduleId}`,
    module
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: CUSTOM_MODULES_QUERY_KEY() });
    SET_CUSTOM_MODULE_QUERY_DATA(queryClient, [moduleId], data);
  }
  return data;
};

/**
 * @category Mutations
 * @group Organization
 */
export const useUpdateCustomModule = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateCustomModule>>,
      Omit<UpdateCustomModuleParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateCustomModuleParams,
    Awaited<ReturnType<typeof UpdateCustomModule>>
  >(UpdateCustomModule, options);
};
