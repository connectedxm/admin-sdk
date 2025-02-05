import { GetAdminAPI } from "@src/AdminAPI";
import { EventEmailType, ISupportedLocale } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EventEmailTranslationUpdateInputs } from "@src/params";
import {
  EVENT_EMAIL_TRANSLATIONS_QUERY_KEY,
  SET_EVENT_EMAIL_TRANSLATION_QUERY_DATA,
} from "@src/queries";

/**
 * Updates the translation of an event email for a specific locale.
 * This function allows updating the translation details of an event email identified by event ID, email type, and locale.
 * It is used in scenarios where the email content needs to be localized or updated for different languages.
 * @name UpdateEventEmailTranslation
 * @param {string} eventId - The ID of the event
 * @param {EventEmailType} type - The type of the event email
 * @param {ISupportedLocale} locale - The locale for the translation
 * @param {EventEmailTranslationUpdateInputs} emailTranslation - The translation inputs for the email
 * @version 1.2
 */

export interface UpdateEventEmailTranslationParams extends MutationParams {
  eventId: string;
  type: EventEmailType;
  locale: ISupportedLocale;
  emailTranslation: EventEmailTranslationUpdateInputs;
}

export const UpdateEventEmailTranslation = async ({
  eventId,
  type,
  emailTranslation,
  locale,
  adminApiParams,
  queryClient,
}: UpdateEventEmailTranslationParams) => {
  const adminApi = await GetAdminAPI(adminApiParams);

  const { data } = await adminApi.put(
    `/events/${eventId}/emails/${type}/translations/${locale}`,
    emailTranslation
  );
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

export const useUpdateEventEmailTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateEventEmailTranslation>>,
      Omit<UpdateEventEmailTranslationParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateEventEmailTranslationParams,
    Awaited<ReturnType<typeof UpdateEventEmailTranslation>>
  >(UpdateEventEmailTranslation, options, {
    domain: "events",
    type: "update",
  });
};