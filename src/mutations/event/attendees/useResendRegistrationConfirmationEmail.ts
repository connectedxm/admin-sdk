import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";

/**
 * @category Params
 * @group Event-Attendees
 */
export interface ResendRegistrationConfirmationEmailParams
  extends MutationParams {
  eventId: string;
  accountId: string;
}

/**
 * @category Methods
 * @group Event-Attendees
 */
export const ResendRegistrationConfirmationEmail = async ({
  eventId,
  accountId,
  adminApiParams,
  queryClient,
}: ResendRegistrationConfirmationEmailParams): Promise<
  ConnectedXMResponse<null>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<null>>(
    `/events/${eventId}/attendees/${accountId}/resendEmail`
  );
  if (queryClient && data.status === "ok") {
    //do nothing currently
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Attendees
 */
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
