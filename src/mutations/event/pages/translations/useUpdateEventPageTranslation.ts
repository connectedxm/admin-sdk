import { GetAdminAPI } from "@src/AdminAPI";
import { ISupportedLocale } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EventPageTranslationUpdateInputs } from "@src/params";
import {
  EVENT_PAGE_TRANSLATIONS_QUERY_KEY,
  SET_EVENT_PAGE_TRANSLATION_QUERY_DATA,
} from "@src/queries";

/**
 * Updates the translation of a specific event page for a given locale.
 * This function allows for updating the translation content of an event page, identified by eventId and pageId, in a specified locale.
 * It is designed to be used in applications where multilingual support for event pages is required.
 * @name UpdateEventPageTranslation
 * @param {string} eventId - The ID of the event
 * @param {string} pageId - The ID of the page
 * @param {ISupportedLocale} locale - The locale for the translation
 * @param {EventPageTranslationUpdateInputs} pageTranslation - The translation inputs for the page
 * @version 1.2
 **/

/**
 * @category Params
 * @group Event-Page-Translation
 */
export interface UpdateEventPageTranslationParams extends MutationParams {
  eventId: string;
  pageId: string;
  locale: ISupportedLocale;
  pageTranslation: EventPageTranslationUpdateInputs;
}

/**
 * @category Methods
 * @group Event-Page-Translation
 */
export const UpdateEventPageTranslation = async ({
  eventId,
  pageId,
  locale,
  pageTranslation,
  adminApiParams,
  queryClient,
}: UpdateEventPageTranslationParams) => {
  const adminApi = await GetAdminAPI(adminApiParams);

  const { data } = await adminApi.put(
    `/events/${eventId}/pages/${pageId}/translations/${locale}`,
    pageTranslation
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_PAGE_TRANSLATIONS_QUERY_KEY(eventId, pageId),
    });
    SET_EVENT_PAGE_TRANSLATION_QUERY_DATA(
      queryClient,
      [eventId, pageId, data?.data.locale],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Page-Translation
 */
export const useUpdateEventPageTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateEventPageTranslation>>,
      Omit<UpdateEventPageTranslationParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateEventPageTranslationParams,
    Awaited<ReturnType<typeof UpdateEventPageTranslation>>
  >(UpdateEventPageTranslation, options, {
    domain: "events",
    type: "update",
  });
};