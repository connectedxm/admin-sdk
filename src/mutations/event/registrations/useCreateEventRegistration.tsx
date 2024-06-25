import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, Registration } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_REGISTRATIONS_QUERY_KEY,
  EVENT_REGISTRATION_COUNTS_QUERY_KEY,
  SET_EVENT_REGISTRATION_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Event-Registrations
 */
export interface CreateEventRegistrationParams extends MutationParams {
  eventId: string;
  accountId: string;
}

/**
 * @category Methods
 * @group Event-Registrations
 */
export const CreateEventRegistration = async ({
  eventId,
  accountId,
  adminApiParams,
  queryClient,
}: CreateEventRegistrationParams): Promise<
  ConnectedXMResponse<Registration>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<Registration>>(
    `/events/${eventId}/registrations`,
    {
      accountId,
    }
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_REGISTRATIONS_QUERY_KEY(eventId),
    });
    queryClient.invalidateQueries({
      queryKey: EVENT_REGISTRATION_COUNTS_QUERY_KEY(eventId),
    });
    SET_EVENT_REGISTRATION_QUERY_DATA(
      queryClient,
      [eventId, data.data.id],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Registrations
 */
export const useCreateEventRegistration = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateEventRegistration>>,
      Omit<CreateEventRegistrationParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateEventRegistrationParams,
    Awaited<ReturnType<typeof CreateEventRegistration>>
  >(CreateEventRegistration, options);
};
