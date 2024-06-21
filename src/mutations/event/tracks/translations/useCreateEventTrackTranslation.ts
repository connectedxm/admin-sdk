import ConnectedXM, { ConnectedXMResponse } from "@context/api/ConnectedXM";
import useConnectedMutation from "@context/mutations/useConnectedMutation";
import { SET_EVENT_TRACK_TRANSLATION_QUERY_DATA } from "@context/queries/events/tracks/translations/useGetEventTrackTranslation";
import { EVENT_TRACK_TRANSLATIONS_QUERY_KEY } from "@context/queries/events/tracks/translations/useGetEventTrackTranslations";
import { TrackTranslation } from "@interfaces";
import { useQueryClient } from "@tanstack/react-query";

interface CreateEventTrackTranslationProps {
  eventId: string;
  trackId: string;
  locale: string;
  autoTranslate?: boolean;
}

export const CreateEventTrackTranslation = async ({
  eventId,
  trackId,
  locale,
  autoTranslate,
}: CreateEventTrackTranslationProps): Promise<
  ConnectedXMResponse<TrackTranslation>
> => {
  const connectedXM = await ConnectedXM();

  const { data } = await connectedXM.post(
    `/events/${eventId}/tracks/${trackId}/translations`,
    {
      locale,
      autoTranslate,
    }
  );

  return data;
};

export const useCreateEventTrackTranslation = (
  eventId: string,
  trackId: string
) => {
  const queryClient = useQueryClient();

  return useConnectedMutation<
    Omit<CreateEventTrackTranslationProps, "eventId" | "trackId">
  >(
    (props) => CreateEventTrackTranslation({ eventId, trackId, ...props }),
    {
      onSuccess: (
        response: Awaited<ReturnType<typeof CreateEventTrackTranslation>>
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
    },
    "Hold on while we create a translation..."
  );
};

export default useCreateEventTrackTranslation;
