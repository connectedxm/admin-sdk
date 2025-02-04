import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, RegistrationSection } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_SECTION_TIERS_QUERY_KEY,
  SET_EVENT_SECTION_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Event-Sections
 */
export interface RemoveEventSectionTierParams extends MutationParams {
  allowed: boolean;
  eventId: string;
  sectionId: string;
  tierId: string;
}

/**
 * @category Methods
 * @group Event-Sections
 */
export const RemoveEventSectionTier = async ({
  allowed,
  eventId,
  sectionId,
  tierId,
  adminApiParams,
  queryClient,
}: RemoveEventSectionTierParams): Promise<
  ConnectedXMResponse<RegistrationSection>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.delete<
    ConnectedXMResponse<RegistrationSection>
  >(`/events/${eventId}/sections/${sectionId}/tiers/${tierId}`, {
    params: {
      allowed,
    },
  });
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_SECTION_TIERS_QUERY_KEY(allowed, eventId, sectionId),
    });
    SET_EVENT_SECTION_QUERY_DATA(queryClient, [eventId, sectionId], data);
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Sections
 */
export const useRemoveEventSectionTier = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof RemoveEventSectionTier>>,
      Omit<RemoveEventSectionTierParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    RemoveEventSectionTierParams,
    Awaited<ReturnType<typeof RemoveEventSectionTier>>
  >(RemoveEventSectionTier, options, {
    domain: "events",
    type: "update",
  });
};
