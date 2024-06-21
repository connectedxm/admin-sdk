import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../../useConnectedMutation";
import { useQueryClient } from "@tanstack/react-query";
import { RegistrationSection } from "@interfaces";
import { EVENT_SECTION_TICKETS_QUERY_KEY } from "@context/queries/events/sections/useGetEventSectionTickets";
import { SET_EVENT_SECTION_QUERY_DATA } from "@context/queries/events/sections/useGetEventSection";

interface AddEventSectionTicketParams {
  eventId: string;
  sectionId: string;
  ticketId: string;
}

export const AddEventSectionTicket = async ({
  eventId,
  sectionId,
  ticketId,
}: AddEventSectionTicketParams): Promise<
  ConnectedXMResponse<RegistrationSection>
> => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.post(
    `/events/${eventId}/sections/${sectionId}/tickets/${ticketId}`
  );
  return data;
};

export const useAddEventSectionTicket = (
  eventId: string,
  sectionId: string
) => {
  const queryClient = useQueryClient();

  return useConnectedMutation<string>(
    (ticketId: string) =>
      AddEventSectionTicket({ eventId, sectionId, ticketId }),
    {
      onSuccess: (
        response: Awaited<ReturnType<typeof AddEventSectionTicket>>
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
    }
  );
};

export default useAddEventSectionTicket;
