import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMResponse,
  EventSponsorshipTranslation,
} from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EventSponsorshipTranslationUpdateInputs } from "@src/params";
import { EVENT_SPONSORSHIP_TRANSLATIONS_QUERY_KEY } from "@src/queries/events/sponsorships/translations/useGetEventSponsorshipTranslations";
import { SET_EVENT_SPONSORSHIP_TRANSLATION_QUERY_DATA } from "@src/queries/events/sponsorships/translations/useGetEventSponsorshipTranslation";

/**
 * @category Params
 * @group Event-Sponsorships-Translations
 */
export interface UpdateEventSponsorshipTranslationParams
  extends MutationParams {
  eventId: string;
  levelId: string;
  sponsorshipId: string;
  locale: string;
  translation: EventSponsorshipTranslationUpdateInputs;
}

/**
 * @category Methods
 * @group Event-Sponsorships-Translations
 */
export const UpdateEventSponsorshipTranslation = async ({
  eventId,
  levelId,
  sponsorshipId,
  locale,
  translation,
  adminApiParams,
  queryClient,
}: UpdateEventSponsorshipTranslationParams): Promise<
  ConnectedXMResponse<EventSponsorshipTranslation>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put<
    ConnectedXMResponse<EventSponsorshipTranslation>
  >(
    `/events/${eventId}/sponsorshipLevels/${levelId}/sponsorships/${sponsorshipId}/translations/${locale}`,
    {
      ...translation,
      id: undefined,
      locale: undefined,
      createdAt: undefined,
      updatedAt: undefined,
    }
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_SPONSORSHIP_TRANSLATIONS_QUERY_KEY(
        eventId,
        levelId,
        sponsorshipId
      ),
    });
    SET_EVENT_SPONSORSHIP_TRANSLATION_QUERY_DATA(
      queryClient,
      [eventId, levelId, sponsorshipId, locale],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Sponsorships-Translations
 */
export const useUpdateEventSponsorshipTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateEventSponsorshipTranslation>>,
      Omit<
        UpdateEventSponsorshipTranslationParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateEventSponsorshipTranslationParams,
    Awaited<ReturnType<typeof UpdateEventSponsorshipTranslation>>
  >(UpdateEventSponsorshipTranslation, options);
};
