import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EVENT_SPONSORSHIP_TRANSLATIONS_QUERY_KEY } from "@src/queries/events/sponsorships/translations/useGetEventSponsorshipTranslations";
import { EVENT_SPONSORSHIP_TRANSLATION_QUERY_KEY } from "@src/queries/events/sponsorships/translations/useGetEventSponsorshipTranslation";

/**
 * @category Params
 * @group Event-Sponsorships-Translations
 */
export interface DeleteEventSponsorshipTranslationParams
  extends MutationParams {
  eventId: string;
  levelId: string;
  sponsorshipId: string;
  locale: string;
}

/**
 * @category Methods
 * @group Event-Sponsorships-Translations
 */
export const DeleteEventSponsorshipTranslation = async ({
  eventId,
  levelId,
  sponsorshipId,
  locale,
  adminApiParams,
  queryClient,
}: DeleteEventSponsorshipTranslationParams): Promise<
  ConnectedXMResponse<null>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<null>>(
    `/events/${eventId}/sponsorshipLevels/${levelId}/sponsorships/${sponsorshipId}/translations/${locale}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_SPONSORSHIP_TRANSLATIONS_QUERY_KEY(
        eventId,
        levelId,
        sponsorshipId
      ),
    });
    queryClient.removeQueries({
      queryKey: EVENT_SPONSORSHIP_TRANSLATION_QUERY_KEY(
        eventId,
        levelId,
        sponsorshipId,
        locale
      ),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Sponsorships-Translations
 */
export const useDeleteEventSponsorshipTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteEventSponsorshipTranslation>>,
      Omit<
        DeleteEventSponsorshipTranslationParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteEventSponsorshipTranslationParams,
    Awaited<ReturnType<typeof DeleteEventSponsorshipTranslation>>
  >(DeleteEventSponsorshipTranslation, options, {
    domain: "events",
    type: "update",
  });
};
