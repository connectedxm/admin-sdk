import { GetAdminAPI } from "@src/AdminAPI";
import { ISupportedLocale } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EventTranslationUpdateInputs } from "@src/params";
import {
  EVENT_TRANSLATIONS_QUERY_KEY,
  SET_EVENT_TRANSLATION_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Event-Translations
 */
export interface UpdateEventTranslationParams extends MutationParams {
  eventId: string;
  locale: ISupportedLocale;
  eventTranslation: EventTranslationUpdateInputs;
}

/**
 * @category Methods
 * @group Event-Translations
 */
export const UpdateEventTranslation = async ({
  eventId,
  eventTranslation,
  adminApiParams,
  locale,
  queryClient,
}: UpdateEventTranslationParams) => {
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.put(
    `/events/${eventId}/translations/${locale}`,
    eventTranslation
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_TRANSLATIONS_QUERY_KEY(eventId),
    });
    SET_EVENT_TRANSLATION_QUERY_DATA(
      queryClient,
      [eventId, data.data?.id],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Translations
 */
export const useUpdateEventTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateEventTranslation>>,
      Omit<UpdateEventTranslationParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateEventTranslationParams,
    Awaited<ReturnType<typeof UpdateEventTranslation>>
  >(UpdateEventTranslation, options);
};
