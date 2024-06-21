import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "@context/mutations/useConnectedMutation";
import { EventEmail, EventEmailType } from "@interfaces";
import { useQueryClient } from "@tanstack/react-query";
import { SET_EVENT_EMAIL_QUERY_DATA } from "@context/queries/events/emails/useGetEventEmail";

interface UpdateEventEmailParams {
  eventId: string;
  type: EventEmailType;
  eventEmail: EventEmail;
}

export const UpdateEventEmail = async ({
  eventId,
  type,
  eventEmail,
}: UpdateEventEmailParams): Promise<ConnectedXMResponse<EventEmail>> => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.put(
    `/events/${eventId}/emails/${type}`,
    eventEmail
  );
  return data;
};

export const useUpdateEventEmail = (eventId: string, type: EventEmailType) => {
  const queryClient = useQueryClient();

  return useConnectedMutation<EventEmail>(
    (eventEmail: EventEmail) => UpdateEventEmail({ eventId, type, eventEmail }),
    {
      onSuccess: (response: Awaited<ReturnType<typeof UpdateEventEmail>>) => {
        SET_EVENT_EMAIL_QUERY_DATA(queryClient, [eventId, type], response);
      },
    }
  );
};

export default useUpdateEventEmail;
