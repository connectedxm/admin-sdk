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
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.put(
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
  >(UpdateEventPageTranslation, options);
};
