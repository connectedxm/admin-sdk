import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../../useConnectedMutation";
import { EventRegistrationBypass } from "@interfaces";
import { useQueryClient } from "@tanstack/react-query";

import { EVENT_REGISTRATION_BYPASS_LIST_QUERY_KEY } from "@context/queries/events/bypass/useGetEventRegistrationBypassList";
import { SET_EVENT_REGISTRATION_BYPASS_QUERY_DATA } from "@context/queries/events/bypass/useGetEventRegistrationBypass";

interface CreateEventRegistrationBypassParams {
  eventId: string;
  page: EventRegistrationBypass;
}

export const CreateEventRegistrationBypass = async ({
  eventId,
  page,
}: CreateEventRegistrationBypassParams): Promise<
  ConnectedXMResponse<EventRegistrationBypass>
> => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.post(`/events/${eventId}/bypass`, page);
  return data;
};

export const useCreateEventRegistrationBypass = (eventId: string) => {
  const queryClient = useQueryClient();

  return useConnectedMutation<EventRegistrationBypass>(
    (page: EventRegistrationBypass) =>
      CreateEventRegistrationBypass({ eventId, page }),
    {
      onSuccess: (
        response: Awaited<ReturnType<typeof CreateEventRegistrationBypass>>
      ) => {
        queryClient.invalidateQueries(
          EVENT_REGISTRATION_BYPASS_LIST_QUERY_KEY(eventId)
        );
        SET_EVENT_REGISTRATION_BYPASS_QUERY_DATA(
          queryClient,
          [eventId, response.data.id],
          response
        );
      },
    }
  );
};

export default useCreateEventRegistrationBypass;
