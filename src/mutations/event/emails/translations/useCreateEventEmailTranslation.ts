import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMResponse,
  EventEmailTranslation,
  EventEmailType,
} from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_EMAIL_TRANSLATIONS_QUERY_KEY,
  SET_EVENT_EMAIL_TRANSLATION_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Event-Emails-Translations
 */
export interface CreateEventEmailTranslationParams extends MutationParams {
  eventId: string;
  type: EventEmailType;
  locale: string;
  autoTranslate?: boolean;
}

/**
 * @category Methods
 * @group Event-Emails-Translations
 */
export const CreateEventEmailTranslation = async ({
  eventId,
  type,
  locale,
  autoTranslate,
  adminApiParams,
  queryClient,
}: CreateEventEmailTranslationParams): Promise<
  ConnectedXMResponse<EventEmailTranslation>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.post<
    ConnectedXMResponse<EventEmailTranslation>
  >(`/events/${eventId}/emails/${type}/translations`, {
    locale,
    autoTranslate,
  });
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_EMAIL_TRANSLATIONS_QUERY_KEY(eventId, type),
    });
    SET_EVENT_EMAIL_TRANSLATION_QUERY_DATA(
      queryClient,
      [eventId, type, data.data?.locale],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Emails-Translations
 */
export const useCreateEventEmailTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateEventEmailTranslation>>,
      Omit<CreateEventEmailTranslationParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateEventEmailTranslationParams,
    Awaited<ReturnType<typeof CreateEventEmailTranslation>>
  >(CreateEventEmailTranslation, options);
};
