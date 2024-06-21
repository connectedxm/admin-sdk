import ConnectedXM from "@context/api/ConnectedXM";
import useConnectedMutation from "@context/mutations/useConnectedMutation";
import { SET_EVENT_PAGE_TRANSLATION_QUERY_DATA } from "@context/queries/events/pages/translations/useGetEventPageTranslation";
import { EVENT_PAGE_TRANSLATIONS_QUERY_KEY } from "@context/queries/events/pages/translations/useGetEventPageTranslations";
import { EventPageTranslation } from "@interfaces";
import { useQueryClient } from "@tanstack/react-query";

interface UpdateEventPageTranslationProps {
  eventId: string;
  pageId: string;
  pageTranslation: EventPageTranslation;
}

export const UpdateEventPageTranslation = async ({
  eventId,
  pageId,
  pageTranslation,
}: UpdateEventPageTranslationProps) => {
  const connectedXM = await ConnectedXM();

  const { locale, ...body } = pageTranslation;

  const { data } = await connectedXM.put(
    `/events/${eventId}/pages/${pageId}/translations/${pageTranslation.locale}`,
    body
  );

  return data;
};

export const useUpdateEventPageTranslation = (
  eventId: string,
  pageId: string
) => {
  const queryClient = useQueryClient();
  return useConnectedMutation<EventPageTranslation>(
    (pageTranslation: EventPageTranslation) =>
      UpdateEventPageTranslation({
        eventId,
        pageId,
        pageTranslation,
      }),
    {
      onSuccess: (
        response: Awaited<ReturnType<typeof UpdateEventPageTranslation>>
      ) => {
        queryClient.invalidateQueries(
          EVENT_PAGE_TRANSLATIONS_QUERY_KEY(eventId, pageId)
        );
        SET_EVENT_PAGE_TRANSLATION_QUERY_DATA(
          queryClient,
          [eventId, pageId, response.data?.locale],
          response
        );
      },
    }
  );
};

export default useUpdateEventPageTranslation;
