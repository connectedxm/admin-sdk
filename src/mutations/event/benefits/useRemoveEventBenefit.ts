import { GetAdminAPI } from "@src/AdminAPI";
import { Benefit, ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { BENEFITS_QUERY_KEY, SET_BENEFIT_QUERY_DATA } from "@src/queries";

/**
 * Endpoint to remove a benefit from a specific event.
 * This function allows the removal of a benefit associated with an event by specifying the event and benefit IDs.
 * It is designed to be used in applications where event management and benefit association are required.
 * @name RemoveEventBenefit
 * @param {string} benefitId (path) - The id of the benefit to be removed
 * @param {string} eventId (path) - The id of the event from which the benefit is to be removed
 * @version 1.3
 **/
export interface RemoveEventBenefitParams extends MutationParams {
  benefitId: string;
  eventId: string;
}

export const RemoveEventBenefit = async ({
  benefitId,
  eventId,
  adminApiParams,
  queryClient,
}: RemoveEventBenefitParams): Promise<ConnectedXMResponse<Benefit>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.delete<ConnectedXMResponse<Benefit>>(
    `/events/${eventId}/benefits/${benefitId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: BENEFITS_QUERY_KEY() });
    SET_BENEFIT_QUERY_DATA(queryClient, [data.data.id], data);
  }
  return data;
};

export const useRemoveEventBenefit = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof RemoveEventBenefit>>,
      Omit<RemoveEventBenefitParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    RemoveEventBenefitParams,
    Awaited<ReturnType<typeof RemoveEventBenefit>>
  >(RemoveEventBenefit, options, {
    domain: "events",
    type: "update",
  });
};