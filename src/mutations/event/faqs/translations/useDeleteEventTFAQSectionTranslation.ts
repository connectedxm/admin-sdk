import { GetAdminAPI } from "@src/AdminAPI";
import {
  MutationOptions,
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
export interface DeleteEventFAQSectionTranslationParams extends MutationParams {
  eventId: string;
  sectionId: string;
  locale: string;
}

/**
 * @category Methods
 * @group Event-Faqs-Translations
 */
export const DeleteEventFAQSectionTranslation = async ({
  eventId,
  sectionId,
  locale,
  adminApiParams,
  queryClient,
}: DeleteEventFAQSectionTranslationParams) => {
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
export const useDeleteEventFAQSectionTranslation = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof DeleteEventFAQSectionTranslation>>,
      Omit<
        DeleteEventFAQSectionTranslationParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteEventFAQSectionTranslationParams,
    Awaited<ReturnType<typeof DeleteEventFAQSectionTranslation>>
  >(DeleteEventFAQSectionTranslation, options);
};
