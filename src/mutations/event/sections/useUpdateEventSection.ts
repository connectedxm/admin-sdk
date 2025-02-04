import { GetAdminAPI } from "@src/AdminAPI";
import { RegistrationSection, ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EventSectionUpdateInputs } from "@src/params";
import {
  EVENT_SECTIONS_QUERY_KEY,
  SET_EVENT_SECTION_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Event-Sections
 */
export interface UpdateEventSectionParams extends MutationParams {
  eventId: string;
  sectionId: string;
  section: EventSectionUpdateInputs;
}

/**
 * @category Methods
 * @group Event-Sections
 */
export const UpdateEventSection = async ({
  eventId,
  sectionId,
  section,
  adminApiParams,
  queryClient,
}: UpdateEventSectionParams): Promise<
  ConnectedXMResponse<RegistrationSection>
> => {
  if (!sectionId) throw new Error("Section ID Undefined");
  const adminApi = await GetAdminAPI(adminApiParams);

  const { data } = await adminApi.put<ConnectedXMResponse<RegistrationSection>>(
    `/events/${eventId}/sections/${sectionId}`,
    {
      ...section,
      id: undefined,
      eventId: undefined,
      questions: undefined,
      eventTickets: undefined,
      accountTiers: undefined,
      _count: undefined,
      createdAt: undefined,
      updatedAt: undefined,
    }
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_SECTIONS_QUERY_KEY(eventId),
    });
    SET_EVENT_SECTION_QUERY_DATA(
      queryClient,
      [eventId, sectionId || data.data?.id.toString()],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Sections
 */
export const useUpdateEventSection = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateEventSection>>,
      Omit<UpdateEventSectionParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateEventSectionParams,
    Awaited<ReturnType<typeof UpdateEventSection>>
  >(UpdateEventSection, options, {
    domain: "events",
    type: "update",
  });
};
