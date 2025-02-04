import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_SECTIONS_QUERY_KEY,
  EVENT_SECTION_QUERY_KEY,
} from "@src/queries";

/**
 * @category Params
 * @group Event-Sections
 */
export interface DeleteEventSectionParams extends MutationParams {
  eventId: string;
  sectionId: string;
}

/**
 * @category Methods
 * @group Event-Sections
 */
export const DeleteEventSection = async ({
  eventId,
  sectionId,
  adminApiParams,
  queryClient,
}: DeleteEventSectionParams): Promise<ConnectedXMResponse<null>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.delete<ConnectedXMResponse<null>>(
    `/events/${eventId}/sections/${sectionId}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_SECTIONS_QUERY_KEY(eventId),
    });
    queryClient.removeQueries({
      queryKey: EVENT_SECTION_QUERY_KEY(eventId, sectionId),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Sections
 */
export const useDeleteEventSection = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteEventSection>>,
      Omit<DeleteEventSectionParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteEventSectionParams,
    Awaited<ReturnType<typeof DeleteEventSection>>
  >(DeleteEventSection, options, {
    domain: "events",
    type: "update",
  });
};
