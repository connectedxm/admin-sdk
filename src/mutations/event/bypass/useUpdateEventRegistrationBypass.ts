import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, RegistrationBypass } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EventRegistrationBypassUpdateInputs } from "@src/params";
import {
  EVENT_REGISTRATION_BYPASS_LIST_QUERY_KEY,
  SET_EVENT_REGISTRATION_BYPASS_QUERY_DATA,
} from "@src/queries";

/**
 * Endpoint to update an event registration bypass.
 * This function allows updating the details of a specific event registration bypass using the event ID and bypass ID.
 * It is designed to be used in applications where modifications to event registration bypasses are required.
 * @name UpdateEventRegistrationBypass
 * @param {string} eventId - The id of the event
 * @param {string} bypassId - The id of the bypass
 * @param {EventRegistrationBypassUpdateInputs} page - The update inputs for the event registration bypass
 * @version 1.2
 **/
export interface UpdateEventRegistrationBypassParams extends MutationParams {
  eventId: string;
  bypassId: string;
  page: EventRegistrationBypassUpdateInputs;
}

export const UpdateEventRegistrationBypass = async ({
  eventId,
  bypassId,
  page,
  adminApiParams,
  queryClient,
}: UpdateEventRegistrationBypassParams): Promise<
  ConnectedXMResponse<RegistrationBypass>
> => {
  if (!bypassId) throw new Error("Page ID Undefined");
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.put<ConnectedXMResponse<RegistrationBypass>>(
    `/events/${eventId}/bypass/${bypassId}`,
    {
      ...page,
      id: undefined,
      createdAt: undefined,
      updatedAt: undefined,
    }
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_REGISTRATION_BYPASS_LIST_QUERY_KEY(eventId),
    });
    SET_EVENT_REGISTRATION_BYPASS_QUERY_DATA(
      queryClient,
      [eventId, bypassId || data.data?.id.toString()],
      data
    );
  }
  return data;
};

export const useUpdateEventRegistrationBypass = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateEventRegistrationBypass>>,
      Omit<
        UpdateEventRegistrationBypassParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateEventRegistrationBypassParams,
    Awaited<ReturnType<typeof UpdateEventRegistrationBypass>>
  >(UpdateEventRegistrationBypass, options, {
    domain: "events",
    type: "update",
  });
};