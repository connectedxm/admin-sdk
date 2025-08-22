import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMResponse,
  RegistrationFollowupTranslation,
} from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_FOLLOWUP_TRANSLATIONS_QUERY_KEY,
  SET_EVENT_FOLLOWUP_TRANSLATION_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Event-Followups-Translations
 */
export interface CreateEventFollowupTranslationParams extends MutationParams {
  eventId: string;
  followupId: string;
  locale: string;
  autoTranslate?: boolean;
}

/**
 * @category Methods
 * @group Event-Followups-Translations
 */
export const CreateEventFollowupTranslation = async ({
  eventId,
  followupId,
  locale,
  autoTranslate,
  adminApiParams,
  queryClient,
}: CreateEventFollowupTranslationParams): Promise<
  ConnectedXMResponse<RegistrationFollowupTranslation>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.post<
    ConnectedXMResponse<RegistrationFollowupTranslation>
  >(`/events/${eventId}/followups/${followupId}/translations`, {
    locale,
    autoTranslate,
  });
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_FOLLOWUP_TRANSLATIONS_QUERY_KEY(eventId, followupId),
    });
    SET_EVENT_FOLLOWUP_TRANSLATION_QUERY_DATA(
      queryClient,
      [eventId, followupId, data.data?.locale],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Followups-Translations
 */
export const useCreateEventFollowupTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateEventFollowupTranslation>>,
      Omit<
        CreateEventFollowupTranslationParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateEventFollowupTranslationParams,
    Awaited<ReturnType<typeof CreateEventFollowupTranslation>>
  >(CreateEventFollowupTranslation, options, {
    domain: "events",
    type: "update",
  });
};
