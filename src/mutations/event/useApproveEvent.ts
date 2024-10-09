import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { ConnectedXMResponse, Event } from "@src/interfaces";
import {
  SET_EVENT_QUERY_DATA,
  EVENTS_QUERY_KEY,
  UNAPPROVED_EVENTS_QUERY_KEY,
} from "@src/queries";

/**
 * @category Params
 * @group Event
 */
export interface ApproveEventParams extends MutationParams {
  eventId: string;
}

/**
 * @category Methods
 * @group Event
 */
export const ApproveEvent = async ({
  eventId,
  adminApiParams,
  queryClient,
}: ApproveEventParams): Promise<ConnectedXMResponse<Event>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<Event>>(
    `/events/${eventId}/approve`
  );
  if (queryClient && data.status === "ok") {
    SET_EVENT_QUERY_DATA(queryClient, [data.data?.id], data);
    queryClient.invalidateQueries({ queryKey: EVENTS_QUERY_KEY() });
    queryClient.invalidateQueries({ queryKey: UNAPPROVED_EVENTS_QUERY_KEY() });
  }
  return data;
};

/**
 * @category Mutations
 * @group Event
 */
export const useApproveEvent = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof ApproveEvent>>,
      Omit<ApproveEventParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    ApproveEventParams,
    Awaited<ReturnType<typeof ApproveEvent>>
  >(ApproveEvent, options, {
    domain: "events",
    type: "update",
  });
};
