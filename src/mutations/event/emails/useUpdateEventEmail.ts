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
 * @category Params
 * @group Event-Emails
 */
export interface UpdateEventEmailParams extends MutationParams {
  eventId: string;
  type: EventEmailType;
  eventEmail: EventEmailUpdateInputs;
}

/**
 * @category Methods
 * @group Event-Emails
 */
export const UpdateEventEmail = async ({
  eventId,
  type,
  eventEmail,
  adminApiParams,
  queryClient,
}: UpdateEventEmailParams): Promise<ConnectedXMResponse<EventEmail>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put<ConnectedXMResponse<EventEmail>>(
    `/events/${eventId}/emails/${type}`,
    eventEmail
  );

  if (queryClient && data.status === "ok") {
    SET_EVENT_EMAIL_QUERY_DATA(queryClient, [eventId, type], data);
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Emails
 */
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
  >(UpdateEventEmail, options);
};
