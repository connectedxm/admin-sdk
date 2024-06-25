import { GetAdminAPI } from "@src/AdminAPI";
import { EventPageTranslation } from "@src/interfaces";
import {
  MutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
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
  pageTranslation: EventPageTranslation;
}

/**
 * @category Methods
 * @group Event-Page-Translation
 */
export const UpdateEventPageTranslation = async ({
  eventId,
  pageId,
  pageTranslation,
  adminApiParams,
  queryClient,
}: UpdateEventPageTranslationParams) => {
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { locale, ...body } = pageTranslation;

  const { data } = await connectedXM.put(
    `/events/${eventId}/pages/${pageId}/translations/${locale}`,
    body
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
    MutationOptions<
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
