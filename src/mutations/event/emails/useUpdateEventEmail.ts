import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMResponse,
  EventEmail,
  EventEmailType,
} from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EventEmailUpdateInputs } from "@src/params";
import { SET_EVENT_EMAIL_QUERY_DATA } from "@src/queries";

/**
 * Endpoint to update an event email with specified details.
 * This function allows updating the email associated with a specific event by providing the event ID, email type, and update inputs.
 * It is designed for applications that need to modify event-related email content or settings.
 * @name UpdateEventEmail
 * @param {string} eventId - The id of the event
 * @param {EventEmailType} type - The type of the event email
 * @param {EventEmailUpdateInputs} eventEmail - The inputs for updating the event email
 * @version 1.2
 **/

export interface UpdateEventEmailParams extends MutationParams {
  eventId: string;
  type: EventEmailType;
  eventEmail: EventEmailUpdateInputs;
}

export const UpdateEventEmail = async ({
  eventId,
  type,
  eventEmail,
  adminApiParams,
  queryClient,
}: UpdateEventEmailParams): Promise<ConnectedXMResponse<EventEmail>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.put<ConnectedXMResponse<EventEmail>>(
    `/events/${eventId}/emails/${type}`,
    eventEmail
  );

  if (queryClient && data.status === "ok") {
    SET_EVENT_EMAIL_QUERY_DATA(queryClient, [eventId, type], data);
  }
  return data;
};

export const useUpdateEventEmail = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateEventEmail>>,
      Omit<UpdateEventEmailParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateEventEmailParams,
    Awaited<ReturnType<typeof UpdateEventEmail>>
  >(UpdateEventEmail, options, {
    domain: "events",
    type: "update",
  });
};