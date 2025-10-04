import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, EventPassTypeTranslation } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_PASS_TYPE_TRANSLATIONS_QUERY_KEY,
  SET_EVENT_PASS_TYPE_TRANSLATION_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Event-PassTypes-Translations
 */
export interface CreateEventPassTypeTranslationParams extends MutationParams {
  eventId: string;
  passTypeId: string;
  locale: string;
  autoTranslate?: boolean;
}

/**
 * @category Methods
 * @group Event-PassTypes-Translations
 */
export const CreateEventPassTypeTranslation = async ({
  eventId,
  passTypeId,
  locale,
  autoTranslate,
  adminApiParams,
  queryClient,
}: CreateEventPassTypeTranslationParams): Promise<
  ConnectedXMResponse<EventPassTypeTranslation>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.post<
    ConnectedXMResponse<EventPassTypeTranslation>
  >(`/events/${eventId}/passTypes/${passTypeId}/translations`, {
    locale,
    autoTranslate,
  });
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_PASS_TYPE_TRANSLATIONS_QUERY_KEY(eventId, passTypeId),
    });
    SET_EVENT_PASS_TYPE_TRANSLATION_QUERY_DATA(
      queryClient,
      [eventId, passTypeId, data.data?.locale],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-PassTypes-Translations
 */
export const useCreateEventPassTypeTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateEventPassTypeTranslation>>,
      Omit<
        CreateEventPassTypeTranslationParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateEventPassTypeTranslationParams,
    Awaited<ReturnType<typeof CreateEventPassTypeTranslation>>
  >(CreateEventPassTypeTranslation, options);
};
