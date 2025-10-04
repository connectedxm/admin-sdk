import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMResponse,
  EventSponsorshipLevelTranslation,
} from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EVENT_SPONSORSHIP_LEVEL_TRANSLATIONS_QUERY_KEY } from "@src/queries/events/sponsorshipLevels/translations/useGetEventSponsorshipLevelTranslations";
import { SET_EVENT_SPONSORSHIP_LEVEL_TRANSLATION_QUERY_DATA } from "@src/queries/events/sponsorshipLevels/translations/useGetEventSponsorshipLevelTranslation";

/**
 * @category Params
 * @group Event-SponsorshipLevels-Translations
 */
export interface CreateEventSponsorshipLevelTranslationParams
  extends MutationParams {
  eventId: string;
  levelId: string;
  locale: string;
  autoTranslate?: boolean;
}

/**
 * @category Methods
 * @group Event-SponsorshipLevels-Translations
 */
export const CreateEventSponsorshipLevelTranslation = async ({
  eventId,
  levelId,
  locale,
  autoTranslate = true,
  adminApiParams,
  queryClient,
}: CreateEventSponsorshipLevelTranslationParams): Promise<
  ConnectedXMResponse<EventSponsorshipLevelTranslation>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<
    ConnectedXMResponse<EventSponsorshipLevelTranslation>
  >(
    `/events/${eventId}/sponsorshipLevels/${levelId}/translations/${locale}`,
    {},
    {
      params: {
        autoTranslate,
      },
    }
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_SPONSORSHIP_LEVEL_TRANSLATIONS_QUERY_KEY(
        eventId,
        levelId
      ),
    });
    SET_EVENT_SPONSORSHIP_LEVEL_TRANSLATION_QUERY_DATA(
      queryClient,
      [eventId, levelId, locale],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-SponsorshipLevels-Translations
 */
export const useCreateEventSponsorshipLevelTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateEventSponsorshipLevelTranslation>>,
      Omit<
        CreateEventSponsorshipLevelTranslationParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateEventSponsorshipLevelTranslationParams,
    Awaited<ReturnType<typeof CreateEventSponsorshipLevelTranslation>>
  >(CreateEventSponsorshipLevelTranslation, options);
};
