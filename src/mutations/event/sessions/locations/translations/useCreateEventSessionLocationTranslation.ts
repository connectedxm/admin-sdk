import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMResponse,
  EventSessionLocationTranslation,
} from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { SET_EVENT_SESSION_LOCATION_TRANSLATION_QUERY_DATA } from "@src/queries/events/sessions/locations/translations/useGetEventSessionTranslation";
import { EVENT_SESSION_LOCATION_TRANSLATIONS_QUERY_KEY } from "@src/queries/events/sessions/locations/translations/useGetEventSessionTranslations";

/**
 * @category Params
 * @group Event-Session-Location-Translations
 */
export interface CreateEventSessionLocationTranslationParams
  extends MutationParams {
  eventId: string;
  locationId: string;
  locale: string;
  autoTranslate?: boolean;
}

/**
 * @category Methods
 * @group Event-Session-Location-Translations
 */
export const CreateEventSessionLocationTranslation = async ({
  eventId,
  locationId,
  locale,
  autoTranslate,
  adminApiParams,
  queryClient,
}: CreateEventSessionLocationTranslationParams): Promise<
  ConnectedXMResponse<EventSessionLocationTranslation>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.post<
    ConnectedXMResponse<EventSessionLocationTranslation>
  >(`/events/${eventId}/sessionLocations/${locationId}/translations`, {
    locale,
    autoTranslate,
  });
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
export const useCreateEventSessionLocationTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateEventSessionLocationTranslation>>,
      Omit<
        CreateEventSessionLocationTranslationParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateEventSessionLocationTranslationParams,
    Awaited<ReturnType<typeof CreateEventSessionLocationTranslation>>
  >(CreateEventSessionLocationTranslation, options, {
    domain: "events",
    type: "update",
  });
};
