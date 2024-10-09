import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_TRANSLATIONS_QUERY_KEY,
  EVENT_TRANSLATION_QUERY_KEY,
} from "@src/queries";

/**
 * @category Params
 * @group Event-Translations
 */
export interface DeleteEventTranslationParams extends MutationParams {
  eventId: string;
  locale: string;
}

/**
 * @category Methods
 * @group Event-Translations
 */
export const DeleteEventTranslation = async ({
  eventId,
  locale,
  adminApiParams,
  queryClient,
}: DeleteEventTranslationParams) => {
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.delete(
    `/events/${eventId}/translations/${locale}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_TRANSLATIONS_QUERY_KEY(eventId),
    });
    queryClient.invalidateQueries({
      queryKey: EVENT_TRANSLATION_QUERY_KEY(eventId, locale),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Translations
 */
export const useDeleteEventTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteEventTranslation>>,
      Omit<DeleteEventTranslationParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteEventTranslationParams,
    Awaited<ReturnType<typeof DeleteEventTranslation>>
  >(DeleteEventTranslation, options, {
    domain: "events",
    type: "update",
  });
};
