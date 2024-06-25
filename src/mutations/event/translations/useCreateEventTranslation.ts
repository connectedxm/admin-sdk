import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, EventTranslation } from "@src/interfaces";
import {
  MutationParams,
  ConnectedXMMutationOptions,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_TRANSLATIONS_QUERY_KEY,
  SET_EVENT_TRANSLATION_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Event-Translations
 */
export interface CreateEventTranslationParams extends MutationParams {
  eventId: string;
  locale: string;
  autoTranslate?: boolean;
}

/**
 * @category Methods
 * @group Event-Translations
 */
export const CreateEventTranslation = async ({
  eventId,
  locale,
  autoTranslate,
  adminApiParams,
  queryClient,
}: CreateEventTranslationParams): Promise<
  ConnectedXMResponse<EventTranslation>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.post<
    ConnectedXMResponse<EventTranslation>
  >(`/events/${eventId}/translations`, {
    locale,
    autoTranslate,
  });
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_TRANSLATIONS_QUERY_KEY(eventId),
    });
    SET_EVENT_TRANSLATION_QUERY_DATA(
      queryClient,
      [eventId, data.data.locale],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Translations
 */
export const useCreateEventTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateEventTranslation>>,
      Omit<CreateEventTranslationParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateEventTranslationParams,
    Awaited<ReturnType<typeof CreateEventTranslation>>
  >(CreateEventTranslation, options);
};

export default useCreateEventTranslation;
