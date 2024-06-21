import ConnectedXM, { ConnectedXMResponse } from "@context/api/ConnectedXM";
import useConnectedMutation from "@context/mutations/useConnectedMutation";
import { SET_EVENT_FAQ_SECTION_TRANSLATION_QUERY_DATA } from "@context/queries/events/faqs/translations/useGetEventFAQSectionTranslation";
import { EVENT_FAQ_SECTION_TRANSLATIONS_QUERY_KEY } from "@context/queries/events/faqs/translations/useGetEventFAQSectionTranslations";
import { FAQSectionTranslation } from "@interfaces";
import { useQueryClient } from "@tanstack/react-query";

interface CreateEventFAQSectionTranslationProps {
  eventId: string;
  sectionId: string;
  locale: string;
  autoTranslate?: boolean;
}

export const CreateEventFAQSectionTranslation = async ({
  eventId,
  sectionId,
  locale,
  autoTranslate,
}: CreateEventFAQSectionTranslationProps): Promise<
  ConnectedXMResponse<FAQSectionTranslation>
> => {
  const connectedXM = await ConnectedXM();

  const { data } = await connectedXM.post(
    `/events/${eventId}/faqs/${sectionId}/translations`,
    {
      locale,
      autoTranslate,
    }
  );

  return data;
};

export const useCreateEventFAQSectionTranslation = (
  eventId: string,
  sectionId: string
) => {
  const queryClient = useQueryClient();

  return useConnectedMutation<
    Omit<CreateEventFAQSectionTranslationProps, "eventId" | "sectionId">
  >(
    (props) =>
      CreateEventFAQSectionTranslation({ eventId, sectionId, ...props }),
    {
      onSuccess: (
        response: Awaited<ReturnType<typeof CreateEventFAQSectionTranslation>>
      ) => {
        queryClient.invalidateQueries(
          EVENT_FAQ_SECTION_TRANSLATIONS_QUERY_KEY(eventId, sectionId)
        );

        SET_EVENT_FAQ_SECTION_TRANSLATION_QUERY_DATA(
          queryClient,
          [eventId, sectionId, response.data?.locale],
          response
        );
      },
    },
    "Hold on while we create a translation..."
  );
};

export default useCreateEventFAQSectionTranslation;
