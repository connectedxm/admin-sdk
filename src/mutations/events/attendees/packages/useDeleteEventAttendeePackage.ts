import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EVENT_ATTENDEE_PACKAGES_QUERY_KEY } from "@src/queries";

/**
 * @category Params
 * @group Event-Attendee-Packages
 */
export interface DeleteEventAttendeePackageParams extends MutationParams {
  eventId: string;
  accountId: string;
  packageId: string;
}

/**
 * @category Methods
 * @group Event-Attendee-Packages
 */
export const DeleteEventAttendeePackage = async ({
  eventId,
  accountId,
  packageId,
  adminApiParams,
  queryClient,
}: DeleteEventAttendeePackageParams): Promise<ConnectedXMResponse<void>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<void>>(
    `/events/${eventId}/attendees/${accountId}/packages/${packageId}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_ATTENDEE_PACKAGES_QUERY_KEY(eventId, accountId),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Attendee-Packages
 */
export const useDeleteEventAttendeePackage = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteEventAttendeePackage>>,
      Omit<DeleteEventAttendeePackageParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteEventAttendeePackageParams,
    Awaited<ReturnType<typeof DeleteEventAttendeePackage>>
  >(DeleteEventAttendeePackage, options);
};
