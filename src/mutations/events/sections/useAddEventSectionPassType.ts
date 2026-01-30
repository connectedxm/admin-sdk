import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, RegistrationSection } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_SECTION_PASS_TYPES_QUERY_KEY,
  SET_EVENT_SECTION_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Event-Sections
 */
export interface AddEventSectionPassTypeParams extends MutationParams {
  eventId: string;
  sectionId: string;
  passTypeId: string;
}

/**
 * @category Methods
 * @group Event-Sections
 */
export const AddEventSectionPassType = async ({
  eventId,
  sectionId,
  passTypeId,
  adminApiParams,
  queryClient,
}: AddEventSectionPassTypeParams): Promise<
  ConnectedXMResponse<RegistrationSection>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<
    ConnectedXMResponse<RegistrationSection>
  >(`/events/${eventId}/sections/${sectionId}/passTypes/${passTypeId}`);
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_SECTION_PASS_TYPES_QUERY_KEY(eventId, sectionId),
    });
    SET_EVENT_SECTION_QUERY_DATA(queryClient, [eventId, sectionId], data);
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Sections
 */
export const useAddEventSectionPassType = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof AddEventSectionPassType>>,
      Omit<AddEventSectionPassTypeParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    AddEventSectionPassTypeParams,
    Awaited<ReturnType<typeof AddEventSectionPassType>>
  >(AddEventSectionPassType, options);
};
