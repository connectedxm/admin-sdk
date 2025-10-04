import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_SESSION_SECTIONS_QUERY_KEY,
  EVENT_SESSION_SECTION_QUERY_KEY,
} from "@src/queries";

/**
 * @category Params
 * @group Events
 */
export interface DeleteEventSessionSectionParams extends MutationParams {
  eventId: string;
  sessionId: string;
  sectionId: string;
}

/**
 * @category Methods
 * @group Events
 */
export const DeleteEventSessionSection = async ({
  eventId,
  sessionId,
  sectionId,
  adminApiParams,
  queryClient,
}: DeleteEventSessionSectionParams): Promise<ConnectedXMResponse<null>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<null>>(
    `/events/${eventId}/sessions/${sessionId}/sections/${sectionId}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_SESSION_SECTIONS_QUERY_KEY(eventId, sessionId),
    });
    queryClient.removeQueries({
      queryKey: EVENT_SESSION_SECTION_QUERY_KEY(eventId, sessionId, sectionId),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Events
 */
export const useDeleteEventSessionSection = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteEventSessionSection>>,
      Omit<DeleteEventSessionSectionParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteEventSessionSectionParams,
    Awaited<ReturnType<typeof DeleteEventSessionSection>>
  >(DeleteEventSessionSection, options);
};
