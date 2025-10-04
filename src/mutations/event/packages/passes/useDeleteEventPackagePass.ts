import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EVENT_PACKAGE_PASSES_QUERY_KEY } from "@src/queries/events/packages/passes/useGetEventPackagePasses";
import { EVENT_PACKAGE_PASS_QUERY_KEY } from "@src/queries/events/packages/passes/useGetEventPackagePass";

/**
 * @category Params
 * @group Event-Packages
 */
export interface DeleteEventPackagePassParams extends MutationParams {
  eventId: string;
  packageId: string;
  passId: string;
}

/**
 * @category Methods
 * @group Event-Packages
 */
export const DeleteEventPackagePass = async ({
  eventId,
  packageId,
  passId,
  adminApiParams,
  queryClient,
}: DeleteEventPackagePassParams): Promise<ConnectedXMResponse<null>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<null>>(
    `/events/${eventId}/packages/${packageId}/passes/${passId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_PACKAGE_PASSES_QUERY_KEY(eventId, packageId),
    });
    queryClient.removeQueries({
      queryKey: EVENT_PACKAGE_PASS_QUERY_KEY(eventId, packageId, passId),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Packages
 */
export const useDeleteEventPackagePass = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteEventPackagePass>>,
      Omit<DeleteEventPackagePassParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteEventPackagePassParams,
    Awaited<ReturnType<typeof DeleteEventPackagePass>>
  >(DeleteEventPackagePass, options);
};
