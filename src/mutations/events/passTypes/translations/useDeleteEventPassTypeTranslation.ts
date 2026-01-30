import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_PASS_TYPE_TRANSLATIONS_QUERY_KEY,
  EVENT_PASS_TYPE_TRANSLATION_QUERY_KEY,
} from "@src/queries";

/**
 * @category Params
 * @group Event-PassTypes-Translations
 */
export interface DeleteEventPassTypeTranslationParams extends MutationParams {
  eventId: string;
  passTypeId: string;
  locale: string;
}

/**
 * @category Methods
 * @group Event-PassTypes-Translations
 */
export const DeleteEventPassTypeTranslation = async ({
  eventId,
  passTypeId,
  locale,
  adminApiParams,
  queryClient,
}: DeleteEventPassTypeTranslationParams) => {
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.delete(
    `/events/${eventId}/passTypes/${passTypeId}/translations/${locale}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_PASS_TYPE_TRANSLATIONS_QUERY_KEY(eventId, passTypeId),
    });
    queryClient.invalidateQueries({
      queryKey: EVENT_PASS_TYPE_TRANSLATION_QUERY_KEY(
        eventId,
        passTypeId,
        locale
      ),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-PassTypes-Translations
 */
export const useDeleteEventPassTypeTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteEventPassTypeTranslation>>,
      Omit<
        DeleteEventPassTypeTranslationParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteEventPassTypeTranslationParams,
    Awaited<ReturnType<typeof DeleteEventPassTypeTranslation>>
  >(DeleteEventPassTypeTranslation, options);
};
