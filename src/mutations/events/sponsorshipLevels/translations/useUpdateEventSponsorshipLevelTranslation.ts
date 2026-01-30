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
import { EventSponsorshipLevelTranslationUpdateInputs } from "@src/params";
import { EVENT_SPONSORSHIP_LEVEL_TRANSLATIONS_QUERY_KEY } from "@src/queries/events/sponsorshipLevels/translations/useGetEventSponsorshipLevelTranslations";
import { SET_EVENT_SPONSORSHIP_LEVEL_TRANSLATION_QUERY_DATA } from "@src/queries/events/sponsorshipLevels/translations/useGetEventSponsorshipLevelTranslation";

/**
 * @category Params
 * @group Event-SponsorshipLevels-Translations
 */
export interface UpdateEventSponsorshipLevelTranslationParams
  extends MutationParams {
  eventId: string;
  levelId: string;
  locale: string;
  translation: EventSponsorshipLevelTranslationUpdateInputs;
}

/**
 * @category Methods
 * @group Event-SponsorshipLevels-Translations
 */
export const UpdateEventSponsorshipLevelTranslation = async ({
  eventId,
  levelId,
  locale,
  translation,
  adminApiParams,
  queryClient,
}: UpdateEventSponsorshipLevelTranslationParams): Promise<
  ConnectedXMResponse<EventSponsorshipLevelTranslation>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put<
    ConnectedXMResponse<EventSponsorshipLevelTranslation>
  >(`/events/${eventId}/sponsorshipLevels/${levelId}/translations/${locale}`, {
    ...translation,
    id: undefined,
    locale: undefined,
    createdAt: undefined,
    updatedAt: undefined,
  });

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
export const useUpdateEventSponsorshipLevelTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateEventSponsorshipLevelTranslation>>,
      Omit<
        UpdateEventSponsorshipLevelTranslationParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateEventSponsorshipLevelTranslationParams,
    Awaited<ReturnType<typeof UpdateEventSponsorshipLevelTranslation>>
  >(UpdateEventSponsorshipLevelTranslation, options);
};
