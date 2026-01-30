import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { ConnectedXMResponse } from "@src/interfaces";
import { CloneOptions } from "@src/params";

/**
 * @category Params
 * @group Event
 */
export interface CloneEventParams extends MutationParams {
  eventId: string;
  options: CloneOptions;
}

/**
 * @category Methods
 * @group Event
 */
export const CloneEvent = async ({
  eventId,
  options,
  adminApiParams,
}: CloneEventParams): Promise<
  ConnectedXMResponse<{ id: string; slug: string }>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<
    ConnectedXMResponse<{ id: string; slug: string }>
  >(`/events/${eventId}/clone`, options);
  return data;
};

/**
 * @category Mutations
 * @group Event
 */
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
  >(CloneEvent, options);
};
