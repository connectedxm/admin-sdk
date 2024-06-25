import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, FaqSection } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_FAQ_SECTIONS_QUERY_KEY,
  SET_EVENT_FAQ_SECTION_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Event-Faqs
 */
export interface UpdateEventFAQSectionParams extends MutationParams {
  eventId: string;
  sectionId: string;
  section: FaqSection;
}

/**
 * @category Methods
 * @group Event-Faqs
 */
export const UpdateEventFAQSection = async ({
  eventId,
  sectionId,
  section,
  adminApiParams,
  queryClient,
}: UpdateEventFAQSectionParams): Promise<ConnectedXMResponse<FaqSection>> => {
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
export const useUpdateEventFAQSection = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateEventFAQSection>>,
      Omit<UpdateEventFAQSectionParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateEventFAQSectionParams,
    Awaited<ReturnType<typeof UpdateEventFAQSection>>
  >(UpdateEventFAQSection, options);
};
