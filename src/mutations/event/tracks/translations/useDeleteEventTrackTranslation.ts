import ConnectedXM from "@context/api/ConnectedXM";
import useConnectedMutation from "@context/mutations/useConnectedMutation";
import { EVENT_TRACK_TRANSLATION_QUERY_KEY } from "@context/queries/events/tracks/translations/useGetEventTrackTranslation";
import { EVENT_TRACK_TRANSLATIONS_QUERY_KEY } from "@context/queries/events/tracks/translations/useGetEventTrackTranslations";
import { useQueryClient } from "@tanstack/react-query";

interface DeleteEventTrackTranslationProps {
  eventId: string;
  trackId: string;
  locale: string;
}

export const DeleteEventTrackTranslation = async ({
  eventId,
  trackId,
  locale,
}: DeleteEventTrackTranslationProps) => {
  const connectedXM = await ConnectedXM();

  const { data } = await connectedXM.delete(
    `/events/${eventId}/tracks/${trackId}/translations/${locale}`
  );

  return data;
};

export const useDeleteEventTrackTranslation = (
  eventId: string,
  trackId: string,
  locale: string
) => {
  const queryClient = useQueryClient();
  return useConnectedMutation(DeleteEventTrackTranslation, {
    onSuccess: () => {
      queryClient.invalidateQueries(
        EVENT_TRACK_TRANSLATIONS_QUERY_KEY(eventId, trackId)
      );
      queryClient.invalidateQueries(
        EVENT_TRACK_TRANSLATION_QUERY_KEY(eventId, trackId, locale)
      );
    },
  });
};

export default useDeleteEventTrackTranslation;
