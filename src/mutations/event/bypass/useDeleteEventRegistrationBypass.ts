import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_REGISTRATION_BYPASS_LIST_QUERY_KEY,
  EVENT_REGISTRATION_BYPASS_QUERY_KEY,
} from "@src/queries";

/**
 * Endpoint to delete a specific event registration bypass.
 * This function allows the removal of a bypass associated with an event registration, identified by the event and bypass IDs.
 * It is intended for use in scenarios where bypasses need to be managed or revoked for event registrations.
 * @name DeleteEventRegistrationBypass
 * @param {string} eventId - The id of the event
 * @param {string} bypassId - The id of the bypass
 * @version 1.2
**/
export interface DeleteEventRegistrationBypassParams extends MutationParams {
  eventId: string;
  bypassId: string;
}

export const DeleteEventRegistrationBypass = async ({
  eventId,
  bypassId,
  adminApiParams,
  queryClient,
}: DeleteEventRegistrationBypassParams): Promise<ConnectedXMResponse<null>> => {
  const adminApi = await GetAdminAPI(adminApiParams);

  const { data } = await adminApi.delete<ConnectedXMResponse<null>>(
    `/events/${eventId}/bypass/${bypassId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_REGISTRATION_BYPASS_LIST_QUERY_KEY(eventId),
    });
    queryClient.removeQueries({
      queryKey: EVENT_REGISTRATION_BYPASS_QUERY_KEY(eventId, bypassId),
    });
  }
  return data;
};

export const useDeleteEventRegistrationBypass = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteEventRegistrationBypass>>,
      Omit<
        DeleteEventRegistrationBypassParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteEventRegistrationBypassParams,
    Awaited<ReturnType<typeof DeleteEventRegistrationBypass>>
  >(DeleteEventRegistrationBypass, options, {
    domain: "events",
    type: "update",
  });
};