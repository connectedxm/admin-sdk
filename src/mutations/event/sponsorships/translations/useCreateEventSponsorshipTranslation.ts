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
import { EVENT_SPONSORSHIP_TRANSLATIONS_QUERY_KEY } from "@src/queries/events/sponsorships/translations/useGetEventSponsorshipTranslations";
import { SET_EVENT_SPONSORSHIP_TRANSLATION_QUERY_DATA } from "@src/queries/events/sponsorships/translations/useGetEventSponsorshipTranslation";

/**
 * @category Params
 * @group Event-Sponsorships-Translations
 */
export interface CreateEventSponsorshipTranslationParams
  extends MutationParams {
  eventId: string;
  levelId: string;
  sponsorshipId: string;
  locale: string;
  autoTranslate?: boolean;
}

/**
 * @category Methods
 * @group Event-Sponsorships-Translations
 */
export const CreateEventSponsorshipTranslation = async ({
  eventId,
  levelId,
  sponsorshipId,
  locale,
  autoTranslate = true,
  adminApiParams,
  queryClient,
}: CreateEventSponsorshipTranslationParams): Promise<
  ConnectedXMResponse<EventSponsorshipTranslation>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<
    ConnectedXMResponse<EventSponsorshipTranslation>
  >(
    `/events/${eventId}/sponsorshipLevels/${levelId}/sponsorships/${sponsorshipId}/translations/${locale}`,
    {},
    {
      params: {
        autoTranslate,
      },
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
export const useCreateEventSponsorshipTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateEventSponsorshipTranslation>>,
      Omit<
        CreateEventSponsorshipTranslationParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateEventSponsorshipTranslationParams,
    Awaited<ReturnType<typeof CreateEventSponsorshipTranslation>>
  >(CreateEventSponsorshipTranslation, options, {
    domain: "events",
    type: "update",
  });
};
