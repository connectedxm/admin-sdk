import { GetAdminAPI } from "@src/AdminAPI";
import { ISupportedLocale } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EventSessionLocationTranslationUpdateInputs } from "@src/params";
import {
  EVENT_SESSION_LOCATION_TRANSLATIONS_QUERY_KEY,
  SET_EVENT_SESSION_LOCATION_TRANSLATION_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Event-Session-Location-Translations
 */
export interface UpdateEventSessionLocationTranslationParams
  extends MutationParams {
  eventId: string;
  locationId: string;
  locale: ISupportedLocale;
  locationTranslation: EventSessionLocationTranslationUpdateInputs;
}

/**
 * @category Methods
 * @group Event-Session-Location-Translations
 */
export const UpdateEventSessionLocationTranslation = async ({
  eventId,
  locationId,
  locationTranslation,
  locale,
  adminApiParams,
  queryClient,
}: UpdateEventSessionLocationTranslationParams) => {
  const adminApi = await GetAdminAPI(adminApiParams);

  const { data } = await adminApi.put(
    `/events/${eventId}/sessionLocations/${locationId}/translations/${locale}`,
    locationTranslation
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_SESSION_LOCATION_TRANSLATIONS_QUERY_KEY(
        eventId,
        locationId
      ),
    });
    SET_EVENT_SESSION_LOCATION_TRANSLATION_QUERY_DATA(
      queryClient,
      [eventId, locationId, data.data?.locale],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Session-Location-Translations
 */
export const useUpdateEventSessionLocationTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateEventSessionLocationTranslation>>,
      Omit<
        UpdateEventSessionLocationTranslationParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateEventSessionLocationTranslationParams,
    Awaited<ReturnType<typeof UpdateEventSessionLocationTranslation>>
  >(UpdateEventSessionLocationTranslation, options, {
    domain: "events",
    type: "update",
  });
};
