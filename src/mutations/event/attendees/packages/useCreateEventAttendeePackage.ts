import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, AttendeePackage } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EventAttendeePackageCreateInputs } from "@src/params";
import { EVENT_ATTENDEE_PACKAGES_QUERY_KEY } from "@src/queries";

/**
 * @category Params
 * @group Event-Attendee-Packages
 */
export interface CreateEventAttendeePackageParams extends MutationParams {
  eventId: string;
  accountId: string;
  package: EventAttendeePackageCreateInputs;
}

/**
 * @category Methods
 * @group Event-Attendee-Packages
 */
export const CreateEventAttendeePackage = async ({
  eventId,
  accountId,
  package: packageData,
  adminApiParams,
  queryClient,
}: CreateEventAttendeePackageParams): Promise<
  ConnectedXMResponse<AttendeePackage>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<AttendeePackage>>(
    `/events/${eventId}/attendees/${accountId}/packages`,
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
export const useCreateEventAttendeePackage = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateEventAttendeePackage>>,
      Omit<CreateEventAttendeePackageParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateEventAttendeePackageParams,
    Awaited<ReturnType<typeof CreateEventAttendeePackage>>
  >(CreateEventAttendeePackage, options);
};
