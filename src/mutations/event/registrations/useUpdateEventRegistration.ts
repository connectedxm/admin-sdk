import { GetAdminAPI } from "@src/AdminAPI";
import { Registration, ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  SET_EVENT_REGISTRATION_QUERY_DATA,
  EVENT_REGISTRATIONS_QUERY_KEY,
} from "@src/queries";

/**
 * @category Params
 * @group Event-Registrations
 */
export interface UpdateEventRegistrationParams extends MutationParams {
  eventId: string;
  registrationId: string;
  //TODO: missing interface and validation
  registration: Registration;
}

/**
 * @category Methods
 * @group Event-Registrations
 */
export const UpdateEventRegistration = async ({
  eventId,
  registrationId,
  registration,
  adminApiParams,
  queryClient,
}: UpdateEventRegistrationParams): Promise<
  ConnectedXMResponse<Registration>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put(
    `/events/${eventId}/registrations/${registrationId}`,
    registration
  );
  if (queryClient && data.status === "ok") {
    SET_EVENT_REGISTRATION_QUERY_DATA(
      queryClient,
      [eventId, registrationId],
      data
    );
    queryClient.invalidateQueries({
      queryKey: EVENT_REGISTRATIONS_QUERY_KEY(eventId),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Registrations
 */
export const useUpdateEventRegistration = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateEventRegistration>>,
      Omit<UpdateEventRegistrationParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateEventRegistrationParams,
    Awaited<ReturnType<typeof UpdateEventRegistration>>
  >(UpdateEventRegistration, options);
};
