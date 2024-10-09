import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, FaqSectionTranslation } from "@src/interfaces";
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
export interface CreateEventFaqSectionTranslationParams extends MutationParams {
  eventId: string;
  sectionId: string;
  locale: string;
  autoTranslate?: boolean;
}

/**
 * @category Methods
 * @group Event-Faqs-Translations
 */
export const CreateEventFaqSectionTranslation = async ({
  eventId,
  sectionId,
  locale,
  autoTranslate,
  adminApiParams,
  queryClient,
}: CreateEventFaqSectionTranslationParams): Promise<
  ConnectedXMResponse<FaqSectionTranslation>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.post<
    ConnectedXMResponse<FaqSectionTranslation>
  >(`/events/${eventId}/faqs/${sectionId}/translations`, {
    locale,
    autoTranslate,
  });

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
export const useCreateEventFaqSectionTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateEventFaqSectionTranslation>>,
      Omit<
        CreateEventFaqSectionTranslationParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateEventFaqSectionTranslationParams,
    Awaited<ReturnType<typeof CreateEventFaqSectionTranslation>>
  >(CreateEventFaqSectionTranslation, options, {
    domain: "events",
    type: "update",
  });
};
