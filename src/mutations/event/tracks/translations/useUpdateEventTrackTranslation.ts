import ConnectedXM from "@context/api/ConnectedXM";
import useConnectedMutation from "@context/mutations/useConnectedMutation";
import { SET_EVENT_TRACK_TRANSLATION_QUERY_DATA } from "@context/queries/events/tracks/translations/useGetEventTrackTranslation";
import { EVENT_TRACK_TRANSLATIONS_QUERY_KEY } from "@context/queries/events/tracks/translations/useGetEventTrackTranslations";
import { TrackTranslation } from "@interfaces";
import { useQueryClient } from "@tanstack/react-query";

interface UpdateEventTrackTranslationProps {
  eventId: string;
  trackId: string;
  trackTranslation: TrackTranslation;
}

export const UpdateEventTrackTranslation = async ({
  eventId,
  trackId,
  trackTranslation,
}: UpdateEventTrackTranslationProps) => {
  const connectedXM = await ConnectedXM();

  const { locale, ...body } = trackTranslation;

  const { data } = await connectedXM.put(
    `/events/${eventId}/tracks/${trackId}/translations/${trackTranslation.locale}`,
    body
  );

  return data;
};

export const useUpdateEventTrackTranslation = (
  eventId: string,
  trackId: string
) => {
  const queryClient = useQueryClient();
  return useConnectedMutation<TrackTranslation>(
    (trackTranslation: TrackTranslation) =>
      UpdateEventTrackTranslation({
        eventId,
        trackId,
        trackTranslation,
      }),
    {
      onSuccess: (
        response: Awaited<ReturnType<typeof UpdateEventTrackTranslation>>
      ) => {
        queryClient.invalidateQueries(
          EVENT_TRACK_TRANSLATIONS_QUERY_KEY(eventId, trackId)
        );
        SET_EVENT_TRACK_TRANSLATION_QUERY_DATA(
          queryClient,
          [eventId, trackId, response.data?.locale],
          response
        );
      },
    }
  );
};

export default useUpdateEventTrackTranslation;
