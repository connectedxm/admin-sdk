import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMResponse,
  SideEffect,
  SideEffectActionType,
  SideEffectTriggerType,
} from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { ORGANIZATION_SIDE_EFFECTS_QUERY_KEY } from "@src/queries/organization/sideEffects/useGetOrganizationSideEffects";

/**
 * @category Params
 * @group Organization
 */
export interface CreateOrganizationSideEffectParams extends MutationParams {
  triggerType: keyof typeof SideEffectTriggerType;
  triggerId: string;
  actionType: keyof typeof SideEffectActionType;
  actionId: string;
}

/**
 * @category Methods
 * @group Organization
 */
export const CreateOrganizationSideEffect = async ({
  triggerType,
  triggerId,
  actionType,
  actionId,
  adminApiParams,
  queryClient,
}: CreateOrganizationSideEffectParams): Promise<
  ConnectedXMResponse<SideEffect>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<SideEffect>>(
    `/organization/sideEffects`,
    {
      triggerType,
      triggerId,
      actionType,
      actionId,
    }
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: ORGANIZATION_SIDE_EFFECTS_QUERY_KEY(),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Organization
 */
export const useCreateOrganizationSideEffect = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateOrganizationSideEffect>>,
      Omit<CreateOrganizationSideEffectParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateOrganizationSideEffectParams,
    Awaited<ReturnType<typeof CreateOrganizationSideEffect>>
  >(CreateOrganizationSideEffect, options, {
    domain: "org",
    type: "create",
  });
};
