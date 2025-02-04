import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, EventPageTranslation } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_PAGE_TRANSLATIONS_QUERY_KEY,
  SET_EVENT_PAGE_TRANSLATION_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Event-Page-Translation
 */
export interface CreateEventPageTranslationParams extends MutationParams {
  eventId: string;
  pageId: string;
  locale: string;
  autoTranslate?: boolean;
}

/**
 * @category Methods
 * @group Event-Page-Translation
 */
export const CreateEventPageTranslation = async ({
  eventId,
  pageId,
  locale,
  autoTranslate,
  adminApiParams,
  queryClient,
}: CreateEventPageTranslationParams): Promise<
  ConnectedXMResponse<EventPageTranslation>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);

  const { data } = await adminApi.post<
    ConnectedXMResponse<EventPageTranslation>
  >(`/events/${eventId}/pages/${pageId}/translations`, {
    locale,
    autoTranslate,
  });

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_PAGE_TRANSLATIONS_QUERY_KEY(eventId, pageId),
    });
    SET_EVENT_PAGE_TRANSLATION_QUERY_DATA(
      queryClient,
      [eventId, pageId, data?.data.locale],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Page-Translation
 */
export const useCreateEventPageTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateEventPageTranslation>>,
      Omit<CreateEventPageTranslationParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateEventPageTranslationParams,
    Awaited<ReturnType<typeof CreateEventPageTranslation>>
  >(CreateEventPageTranslation, options, {
    domain: "events",
    type: "update",
  });
};
