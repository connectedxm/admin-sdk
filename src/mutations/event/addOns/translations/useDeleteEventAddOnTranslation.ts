import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_ADD_ON_TRANSLATIONS_QUERY_KEY,
  EVENT_ADD_ON_TRANSLATION_QUERY_KEY,
} from "@src/queries";

/**
 * @category Params
 * @group Event-AddOns-Translations
 */
export interface DeleteEventAddOnTranslationParams extends MutationParams {
  eventId: string;
  addOnId: string;
  locale: string;
}

/**
 * @category Methods
 * @group Event-AddOns-Translations
 */
export const DeleteEventAddOnTranslation = async ({
  eventId,
  addOnId,
  locale,
  adminApiParams,
  queryClient,
}: DeleteEventAddOnTranslationParams) => {
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.delete(
    `/events/${eventId}/addOns/${addOnId}/translations/${locale}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_ADD_ON_TRANSLATIONS_QUERY_KEY(eventId, addOnId),
    });
    queryClient.invalidateQueries({
      queryKey: EVENT_ADD_ON_TRANSLATION_QUERY_KEY(eventId, addOnId, locale),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-AddOns-Translations
 */
export const useDeleteEventAddOnTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteEventAddOnTranslation>>,
      Omit<DeleteEventAddOnTranslationParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteEventAddOnTranslationParams,
    Awaited<ReturnType<typeof DeleteEventAddOnTranslation>>
  >(DeleteEventAddOnTranslation, options);
};
