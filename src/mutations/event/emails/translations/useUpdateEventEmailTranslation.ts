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
 * @category Params
 * @group Event-Emails-Translations
 */
export interface UpdateEventEmailTranslationParams extends MutationParams {
  eventId: string;
  type: EventEmailType;
  locale: ISupportedLocale;
  emailTranslation: EventEmailTranslationUpdateInputs;
}

/**
 * @category Methods
 * @group Event-Emails-Translations
 */
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

/**
 * @category Mutations
 * @group Event-Emails-Translations
 */
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
