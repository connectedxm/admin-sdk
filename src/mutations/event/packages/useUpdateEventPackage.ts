import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, EventPackage } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EventPackageUpdateInputs } from "@src/params";
import { EVENT_PACKAGES_QUERY_KEY } from "@src/queries/events/packages/useGetEventPackages";
import { SET_EVENT_PACKAGE_QUERY_DATA } from "@src/queries/events/packages/useGetEventPackage";

/**
 * @category Params
 * @group Event-Packages
 */
export interface UpdateEventPackageParams extends MutationParams {
  eventId: string;
  packageId: string;
  package: EventPackageUpdateInputs;
}

/**
 * @category Methods
 * @group Event-Packages
 */
export const UpdateEventPackage = async ({
  eventId,
  packageId,
  package: packageData,
  adminApiParams,
  queryClient,
}: UpdateEventPackageParams): Promise<ConnectedXMResponse<EventPackage>> => {
  if (!packageId) throw new Error("Package ID Undefined");
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put<ConnectedXMResponse<EventPackage>>(
    `/events/${eventId}/packages/${packageId}`,
    {
      ...packageData,
      id: undefined,
      event: undefined,
      eventId: undefined,
      passes: undefined,
      createdAt: undefined,
      updatedAt: undefined,
    }
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_PACKAGES_QUERY_KEY(eventId),
    });
    SET_EVENT_PACKAGE_QUERY_DATA(
      queryClient,
      [eventId, packageId || data.data?.id],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Packages
 */
export const useUpdateEventPackage = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateEventPackage>>,
      Omit<UpdateEventPackageParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateEventPackageParams,
    Awaited<ReturnType<typeof UpdateEventPackage>>
  >(UpdateEventPackage, options);
};
