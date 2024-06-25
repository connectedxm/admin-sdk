import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import {
  MutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";

/**
 * @category Params
 * @group Event-Registrations
 */
export interface ResendEventRegistrationConfirmationEmailParams
  extends MutationParams {
  eventId: string;
  registrationId: string;
}

/**
 * @category Methods
 * @group Event-Registrations
 */
export const ResendEventRegistrationConfirmationEmail = async ({
  eventId,
  registrationId,
  adminApiParams,
  queryClient,
}: ResendEventRegistrationConfirmationEmailParams): Promise<
  ConnectedXMResponse<null>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<null>>(
    `/events/${eventId}/registrations/${registrationId}/resendEmail`
  );
  if (queryClient && data.status === "ok") {
    //do nothing currently
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Registrations
 */
export const useResendEventRegistrationConfirmationEmail = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof ResendEventRegistrationConfirmationEmail>>,
      Omit<
        ResendEventRegistrationConfirmationEmailParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    ResendEventRegistrationConfirmationEmailParams,
    Awaited<ReturnType<typeof ResendEventRegistrationConfirmationEmail>>
  >(ResendEventRegistrationConfirmationEmail, options);
};
