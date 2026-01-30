import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EVENT_PACKAGE_QUERY_KEY } from "@src/queries/events/packages/useGetEventPackage";
import { EVENT_PACKAGES_QUERY_KEY } from "@src/queries/events/packages/useGetEventPackages";

/**
 * @category Params
 * @group Event-Packages
 */
export interface DeleteEventPackageParams extends MutationParams {
  eventId: string;
  packageId: string;
}

/**
 * @category Methods
 * @group Event-Packages
 */
export const DeleteEventPackage = async ({
  eventId,
  packageId,
  adminApiParams,
  queryClient,
}: DeleteEventPackageParams): Promise<ConnectedXMResponse<null>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<null>>(
    `/events/${eventId}/packages/${packageId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_PACKAGES_QUERY_KEY(eventId),
    });
    queryClient.removeQueries({
      queryKey: EVENT_PACKAGE_QUERY_KEY(eventId, packageId),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Packages
 */
export const useDeleteEventPackage = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteEventPackage>>,
      Omit<DeleteEventPackageParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteEventPackageParams,
    Awaited<ReturnType<typeof DeleteEventPackage>>
  >(DeleteEventPackage, options);
};
