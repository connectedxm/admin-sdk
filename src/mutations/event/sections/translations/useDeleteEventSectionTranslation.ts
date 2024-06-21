import ConnectedXM from "@context/api/ConnectedXM";
import useConnectedMutation from "@context/mutations/useConnectedMutation";
import { EVENT_SECTION_TRANSLATION_QUERY_KEY } from "@context/queries/events/sections/translations/useGetEventSectionTranslation";
import { EVENT_SECTION_TRANSLATIONS_QUERY_KEY } from "@context/queries/events/sections/translations/useGetEventSectionTranslations";
import { useQueryClient } from "@tanstack/react-query";

interface DeleteEventSectionTranslationProps {
  eventId: string;
  sectionId: string;
  locale: string;
}

export const DeleteEventSectionTranslation = async ({
  eventId,
  sectionId,
  locale,
}: DeleteEventSectionTranslationProps) => {
  const connectedXM = await ConnectedXM();

  const { data } = await connectedXM.delete(
    `/events/${eventId}/sections/${sectionId}/translations/${locale}`
  );

  return data;
};

export const useDeleteEventSectionTranslation = (
  eventId: string,
  sectionId: string,
  locale: string
) => {
  const queryClient = useQueryClient();
  return useConnectedMutation(DeleteEventSectionTranslation, {
    onSuccess: () => {
      queryClient.invalidateQueries(
        EVENT_SECTION_TRANSLATIONS_QUERY_KEY(eventId, sectionId)
      );
      queryClient.invalidateQueries(
        EVENT_SECTION_TRANSLATION_QUERY_KEY(eventId, sectionId, locale)
      );
    },
  });
};

export default useDeleteEventSectionTranslation;
