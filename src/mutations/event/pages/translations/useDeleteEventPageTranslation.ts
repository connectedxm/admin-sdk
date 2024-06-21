import ConnectedXM from "@context/api/ConnectedXM";
import useConnectedMutation from "@context/mutations/useConnectedMutation";
import { EVENT_PAGE_TRANSLATION_QUERY_KEY } from "@context/queries/events/pages/translations/useGetEventPageTranslation";
import { EVENT_PAGE_TRANSLATIONS_QUERY_KEY } from "@context/queries/events/pages/translations/useGetEventPageTranslations";
import { useQueryClient } from "@tanstack/react-query";

interface DeleteEventPageTranslationProps {
  eventId: string;
  pageId: string;
  locale: string;
}

export const DeleteEventPageTranslation = async ({
  eventId,
  pageId,
  locale,
}: DeleteEventPageTranslationProps) => {
  const connectedXM = await ConnectedXM();

  const { data } = await connectedXM.delete(
    `/events/${eventId}/pages/${pageId}/translations/${locale}`
  );

  return data;
};

export const useDeleteEventPageTranslation = (
  eventId: string,
  pageId: string,
  locale: string
) => {
  const queryClient = useQueryClient();
  return useConnectedMutation(DeleteEventPageTranslation, {
    onSuccess: () => {
      queryClient.invalidateQueries(
        EVENT_PAGE_TRANSLATIONS_QUERY_KEY(eventId, pageId)
      );
      queryClient.invalidateQueries(
        EVENT_PAGE_TRANSLATION_QUERY_KEY(eventId, pageId, locale)
      );
    },
  });
};

export default useDeleteEventPageTranslation;
