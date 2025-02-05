import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";

/**
 * Endpoint to resend the registration confirmation email for a specific event attendee.
 * This function allows the system to trigger a resend of the confirmation email to an attendee of a specified event.
 * It is useful in scenarios where the initial registration email was not received or needs to be sent again.
 * @name ResendRegistrationConfirmationEmail
 * @param {string} eventId - The id of the event
 * @param {string} accountId - The id of the account
 * @version 1.2
 **/

export interface ResendRegistrationConfirmationEmailParams
  extends MutationParams {
  eventId: string;
  accountId: string;
}

export const ResendRegistrationConfirmationEmail = async ({
  eventId,
  accountId,
  adminApiParams,
  queryClient,
}: ResendRegistrationConfirmationEmailParams): Promise<
  ConnectedXMResponse<null>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.post<ConnectedXMResponse<null>>(
    `/events/${eventId}/attendees/${accountId}/resendEmail`
  );
  if (queryClient && data.status === "ok") {
    //do nothing currently
  }
  return data;
};

export const useResendRegistrationConfirmationEmail = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof ResendRegistrationConfirmationEmail>>,
      Omit<
        ResendRegistrationConfirmationEmailParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    ResendRegistrationConfirmationEmailParams,
    Awaited<ReturnType<typeof ResendRegistrationConfirmationEmail>>
  >(ResendRegistrationConfirmationEmail, options, {
    domain: "events",
    type: "update",
  });
};