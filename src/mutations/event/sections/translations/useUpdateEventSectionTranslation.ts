import ConnectedXM from "@context/api/ConnectedXM";
import useConnectedMutation from "@context/mutations/useConnectedMutation";
import { SET_EVENT_SECTION_TRANSLATION_QUERY_DATA } from "@context/queries/events/sections/translations/useGetEventSectionTranslation";
import { EVENT_SECTION_TRANSLATIONS_QUERY_KEY } from "@context/queries/events/sections/translations/useGetEventSectionTranslations";
import { RegistrationSectionTranslation } from "@interfaces";
import { useQueryClient } from "@tanstack/react-query";

interface UpdateEventSectionTranslationProps {
  eventId: string;
  sectionId: string;
  sectionTranslation: RegistrationSectionTranslation;
}

export const UpdateEventSectionTranslation = async ({
  eventId,
  sectionId,
  sectionTranslation,
}: UpdateEventSectionTranslationProps) => {
  const connectedXM = await ConnectedXM();

  const { locale, ...body } = sectionTranslation;

  const { data } = await connectedXM.put(
    `/events/${eventId}/sections/${sectionId}/translations/${sectionTranslation.locale}`,
    body
  );

  return data;
};

export const useUpdateEventSectionTranslation = (
  eventId: string,
  sectionId: string
) => {
  const queryClient = useQueryClient();
  return useConnectedMutation<RegistrationSectionTranslation>(
    (sectionTranslation: RegistrationSectionTranslation) =>
      UpdateEventSectionTranslation({
        eventId,
        sectionId,
        sectionTranslation,
      }),
    {
      onSuccess: (
        response: Awaited<ReturnType<typeof UpdateEventSectionTranslation>>
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
    }
  );
};

export default useUpdateEventSectionTranslation;
