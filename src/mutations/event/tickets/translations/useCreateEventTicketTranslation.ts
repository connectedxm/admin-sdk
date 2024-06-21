import ConnectedXM, { ConnectedXMResponse } from "@context/api/ConnectedXM";
import useConnectedMutation from "@context/mutations/useConnectedMutation";
import { SET_EVENT_TICKET_TRANSLATION_QUERY_DATA } from "@context/queries/events/tickets/translations/useGetEventTicketTranslation";
import { EVENT_TICKET_TRANSLATIONS_QUERY_KEY } from "@context/queries/events/tickets/translations/useGetEventTicketTranslations";
import { TicketTranslation } from "@interfaces";
import { useQueryClient } from "@tanstack/react-query";

interface CreateEventTicketTranslationProps {
  eventId: string;
  ticketId: string;
  locale: string;
  autoTranslate?: boolean;
}

export const CreateEventTicketTranslation = async ({
  eventId,
  ticketId,
  locale,
  autoTranslate,
}: CreateEventTicketTranslationProps): Promise<
  ConnectedXMResponse<TicketTranslation>
> => {
  const connectedXM = await ConnectedXM();

  const { data } = await connectedXM.post(
    `/events/${eventId}/tickets/${ticketId}/translations`,
    {
      locale,
      autoTranslate,
    }
  );

  return data;
};

export const useCreateEventTicketTranslation = (
  eventId: string,
  ticketId: string
) => {
  const queryClient = useQueryClient();

  return useConnectedMutation<
    Omit<CreateEventTicketTranslationProps, "eventId" | "ticketId">
  >(
    (props) => CreateEventTicketTranslation({ eventId, ticketId, ...props }),
    {
      onSuccess: (
        response: Awaited<ReturnType<typeof CreateEventTicketTranslation>>
      ) => {
        queryClient.invalidateQueries(
          EVENT_TICKET_TRANSLATIONS_QUERY_KEY(eventId, ticketId)
        );
        SET_EVENT_TICKET_TRANSLATION_QUERY_DATA(
          queryClient,
          [eventId, ticketId, response.data?.locale],
          response
        );
      },
    },
    "Hold on while we create a translation..."
  );
};

export default useCreateEventTicketTranslation;
