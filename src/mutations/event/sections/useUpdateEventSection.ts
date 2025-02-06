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
 * Updates a specific section of an event with new data.
 * This function allows for the modification of event sections by providing new data inputs.
 * It is used in scenarios where event details need to be updated or modified.
 * @name UpdateEventSection
 * @param {string} eventId (path) - The id of the event
 * @param {string} sectionId (path) - The id of the section
 * @param {EventSectionUpdateInputs} section (body) - The new data for the section
 * @version 1.3
 **/
export interface UpdateEventSectionParams extends MutationParams {
  eventId: string;
  sectionId: string;
  section: EventSectionUpdateInputs;
}

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