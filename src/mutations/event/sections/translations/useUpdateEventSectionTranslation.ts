import { GetAdminAPI } from "@src/AdminAPI";
import { ISupportedLocale } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EventSectionTranslationUpdateInputs } from "@src/params";
import {
  EVENT_SECTION_TRANSLATIONS_QUERY_KEY,
  SET_EVENT_SECTION_TRANSLATION_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Event-Sections-Translations
 */
export interface UpdateEventSectionTranslationParams extends MutationParams {
  eventId: string;
  sectionId: string;
  locale: ISupportedLocale;
  sectionTranslation: EventSectionTranslationUpdateInputs;
}

/**
 * @category Methods
 * @group Event-Sections-Translations
 */
export const UpdateEventSectionTranslation = async ({
  eventId,
  sectionId,
  sectionTranslation,
  locale,
  adminApiParams,
  queryClient,
}: UpdateEventSectionTranslationParams) => {
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.put(
    `/events/${eventId}/sections/${sectionId}/translations/${locale}`,
    sectionTranslation
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_SECTION_TRANSLATIONS_QUERY_KEY(eventId, sectionId),
    });

    SET_EVENT_SECTION_TRANSLATION_QUERY_DATA(
      queryClient,
      [eventId, sectionId, data.data?.locale],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Sections-Translations
 */
export const useUpdateEventSectionTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateEventSectionTranslation>>,
      Omit<
        UpdateEventSectionTranslationParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateEventSectionTranslationParams,
    Awaited<ReturnType<typeof UpdateEventSectionTranslation>>
  >(UpdateEventSectionTranslation, options);
};
