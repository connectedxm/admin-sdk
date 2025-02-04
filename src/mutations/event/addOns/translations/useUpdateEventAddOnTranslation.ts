import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMResponse,
  EventAddOnTranslation,
  ISupportedLocale,
} from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EventAddOnTranslationUpdateInputs } from "@src/params";
import {
  EVENT_ADD_ON_TRANSLATIONS_QUERY_KEY,
  SET_EVENT_ADD_ON_TRANSLATION_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Event-AddOns-Translations
 */
export interface UpdateEventAddOnTranslationParams extends MutationParams {
  eventId: string;
  addOnId: string;
  locale: ISupportedLocale;
  addOnTranslation: EventAddOnTranslationUpdateInputs;
}

/**
 * @category Methods
 * @group Event-AddOns-Translations
 */
export const UpdateEventAddOnTranslation = async ({
  eventId,
  addOnId,
  addOnTranslation,
  locale,
  adminApiParams,
  queryClient,
}: UpdateEventAddOnTranslationParams): Promise<
  ConnectedXMResponse<EventAddOnTranslation>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);

  const { data } = await adminApi.put<
    ConnectedXMResponse<EventAddOnTranslation>
  >(
    `/events/${eventId}/addOns/${addOnId}/translations/${locale}`,
    addOnTranslation
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_ADD_ON_TRANSLATIONS_QUERY_KEY(eventId, addOnId),
    });
    SET_EVENT_ADD_ON_TRANSLATION_QUERY_DATA(
      queryClient,
      [eventId, addOnId, data.data?.locale],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-AddOns-Translations
 */
export const useUpdateEventAddOnTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateEventAddOnTranslation>>,
      Omit<UpdateEventAddOnTranslationParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateEventAddOnTranslationParams,
    Awaited<ReturnType<typeof UpdateEventAddOnTranslation>>
  >(UpdateEventAddOnTranslation, options, {
    domain: "events",
    type: "update",
  });
};

export default useUpdateEventAddOnTranslation;
