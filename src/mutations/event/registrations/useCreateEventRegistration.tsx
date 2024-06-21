import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../../useConnectedMutation";
import { useQueryClient } from "@tanstack/react-query";
import { SET_EVENT_REGISTRATION_QUERY_DATA } from "@context/queries/events/registrations/useGetEventRegistration";
import { EVENT_REGISTRATION_COUNTS_QUERY_KEY } from "@context/queries/events/registrations/useGetEventRegistrationCounts";
import { EVENT_REGISTRATIONS_QUERY_KEY } from "@context/queries/events/registrations/useGetEventRegistrations";
import { Registration } from "@interfaces";

interface CreateEventRegistrationParams {
  eventId: string;
  accountId: string;
}

export const CreateEventRegistration = async ({
  eventId,
  accountId,
}: CreateEventRegistrationParams): Promise<
  ConnectedXMResponse<Registration>
> => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.post(`/events/${eventId}/registrations`, {
    accountId,
  });
  return data;
};

export const useCreateEventRegistration = (eventId: string) => {
  const queryClient = useQueryClient();

  return useConnectedMutation<string>(
    (accountId: string) => CreateEventRegistration({ eventId, accountId }),
    {
      onSuccess: (
        response: Awaited<ReturnType<typeof CreateEventRegistration>>
      ) => {
        queryClient.invalidateQueries(EVENT_REGISTRATIONS_QUERY_KEY(eventId));
        queryClient.invalidateQueries(
          EVENT_REGISTRATION_COUNTS_QUERY_KEY(eventId)
        );
        SET_EVENT_REGISTRATION_QUERY_DATA(
          queryClient,
          [eventId, response.data.id],
          response
        );
      },
    }
  );
};

export default useCreateEventRegistration;
