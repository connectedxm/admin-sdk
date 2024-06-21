import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "@context/mutations/useConnectedMutation";
import { Registration, RegistrationStatus } from "@interfaces";
import { useQueryClient } from "@tanstack/react-query";
import { EVENT_REGISTRATIONS_QUERY_KEY } from "@context/queries/events/registrations/useGetEventRegistrations";
import { SET_EVENT_REGISTRATION_QUERY_DATA } from "@context/queries/events/registrations/useGetEventRegistration";

interface UpdateEventRegistrationParams {
  eventId: string;
  registrationId: string;
  registration: Registration;
}

export const UpdateEventRegistration = async ({
  eventId,
  registrationId,
  registration,
}: UpdateEventRegistrationParams): Promise<
  ConnectedXMResponse<Registration>
> => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.put(
    `/events/${eventId}/registrations/${registrationId}`,
    registration
  );
  return data;
};

export const useUpdateEventRegistration = (
  eventId: string,
  registrationId: string
) => {
  const queryClient = useQueryClient();

  return useConnectedMutation(
    (registration: Registration) =>
      UpdateEventRegistration({ eventId, registrationId, registration }),
    {
      onSuccess: (
        response: Awaited<ReturnType<typeof UpdateEventRegistration>>
      ) => {
        SET_EVENT_REGISTRATION_QUERY_DATA(
          queryClient,
          [eventId, registrationId],
          response
        );
        queryClient.invalidateQueries(EVENT_REGISTRATIONS_QUERY_KEY(eventId));
      },
    }
  );
};

export default useUpdateEventRegistration;
