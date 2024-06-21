import ConnectedXM, { ConnectedXMResponse } from "@context/api/ConnectedXM";
import useConnectedMutation from "@context/mutations/useConnectedMutation";
import { SET_EVENT_SECTION_TRANSLATION_QUERY_DATA } from "@context/queries/events/sections/translations/useGetEventSectionTranslation";
import { EVENT_SECTION_TRANSLATIONS_QUERY_KEY } from "@context/queries/events/sections/translations/useGetEventSectionTranslations";
import { RegistrationSectionTranslation } from "@interfaces";
import { useQueryClient } from "@tanstack/react-query";

interface CreateEventSectionTranslationProps {
  eventId: string;
  sectionId: string;
  locale: string;
  autoTranslate?: boolean;
}

export const CreateEventSectionTranslation = async ({
  eventId,
  sectionId,
  locale,
  autoTranslate,
}: CreateEventSectionTranslationProps): Promise<
  ConnectedXMResponse<RegistrationSectionTranslation>
> => {
  const connectedXM = await ConnectedXM();

  const { data } = await connectedXM.post(
    `/events/${eventId}/sections/${sectionId}/translations`,
    {
      locale,
      autoTranslate,
    }
  );

  return data;
};

export const useCreateEventSectionTranslation = (
  eventId: string,
  sectionId: string
) => {
  const queryClient = useQueryClient();

  return useConnectedMutation<
    Omit<CreateEventSectionTranslationProps, "eventId" | "sectionId">
  >(
    (props) => CreateEventSectionTranslation({ eventId, sectionId, ...props }),
    {
      onSuccess: (
        response: Awaited<ReturnType<typeof CreateEventSectionTranslation>>
      ) => {
        queryClient.invalidateQueries(
          EVENT_SECTION_TRANSLATIONS_QUERY_KEY(eventId, sectionId)
        );
        SET_EVENT_SECTION_TRANSLATION_QUERY_DATA(
          queryClient,
          [eventId, sectionId, response.data?.locale],
          response
        );
      },
    },
    "Hold on while we create a translation..."
  );
};

export default useCreateEventSectionTranslation;
