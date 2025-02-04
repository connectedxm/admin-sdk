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
export interface RemoveEventSectionPassTypeParams extends MutationParams {
  eventId: string;
  sectionId: string;
  passTypeId: string;
}

/**
 * @category Methods
 * @group Event-Sections
 */
export const RemoveEventSectionPassType = async ({
  eventId,
  sectionId,
  passTypeId,
  adminApiParams,
  queryClient,
}: RemoveEventSectionPassTypeParams): Promise<
  ConnectedXMResponse<RegistrationSection>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.delete<
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
export const useRemoveEventSectionPassType = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof RemoveEventSectionPassType>>,
      Omit<RemoveEventSectionPassTypeParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    RemoveEventSectionPassTypeParams,
    Awaited<ReturnType<typeof RemoveEventSectionPassType>>
  >(RemoveEventSectionPassType, options, {
    domain: "events",
    type: "update",
  });
};
