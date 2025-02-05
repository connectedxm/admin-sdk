import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_PAGE_TRANSLATIONS_QUERY_KEY,
  EVENT_PAGE_TRANSLATION_QUERY_KEY,
} from "@src/queries";

/**
 * Deletes a specific translation of an event page based on the provided event ID, page ID, and locale.
 * This function is used to remove a translation entry from an event page, ensuring that the associated
 * queries are invalidated to maintain data consistency within the application.
 * @name DeleteEventPageTranslation
 * @param {string} eventId - The ID of the event
 * @param {string} pageId - The ID of the page
 * @param {string} locale - The locale of the translation to be deleted
 * @version 1.2
 **/

/**
 * @category Params
 * @group Event-Page-Translation
 */
export interface DeleteEventPageTranslationParams extends MutationParams {
  eventId: string;
  pageId: string;
  locale: string;
}

/**
 * @category Methods
 * @group Event-Page-Translation
 */
export const DeleteEventPageTranslation = async ({
  eventId,
  pageId,
  locale,
  adminApiParams,
  queryClient,
}: DeleteEventPageTranslationParams) => {
  const adminApi = await GetAdminAPI(adminApiParams);

  const { data } = await adminApi.delete(
    `/events/${eventId}/pages/${pageId}/translations/${locale}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_PAGE_TRANSLATIONS_QUERY_KEY(eventId, pageId),
    });
    queryClient.invalidateQueries({
      queryKey: EVENT_PAGE_TRANSLATION_QUERY_KEY(eventId, pageId, locale),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Page-Translation
 */
export const useDeleteEventPageTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteEventPageTranslation>>,
      Omit<DeleteEventPageTranslationParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteEventPageTranslationParams,
    Awaited<ReturnType<typeof DeleteEventPageTranslation>>
  >(DeleteEventPageTranslation, options, {
    domain: "events",
    type: "update",
  });
};