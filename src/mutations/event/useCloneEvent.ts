import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { ConnectedXMResponse } from "@src/interfaces";
import { CloneOptions } from "@src/params";

/**
 * Endpoint to clone an existing event.
 * This function allows users to create a duplicate of an existing event by providing the event ID and cloning options.
 * It is useful in scenarios where similar events need to be created with minimal changes.
 * @name CloneEvent
 * @param {string} eventId - The id of the event to be cloned
 * @param {CloneOptions} options - Options for cloning the event
 * @version 1.2
 **/
export interface CloneEventParams extends MutationParams {
  eventId: string;
  options: CloneOptions;
}

export const CloneEvent = async ({
  eventId,
  options,
  adminApiParams,
}: CloneEventParams): Promise<
  ConnectedXMResponse<{ id: string; slug: string }>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.post<
    ConnectedXMResponse<{ id: string; slug: string }>
  >(`/events/${eventId}/clone`, options);
  return data;
};

export const useCloneEvent = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CloneEvent>>,
      Omit<CloneEventParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CloneEventParams,
    Awaited<ReturnType<typeof CloneEvent>>
  >(CloneEvent, options, {
    domain: "events",
    type: "create",
  });
};