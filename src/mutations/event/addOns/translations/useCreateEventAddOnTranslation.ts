import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, EventAddOnTranslation } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_ADD_ON_TRANSLATIONS_QUERY_KEY,
  SET_EVENT_ADD_ON_TRANSLATION_QUERY_DATA,
} from "@src/queries";

/**
 * Creates a new translation for a specific event add-on.
 * This function allows the creation of translations for event add-ons by specifying the event ID, add-on ID, and locale.
 * It supports optional auto-translation and updates the query cache upon successful creation.
 * @name PostEventAddOnTranslation
 * @param {string} eventId - The ID of the event
 * @param {string} addOnId - The ID of the add-on
 * @param {string} locale - The locale for the translation
 * @param {[boolean]} autoTranslate - Whether to auto-translate the content
 * @version 1.2
 **/

/**
 * @category Params
 * @group Event-AddOns-Translations
 */
export interface CreateEventAddOnTranslationParams extends MutationParams {
  eventId: string;
  addOnId: string;
  locale: string;
  autoTranslate?: boolean;
}

/**
 * @category Methods
 * @group Event-AddOns-Translations
 */
export const CreateEventAddOnTranslation = async ({
  eventId,
  addOnId,
  locale,
  autoTranslate,
  adminApiParams,
  queryClient,
}: CreateEventAddOnTranslationParams): Promise<
  ConnectedXMResponse<EventAddOnTranslation>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);

  const { data } = await adminApi.post<
    ConnectedXMResponse<EventAddOnTranslation>
  >(`/events/${eventId}/addOns/${addOnId}/translations`, {
    locale,
    autoTranslate,
  });

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_ADD_ON_TRANSLATIONS_QUERY_KEY(eventId, addOnId),
    });
    SET_EVENT_ADD_ON_TRANSLATION_QUERY_DATA(
      queryClient,
      [eventId, addOnId, data.data?.locale],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-AddOns-Translations
 */
export const useCreateEventAddOnTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateEventAddOnTranslation>>,
      Omit<CreateEventAddOnTranslationParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateEventAddOnTranslationParams,
    Awaited<ReturnType<typeof CreateEventAddOnTranslation>>
  >(CreateEventAddOnTranslation, options, {
    domain: "events",
    type: "update",
  });
};