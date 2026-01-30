import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EVENT_SPONSORSHIP_LEVEL_TRANSLATIONS_QUERY_KEY } from "@src/queries/events/sponsorshipLevels/translations/useGetEventSponsorshipLevelTranslations";
import { EVENT_SPONSORSHIP_LEVEL_TRANSLATION_QUERY_KEY } from "@src/queries/events/sponsorshipLevels/translations/useGetEventSponsorshipLevelTranslation";

/**
 * @category Params
 * @group Event-SponsorshipLevels-Translations
 */
export interface DeleteEventSponsorshipLevelTranslationParams
  extends MutationParams {
  eventId: string;
  levelId: string;
  locale: string;
}

/**
 * @category Methods
 * @group Event-SponsorshipLevels-Translations
 */
export const DeleteEventSponsorshipLevelTranslation = async ({
  eventId,
  levelId,
  locale,
  adminApiParams,
  queryClient,
}: DeleteEventSponsorshipLevelTranslationParams): Promise<
  ConnectedXMResponse<null>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<null>>(
    `/events/${eventId}/sponsorshipLevels/${levelId}/translations/${locale}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_SPONSORSHIP_LEVEL_TRANSLATIONS_QUERY_KEY(
        eventId,
        levelId
      ),
    });
    queryClient.removeQueries({
      queryKey: EVENT_SPONSORSHIP_LEVEL_TRANSLATION_QUERY_KEY(
        eventId,
        levelId,
        locale
      ),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-SponsorshipLevels-Translations
 */
export const useDeleteEventSponsorshipLevelTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteEventSponsorshipLevelTranslation>>,
      Omit<
        DeleteEventSponsorshipLevelTranslationParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteEventSponsorshipLevelTranslationParams,
    Awaited<ReturnType<typeof DeleteEventSponsorshipLevelTranslation>>
  >(DeleteEventSponsorshipLevelTranslation, options);
};
