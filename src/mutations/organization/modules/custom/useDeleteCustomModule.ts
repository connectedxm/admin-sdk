import { ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { GetAdminAPI } from "@src/AdminAPI";
import { CUSTOM_MODULES_QUERY_KEY } from "../../../../queries/organization/modules/custom/useGetCustomModules";
import { CUSTOM_MODULE_QUERY_KEY } from "../../../../queries/organization/modules/custom/useGetCustomModule";

/**
 * @category Params
 * @group Organization
 */
export interface DeleteCustomModuleParams extends MutationParams {
  moduleId: string;
}

/**
 * @category Methods
 * @group Organization
 */
export const DeleteCustomModule = async ({
  moduleId,
  adminApiParams,
  queryClient,
}: DeleteCustomModuleParams): Promise<ConnectedXMResponse<null>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<null>>(
    `/organization/modules/custom/${moduleId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: CUSTOM_MODULES_QUERY_KEY() });
    queryClient.removeQueries({ queryKey: CUSTOM_MODULE_QUERY_KEY(moduleId) });
  }
  return data;
};

/**
 * @category Mutations
 * @group Organization
 */
export const useDeleteCustomModule = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteCustomModule>>,
      Omit<DeleteCustomModuleParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteCustomModuleParams,
    Awaited<ReturnType<typeof DeleteCustomModule>>
  >(DeleteCustomModule, options);
};
