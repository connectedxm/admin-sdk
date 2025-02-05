import { GetAdminAPI } from "@src/AdminAPI";
import { Benefit, ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { BENEFITS_QUERY_KEY, SET_BENEFIT_QUERY_DATA } from "@src/queries";

/**
 * Endpoint to add a benefit to a specific event.
 * This function allows the addition of a benefit to an event by specifying the benefit and event IDs.
 * It is designed to be used in applications where event management and benefit allocation are required.
 * @name AddEventBenefit
 * @param {string} benefitId - The id of the benefit
 * @param {string} eventId - The id of the event
 * @version 1.2
 **/

export interface AddEventBenefitParams extends MutationParams {
  benefitId: string;
  eventId: string;
}

export const AddEventBenefit = async ({
  benefitId,
  eventId,
  adminApiParams,
  queryClient,
}: AddEventBenefitParams): Promise<ConnectedXMResponse<Benefit>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.post<ConnectedXMResponse<Benefit>>(
    `/events/${eventId}/benefits/${benefitId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: BENEFITS_QUERY_KEY() });
    SET_BENEFIT_QUERY_DATA(queryClient, [data.data.id], data);
  }
  return data;
};

export const useAddEventBenefit = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof AddEventBenefit>>,
      Omit<AddEventBenefitParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    AddEventBenefitParams,
    Awaited<ReturnType<typeof AddEventBenefit>>
  >(AddEventBenefit, options, {
    domain: "events",
    type: "update",
  });
};