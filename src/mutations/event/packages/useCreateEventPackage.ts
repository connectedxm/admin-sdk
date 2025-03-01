import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, Package } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { PackageCreateInput } from "@src/params";
import { EVENT_PACKAGES_QUERY_KEY } from "@src/queries/events/packages/useGetEventPackages";
import { SET_EVENT_PACKAGE_QUERY_DATA } from "@src/queries/events/packages/useGetEventPackage";

/**
 * @category Params
 * @group Event-Packages
 */
export interface CreateEventPackageParams extends MutationParams {
  eventId: string;
  package: PackageCreateInput;
}

/**
 * @category Methods
 * @group Event-Packages
 */
export const CreateEventPackage = async ({
  eventId,
  package: packageData,
  adminApiParams,
  queryClient,
}: CreateEventPackageParams): Promise<ConnectedXMResponse<Package>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<Package>>(
    `/events/${eventId}/packages`,
    packageData
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_PACKAGES_QUERY_KEY(eventId),
    });
    SET_EVENT_PACKAGE_QUERY_DATA(queryClient, [eventId, data.data.id], data);
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Packages
 */
export const useCreateEventPackage = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateEventPackage>>,
      Omit<CreateEventPackageParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateEventPackageParams,
    Awaited<ReturnType<typeof CreateEventPackage>>
  >(CreateEventPackage, options, {
    domain: "events",
    type: "update",
  });
};
