import { GetAdminAPI } from "@src/AdminAPI";
import { ISupportedLocale } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EventSessionTimeTranslationUpdateInputs } from "@src/params";
import {
  EVENT_SESSION_TIME_TRANSLATIONS_QUERY_KEY,
  SET_EVENT_SESSION_TIME_TRANSLATION_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Events
 */
export interface UpdateEventSessionTimeTranslationParams
  extends MutationParams {
  eventId: string;
  sessionId: string;
  timeId: string;
  locale: ISupportedLocale;
  timeTranslation: EventSessionTimeTranslationUpdateInputs;
}

/**
 * @category Methods
 * @group Events
 */
export const UpdateEventSessionTimeTranslation = async ({
  eventId,
  sessionId,
  timeId,
  timeTranslation,
  locale,
  adminApiParams,
  queryClient,
}: UpdateEventSessionTimeTranslationParams) => {
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.put(
    `/events/${eventId}/sessions/${sessionId}/times/${timeId}/translations/${locale}`,
    timeTranslation
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_SESSION_TIME_TRANSLATIONS_QUERY_KEY(
        eventId,
        sessionId,
        timeId
      ),
    });

    SET_EVENT_SESSION_TIME_TRANSLATION_QUERY_DATA(
      queryClient,
      [eventId, sessionId, timeId, data.data?.locale],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group Events
 */
export const useUpdateEventSessionTimeTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateEventSessionTimeTranslation>>,
      Omit<
        UpdateEventSessionTimeTranslationParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateEventSessionTimeTranslationParams,
    Awaited<ReturnType<typeof UpdateEventSessionTimeTranslation>>
  >(UpdateEventSessionTimeTranslation, options);
};
