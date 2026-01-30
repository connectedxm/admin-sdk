import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, FaqSection } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EventFaqSectionUpdateInputs } from "@src/params";
import {
  EVENT_FAQ_SECTIONS_QUERY_KEY,
  SET_EVENT_FAQ_SECTION_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Event-Faqs
 */
export interface UpdateEventFaqSectionParams extends MutationParams {
  eventId: string;
  sectionId: string;
  section: EventFaqSectionUpdateInputs;
}

/**
 * @category Methods
 * @group Event-Faqs
 */
export const UpdateEventFaqSection = async ({
  eventId,
  sectionId,
  section,
  adminApiParams,
  queryClient,
}: UpdateEventFaqSectionParams): Promise<ConnectedXMResponse<FaqSection>> => {
  if (!sectionId) throw new Error("Section ID Undefined");
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put<ConnectedXMResponse<FaqSection>>(
    `/events/${eventId}/faqs/${sectionId}`,
    {
      ...section,
      id: undefined,
      faqs: undefined,
      organizationId: undefined,
      eventId: undefined,
      event: undefined,
      createdAt: undefined,
      updatedAt: undefined,
    }
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_FAQ_SECTIONS_QUERY_KEY(eventId),
    });
    SET_EVENT_FAQ_SECTION_QUERY_DATA(
      queryClient,
      [eventId, sectionId || data.data.id],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Faqs
 */
export const useUpdateEventFaqSection = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateEventFaqSection>>,
      Omit<UpdateEventFaqSectionParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateEventFaqSectionParams,
    Awaited<ReturnType<typeof UpdateEventFaqSection>>
  >(UpdateEventFaqSection, options);
};
