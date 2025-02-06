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
 * Creates a new translation for an event email.
 * This function allows the creation of a translation for a specific event email type and locale.
 * It is used to manage multilingual support for event-related communications.
 * @name PostEventEmailTranslation
 * @param {string} eventId (path) - The ID of the event
 * @param {EventEmailType} type (path) - The type of the event email
 * @param {string} locale (bodyValue) - The locale for the translation
 * @param {boolean} [autoTranslate] (bodyValue) - Whether to automatically translate the email content
 * @version 1.3
 **/

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
  const adminApi = await GetAdminAPI(adminApiParams);

  const { data } = await adminApi.post<
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
  >(CreateEventEmailTranslation, options, {
    domain: "events",
    type: "update",
  });
};
