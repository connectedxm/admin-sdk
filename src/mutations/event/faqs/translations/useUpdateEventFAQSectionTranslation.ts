import { GetAdminAPI } from "@src/AdminAPI";
import { FaqSectionTranslation } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_FAQ_SECTION_TRANSLATIONS_QUERY_KEY,
  SET_EVENT_FAQ_SECTION_TRANSLATION_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Event-Faqs-Translations
 */
export interface UpdateEventFAQSectionTranslationParams extends MutationParams {
  eventId: string;
  sectionId: string;
  faqSectionTranslation: FaqSectionTranslation;
}

/**
 * @category Methods
 * @group Event-Faqs-Translations
 */
export const UpdateEventFAQSectionTranslation = async ({
  eventId,
  sectionId,
  faqSectionTranslation,
  adminApiParams,
  queryClient,
}: UpdateEventFAQSectionTranslationParams) => {
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { locale, ...body } = faqSectionTranslation;

  const { data } = await connectedXM.put(
    `/events/${eventId}/faqs/${sectionId}/translations/${locale}`,
    body
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_FAQ_SECTION_TRANSLATIONS_QUERY_KEY(eventId, sectionId),
    });

    SET_EVENT_FAQ_SECTION_TRANSLATION_QUERY_DATA(
      queryClient,
      [eventId, sectionId, data.data?.locale],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Faqs-Translations
 */
export const useUpdateEventFAQSectionTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateEventFAQSectionTranslation>>,
      Omit<
        UpdateEventFAQSectionTranslationParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateEventFAQSectionTranslationParams,
    Awaited<ReturnType<typeof UpdateEventFAQSectionTranslation>>
  >(UpdateEventFAQSectionTranslation, options);
};
