import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_SESSION_TIME_TRANSLATION_QUERY_KEY,
  EVENT_SESSION_TIME_TRANSLATIONS_QUERY_KEY,
} from "@src/queries";

/**
 * @category Params
 * @group Events
 */
export interface DeleteEventSessionTimeTranslationParams
  extends MutationParams {
  eventId: string;
  sessionId: string;
  timeId: string;
  locale: string;
}

/**
 * @category Methods
 * @group Events
 */
export const DeleteEventSessionTimeTranslation = async ({
  eventId,
  sessionId,
  timeId,
  locale,
  adminApiParams,
  queryClient,
}: DeleteEventSessionTimeTranslationParams) => {
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.delete(
    `/events/${eventId}/sessions/${sessionId}/times/${timeId}/translations/${locale}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_SESSION_TIME_TRANSLATIONS_QUERY_KEY(
        eventId,
        sessionId,
        timeId
      ),
    });
    queryClient.invalidateQueries({
      queryKey: EVENT_SESSION_TIME_TRANSLATION_QUERY_KEY(
        eventId,
        sessionId,
        timeId,
        locale
      ),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Events
 */
export const useDeleteEventSessionTimeTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteEventSessionTimeTranslation>>,
      Omit<
        DeleteEventSessionTimeTranslationParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteEventSessionTimeTranslationParams,
    Awaited<ReturnType<typeof DeleteEventSessionTimeTranslation>>
  >(DeleteEventSessionTimeTranslation, options);
};
