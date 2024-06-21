import ConnectedXM from "@context/api/ConnectedXM";
import useConnectedMutation from "@context/mutations/useConnectedMutation";
import { EVENT_FAQ_SECTION_TRANSLATION_QUERY_KEY } from "@context/queries/events/faqs/translations/useGetEventFAQSectionTranslation";
import { EVENT_FAQ_SECTION_TRANSLATIONS_QUERY_KEY } from "@context/queries/events/faqs/translations/useGetEventFAQSectionTranslations";
import { useQueryClient } from "@tanstack/react-query";

interface DeleteEventFAQSectionTranslationProps {
  eventId: string;
  sectionId: string;
  locale: string;
}

export const DeleteEventFAQSectionTranslation = async ({
  eventId,
  sectionId,
  locale,
}: DeleteEventFAQSectionTranslationProps) => {
  const connectedXM = await ConnectedXM();

  const { data } = await connectedXM.delete(
    `/events/${eventId}/faqs/${sectionId}/translations/${locale}`
  );

  return data;
};

export const useDeleteEventFAQSectionTranslation = (
  eventId: string,
  sectionId: string,
  locale: string
) => {
  const queryClient = useQueryClient();
  return useConnectedMutation(DeleteEventFAQSectionTranslation, {
    onSuccess: () => {
      queryClient.invalidateQueries(
        EVENT_FAQ_SECTION_TRANSLATIONS_QUERY_KEY(eventId, sectionId)
      );
      queryClient.invalidateQueries(
        EVENT_FAQ_SECTION_TRANSLATION_QUERY_KEY(eventId, sectionId, locale)
      );
    },
  });
};

export default useDeleteEventFAQSectionTranslation;
