import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../../useConnectedMutation";

interface ResendEventRegistrationConfirmationEmailParams {
  eventId: string;
  registrationId: string;
}

export const ResendEventRegistrationConfirmationEmail = async ({
  eventId,
  registrationId,
}: ResendEventRegistrationConfirmationEmailParams): Promise<
  ConnectedXMResponse<null>
> => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.post(
    `/events/${eventId}/registrations/${registrationId}/resendEmail`
  );
  return data;
};

export const useResendEventRegistrationConfirmationEmail = (
  eventId: string,
  registrationId: string
) => {
  return useConnectedMutation(() =>
    ResendEventRegistrationConfirmationEmail({ eventId, registrationId })
  );
};

export default useResendEventRegistrationConfirmationEmail;
