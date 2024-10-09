import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_FAQ_SECTION_TRANSLATIONS_QUERY_KEY,
  EVENT_FAQ_SECTION_TRANSLATION_QUERY_KEY,
} from "@src/queries";

/**
 * @category Params
 * @group Event-Faqs-Translations
 */
export interface DeleteEventFaqSectionTranslationParams extends MutationParams {
  eventId: string;
  sectionId: string;
  locale: string;
}

/**
 * @category Methods
 * @group Event-Faqs-Translations
 */
export const DeleteEventFaqSectionTranslation = async ({
  eventId,
  sectionId,
  locale,
  adminApiParams,
  queryClient,
}: DeleteEventFaqSectionTranslationParams) => {
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.delete(
    `/events/${eventId}/faqs/${sectionId}/translations/${locale}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_FAQ_SECTION_TRANSLATIONS_QUERY_KEY(eventId, sectionId),
    });
    queryClient.invalidateQueries({
      queryKey: EVENT_FAQ_SECTION_TRANSLATION_QUERY_KEY(
        eventId,
        sectionId,
        locale
      ),
    });
  }

  return data;
};

/**
 * @category Mutations
 * @group Event-Faqs-Translations
 */
export const useDeleteEventFaqSectionTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteEventFaqSectionTranslation>>,
      Omit<
        DeleteEventFaqSectionTranslationParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteEventFaqSectionTranslationParams,
    Awaited<ReturnType<typeof DeleteEventFaqSectionTranslation>>
  >(DeleteEventFaqSectionTranslation, options, {
    domain: "events",
    type: "update",
  });
};
