import { GetAdminAPI } from "@src/AdminAPI";
import { EventEmailType } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_EMAIL_TRANSLATIONS_QUERY_KEY,
  EVENT_EMAIL_TRANSLATION_QUERY_KEY,
} from "@src/queries";

/**
 * @category Params
 * @group Event-Emails-Translations
 */
export interface DeleteEventEmailTranslationParams extends MutationParams {
  eventId: string;
  type: EventEmailType;
  locale: string;
}

/**
 * @category Methods
 * @group Event-Emails-Translations
 */
export const DeleteEventEmailTranslation = async ({
  eventId,
  type,
  locale,
  adminApiParams,
  queryClient,
}: DeleteEventEmailTranslationParams) => {
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.delete(
    `/events/${eventId}/emails/${type}/translations/${locale}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_EMAIL_TRANSLATIONS_QUERY_KEY(eventId, type),
    });
    queryClient.invalidateQueries({
      queryKey: EVENT_EMAIL_TRANSLATION_QUERY_KEY(eventId, type, locale),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Emails-Translations
 */
export const useDeleteEventEmailTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteEventEmailTranslation>>,
      Omit<DeleteEventEmailTranslationParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteEventEmailTranslationParams,
    Awaited<ReturnType<typeof DeleteEventEmailTranslation>>
  >(DeleteEventEmailTranslation, options);
};
