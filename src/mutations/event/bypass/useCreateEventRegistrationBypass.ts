import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, RegistrationBypass } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EventRegistrationBypassCreateInputs } from "@src/params";
import {
  EVENT_REGISTRATION_BYPASS_LIST_QUERY_KEY,
  SET_EVENT_REGISTRATION_BYPASS_QUERY_DATA,
} from "@src/queries";

/**
 * Endpoint to create a registration bypass for a specific event.
 * This function allows the creation of a registration bypass, which can be used to manage event registrations more flexibly.
 * It is designed for applications that require dynamic control over event registration processes.
 * @name CreateEventRegistrationBypass
 * @param {string} eventId - The id of the event
 * @param {EventRegistrationBypassCreateInputs} bypass - The inputs for creating a registration bypass
 * @version 1.2
 **/

export interface CreateEventRegistrationBypassParams extends MutationParams {
  eventId: string;
  bypass: EventRegistrationBypassCreateInputs;
}

export const CreateEventRegistrationBypass = async ({
  eventId,
  bypass,
  adminApiParams,
  queryClient,
}: CreateEventRegistrationBypassParams): Promise<
  ConnectedXMResponse<RegistrationBypass>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.post<ConnectedXMResponse<RegistrationBypass>>(
    `/events/${eventId}/bypass`,
    bypass
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_REGISTRATION_BYPASS_LIST_QUERY_KEY(eventId),
    });
    SET_EVENT_REGISTRATION_BYPASS_QUERY_DATA(
      queryClient,
      [eventId, eventId],
      data
    );
  }
  return data;
}

export const useCreateEventRegistrationBypass = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateEventRegistrationBypass>>,
      Omit<
        CreateEventRegistrationBypassParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateEventRegistrationBypassParams,
    Awaited<ReturnType<typeof CreateEventRegistrationBypass>>
  >(CreateEventRegistrationBypass, options, {
    domain: "events",
    type: "update",
  });
};