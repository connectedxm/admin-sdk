import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, SideEffect } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { ORGANIZATION_SIDE_EFFECTS_QUERY_KEY } from "@src/queries/organization/sideEffects/useGetOrganizationSideEffects";
import { ORGANIZATION_SIDE_EFFECT_QUERY_KEY } from "@src/queries/organization/sideEffects/useGetOrganizationSideEffect";

/**
 * @category Params
 * @group Organization
 */
export interface DeleteOrganizationSideEffectParams extends MutationParams {
  sideEffectId: string;
}

/**
 * @category Methods
 * @group Organization
 */
export const DeleteOrganizationSideEffect = async ({
  sideEffectId,
  adminApiParams,
  queryClient,
}: DeleteOrganizationSideEffectParams): Promise<
  ConnectedXMResponse<SideEffect>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<SideEffect>>(
    `/organization/sideEffects/${sideEffectId}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: ORGANIZATION_SIDE_EFFECTS_QUERY_KEY(),
    });
    queryClient.removeQueries({
      queryKey: ORGANIZATION_SIDE_EFFECT_QUERY_KEY(sideEffectId),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Organization
 */
export const useDeleteOrganizationSideEffect = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteOrganizationSideEffect>>,
      Omit<DeleteOrganizationSideEffectParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteOrganizationSideEffectParams,
    Awaited<ReturnType<typeof DeleteOrganizationSideEffect>>
  >(DeleteOrganizationSideEffect, options);
};
