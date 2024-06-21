import ConnectedXM, { ConnectedXMResponse } from "@context/api/ConnectedXM";
import useConnectedMutation from "@context/mutations/useConnectedMutation";
import { SET_EVENT_PAGE_TRANSLATION_QUERY_DATA } from "@context/queries/events/pages/translations/useGetEventPageTranslation";
import { EVENT_PAGE_TRANSLATIONS_QUERY_KEY } from "@context/queries/events/pages/translations/useGetEventPageTranslations";
import { EventPageTranslation } from "@interfaces";
import { useQueryClient } from "@tanstack/react-query";

interface CreateEventPageTranslationProps {
  eventId: string;
  pageId: string;
  locale: string;
  autoTranslate?: boolean;
}

export const CreateEventPageTranslation = async ({
  eventId,
  pageId,
  locale,
  autoTranslate,
}: CreateEventPageTranslationProps): Promise<
  ConnectedXMResponse<EventPageTranslation>
> => {
  const connectedXM = await ConnectedXM();

  const { data } = await connectedXM.post(
    `/events/${eventId}/pages/${pageId}/translations`,
    {
      locale,
      autoTranslate,
    }
  );

  return data;
};

export const useCreateEventPageTranslation = (
  eventId: string,
  pageId: string
) => {
  const queryClient = useQueryClient();

  return useConnectedMutation<
    Omit<CreateEventPageTranslationProps, "eventId" | "pageId">
  >(
    (props) => CreateEventPageTranslation({ eventId, pageId, ...props }),
    {
      onSuccess: (
        response: Awaited<ReturnType<typeof CreateEventPageTranslation>>
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
    },
    "Hold on while we create a translation..."
  );
};

export default useCreateEventPageTranslation;
