import { GetAdminAPI } from "@src/AdminAPI";
import { ISupportedLocale } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EventTranslationUpdateInputs } from "@src/params";
import {
  EVENT_TRANSLATIONS_QUERY_KEY,
  SET_EVENT_TRANSLATION_QUERY_DATA,
} from "@src/queries";

/**
 * Updates the translation of a specific event for a given locale.
 * This function allows for updating the translation details of an event, identified by its ID, for a specified locale.
 * It is designed to be used in applications where event translations need to be managed and updated.
 * @name UpdateEventTranslation
 * @param {string} eventId (path) - The ID of the event
 * @param {ISupportedLocale} locale (path) - The locale for which the translation is being updated
 * @param {EventTranslationUpdateInputs} eventTranslation (body) - The translation details to update
 * @version 1.3
 **/

/**
 * @category Params
 * @group Event-Translations
 */
export interface UpdateEventTranslationParams extends MutationParams {
  eventId: string;
  locale: ISupportedLocale;
  eventTranslation: EventTranslationUpdateInputs;
}

/**
 * @category Methods
 * @group Event-Translations
 */
export const UpdateEventTranslation = async ({
  eventId,
  eventTranslation,
  adminApiParams,
  locale,
  queryClient,
}: UpdateEventTranslationParams) => {
  const adminApi = await GetAdminAPI(adminApiParams);

  const { data } = await adminApi.put(
    `/events/${eventId}/translations/${locale}`,
    eventTranslation
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_TRANSLATIONS_QUERY_KEY(eventId),
    });
    SET_EVENT_TRANSLATION_QUERY_DATA(
      queryClient,
      [eventId, data.data?.id],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Translations
 */
export const useUpdateEventTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateEventTranslation>>,
      Omit<UpdateEventTranslationParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateEventTranslationParams,
    Awaited<ReturnType<typeof UpdateEventTranslation>>
  >(UpdateEventTranslation, options, {
    domain: "events",
    type: "update",
  });
};