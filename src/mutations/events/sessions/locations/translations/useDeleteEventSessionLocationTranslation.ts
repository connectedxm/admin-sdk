import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EVENT_SESSION_LOCATION_TRANSLATION_QUERY_KEY } from "@src/queries/events/sessions/locations/translations/useGetEventSessionTranslation";
import { EVENT_SESSION_LOCATION_TRANSLATIONS_QUERY_KEY } from "@src/queries/events/sessions/locations/translations/useGetEventSessionTranslations";

/**
 * Deletes a specific translation for an event session location.
 * This function is used to remove a translation entry for a given event session location identified by event ID, location ID, and locale.
 * It ensures that the translation data is invalidated in the query cache upon successful deletion.
 * @name DeleteEventSessionLocationTranslation
 * @param {string} eventId (path) The ID of the event
 * @param {string} locationId (path) The ID of the session location
 * @param {string} locale (path) The locale of the translation
 * @version 1.3
 **/

/**
 * @category Params
 * @group Event-Session-Location-Translations
 */
export interface DeleteEventSessionLocationTranslationParams
  extends MutationParams {
  eventId: string;
  locationId: string;
  locale: string;
}

/**
 * @category Methods
 * @group Event-Session-Location-Translations
 */
export const DeleteEventSessionLocationTranslation = async ({
  eventId,
  locationId,
  locale,
  adminApiParams,
  queryClient,
}: DeleteEventSessionLocationTranslationParams) => {
  const adminApi = await GetAdminAPI(adminApiParams);

  const { data } = await adminApi.delete(
    `/events/${eventId}/sessionLocations/${locationId}/translations/${locale}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_SESSION_LOCATION_TRANSLATIONS_QUERY_KEY(
        eventId,
        locationId
      ),
    });
    queryClient.invalidateQueries({
      queryKey: EVENT_SESSION_LOCATION_TRANSLATION_QUERY_KEY(
        eventId,
        locationId,
        locale
      ),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Session-Location-Translations
 */
export const useDeleteEventSessionLocationTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteEventSessionLocationTranslation>>,
      Omit<
        DeleteEventSessionLocationTranslationParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteEventSessionLocationTranslationParams,
    Awaited<ReturnType<typeof DeleteEventSessionLocationTranslation>>
  >(DeleteEventSessionLocationTranslation, options, {
    domain: "events",
    type: "update",
  });
};
