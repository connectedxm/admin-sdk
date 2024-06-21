import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../../useConnectedMutation";
import { useQueryClient } from "@tanstack/react-query";
import { EVENT_REGISTRATION_QUERY_KEY } from "@context/queries/events/registrations/useGetEventRegistration";
import { EVENT_REGISTRATION_COUNTS_QUERY_KEY } from "@context/queries/events/registrations/useGetEventRegistrationCounts";
import { EVENT_REGISTRATIONS_QUERY_KEY } from "@context/queries/events/registrations/useGetEventRegistrations";
import { Registration } from "@interfaces";
import { useRouter } from "next/router";

interface DeleteEventRegistrationParams {
  eventId: string;
  registrationId: string;
}

export const DeleteEventRegistration = async ({
  eventId,
  registrationId,
}: DeleteEventRegistrationParams): Promise<
  ConnectedXMResponse<Registration>
> => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.delete(
    `/events/${eventId}/registrations/${registrationId}`
  );
  return data;
};

export const useDeleteEventRegistration = (
  eventId: string,
  registrationId: string
) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useConnectedMutation<string>(
    () => DeleteEventRegistration({ eventId, registrationId }),
    {
      onSuccess: (
        response: Awaited<ReturnType<typeof DeleteEventRegistration>>
      ) => {
        router.push(`/events/${eventId}/registrations`);
        queryClient.invalidateQueries(EVENT_REGISTRATIONS_QUERY_KEY(eventId));
        queryClient.invalidateQueries(
          EVENT_REGISTRATION_COUNTS_QUERY_KEY(eventId)
        );
        queryClient.removeQueries(
          EVENT_REGISTRATION_QUERY_KEY(eventId, registrationId)
        );
      },
    }
  );
};

export default useDeleteEventRegistration;
