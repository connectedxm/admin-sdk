import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, AttendeePackage } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EventAttendeePackageUpdateInputs } from "@src/params";
import { EVENT_ATTENDEE_PACKAGES_QUERY_KEY } from "@src/queries";

/**
 * @category Params
 * @group Event-Attendee-Packages
 */
export interface UpdateEventAttendeePackageParams extends MutationParams {
  eventId: string;
  accountId: string;
  packageId: string;
  package: EventAttendeePackageUpdateInputs;
}

/**
 * @category Methods
 * @group Event-Attendee-Packages
 */
export const UpdateEventAttendeePackage = async ({
  eventId,
  accountId,
  packageId,
  package: packageData,
  adminApiParams,
  queryClient,
}: UpdateEventAttendeePackageParams): Promise<
  ConnectedXMResponse<AttendeePackage>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put<ConnectedXMResponse<AttendeePackage>>(
    `/events/${eventId}/attendees/${accountId}/packages/${packageId}`,
    packageData
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
export const useUpdateEventAttendeePackage = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateEventAttendeePackage>>,
      Omit<UpdateEventAttendeePackageParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateEventAttendeePackageParams,
    Awaited<ReturnType<typeof UpdateEventAttendeePackage>>
  >(UpdateEventAttendeePackage, options, {
    domain: "events",
    type: "update",
  });
};
