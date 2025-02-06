import { GetAdminAPI } from "@src/AdminAPI";
import { ISupportedLocale } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EventTranslationUpdateInputs } from "@src/params";
import {
  EVENT_PASS_TYPE_TRANSLATIONS_QUERY_KEY,
  SET_EVENT_PASS_TYPE_TRANSLATION_QUERY_DATA,
} from "@src/queries";

/**
 * Updates the translation for a specific event pass type.
 * This function allows for updating the translation details of a pass type within an event for a specified locale.
 * It is designed to be used in applications where localization of event pass types is required.
 * @name UpdateEventPassTypeTranslation
 * @param {string} eventId (path) - The ID of the event
 * @param {string} passTypeId (path) - The ID of the pass type
 * @param {ISupportedLocale} locale (path) - The locale for the translation
 * @param {EventTranslationUpdateInputs} passTypeTranslation (body) - The translation inputs for the pass type
 * @version 1.3
 */
export interface UpdateEventPassTypeTranslationParams extends MutationParams {
  eventId: string;
  passTypeId: string;
  locale: ISupportedLocale;
  passTypeTranslation: EventTranslationUpdateInputs;
}

/**
 * @category Methods
 * @group Event-PassTypes-Translations
 */
export const UpdateEventPassTypeTranslation = async ({
  eventId,
  passTypeId,
  passTypeTranslation,
  locale,
  adminApiParams,
  queryClient,
}: UpdateEventPassTypeTranslationParams) => {
  const adminApi = await GetAdminAPI(adminApiParams);

  const { data } = await adminApi.put(
    `/events/${eventId}/passTypes/${passTypeId}/translations/${locale}`,
    passTypeTranslation
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_PASS_TYPE_TRANSLATIONS_QUERY_KEY(eventId, passTypeId),
    });
    SET_EVENT_PASS_TYPE_TRANSLATION_QUERY_DATA(
      queryClient,
      [eventId, passTypeId, data.data?.locale],
      data
    );
  }

  return data;
};

/**
 * @category Mutations
 * @group Event-PassTypes-Translations
 */
export const useUpdateEventPassTypeTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateEventPassTypeTranslation>>,
      Omit<
        UpdateEventPassTypeTranslationParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateEventPassTypeTranslationParams,
    Awaited<ReturnType<typeof UpdateEventPassTypeTranslation>>
  >(UpdateEventPassTypeTranslation, options, {
    domain: "events",
    type: "update",
  });
};