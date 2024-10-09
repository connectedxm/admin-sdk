import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_FAQ_SECTIONS_QUERY_KEY,
  EVENT_FAQ_SECTION_QUERY_KEY,
} from "@src/queries";

/**
 * @category Params
 * @group Event-Faqs
 */
export interface DeleteEventFaqSectionParams extends MutationParams {
  eventId: string;
  sectionId: string;
}

/**
 * @category Methods
 * @group Event-Faqs
 */
export const DeleteEventFaqSection = async ({
  eventId,
  sectionId,
  adminApiParams,
  queryClient,
}: DeleteEventFaqSectionParams): Promise<ConnectedXMResponse<null>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<null>>(
    `/events/${eventId}/faqs/${sectionId}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_FAQ_SECTIONS_QUERY_KEY(eventId),
    });
    queryClient.removeQueries({
      queryKey: EVENT_FAQ_SECTION_QUERY_KEY(eventId, sectionId),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Faqs
 */
export const useDeleteEventFaqSection = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteEventFaqSection>>,
      Omit<DeleteEventFaqSectionParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteEventFaqSectionParams,
    Awaited<ReturnType<typeof DeleteEventFaqSection>>
  >(DeleteEventFaqSection, options, {
    domain: "events",
    type: "update",
  });
};
