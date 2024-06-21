import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../../useConnectedMutation";
import { useQueryClient } from "@tanstack/react-query";
import { RegistrationSection } from "@interfaces";
import { EVENT_SECTION_TICKETS_QUERY_KEY } from "@context/queries/events/sections/useGetEventSectionTickets";
import { SET_EVENT_SECTION_QUERY_DATA } from "@context/queries/events/sections/useGetEventSection";

interface RemoveEventSectionTicketParams {
  eventId: string;
  sectionId: string;
  ticketId: string;
}

export const RemoveEventSectionTicket = async ({
  eventId,
  sectionId,
  ticketId,
}: RemoveEventSectionTicketParams): Promise<
  ConnectedXMResponse<RegistrationSection>
> => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.delete(
    `/events/${eventId}/sections/${sectionId}/tickets/${ticketId}`
  );
  return data;
};

export const useRemoveEventSectionTicket = (
  eventId: string,
  sectionId: string
) => {
  const queryClient = useQueryClient();

  return useConnectedMutation<string>(
    (ticketId: string) =>
      RemoveEventSectionTicket({ eventId, sectionId, ticketId }),
    {
      onSuccess: (
        response: Awaited<ReturnType<typeof RemoveEventSectionTicket>>
      ) => {
        queryClient.invalidateQueries(
          EVENT_SECTION_TICKETS_QUERY_KEY(eventId, sectionId)
        );
        SET_EVENT_SECTION_QUERY_DATA(
          queryClient,
          [eventId, sectionId],
          response
        );
      },
    },
    undefined,
    true
  );
};

export default useRemoveEventSectionTicket;
