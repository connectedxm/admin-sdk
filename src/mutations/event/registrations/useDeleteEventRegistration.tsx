import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, Registration } from "@src/interfaces";
import {
  MutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_REGISTRATIONS_QUERY_KEY,
  EVENT_REGISTRATION_COUNTS_QUERY_KEY,
  EVENT_REGISTRATION_QUERY_KEY,
} from "@src/queries";

/**
 * @category Params
 * @group Event-Registrations
 */
export interface DeleteEventRegistrationParams extends MutationParams {
  eventId: string;
  registrationId: string;
}

/**
 * @category Methods
 * @group Event-Registrations
 */
export const DeleteEventRegistration = async ({
  eventId,
  registrationId,
  adminApiParams,
  queryClient,
}: DeleteEventRegistrationParams): Promise<
  ConnectedXMResponse<Registration>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<Registration>>(
    `/events/${eventId}/registrations/${registrationId}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_REGISTRATIONS_QUERY_KEY(eventId),
    });
    queryClient.invalidateQueries({
      queryKey: EVENT_REGISTRATION_COUNTS_QUERY_KEY(eventId),
    });
    queryClient.removeQueries({
      queryKey: EVENT_REGISTRATION_QUERY_KEY(eventId, registrationId),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Registrations
 */
export const useDeleteEventRegistration = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof DeleteEventRegistration>>,
      Omit<DeleteEventRegistrationParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteEventRegistrationParams,
    Awaited<ReturnType<typeof DeleteEventRegistration>>
  >(DeleteEventRegistration, options);
};
