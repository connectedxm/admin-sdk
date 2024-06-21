import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../../useConnectedMutation";
import { useQueryClient } from "@tanstack/react-query";
import { EventAddOn } from "@interfaces";
import { EVENT_ADD_ON_TIERS_QUERY_KEY } from "@context/queries/events/addOns/useGetEventAddOnTiers";
import { SET_EVENT_ADD_ON_QUERY_DATA } from "@context/queries/events/addOns/useGetEventAddOn";

interface AddEventAddOnTierParams {
  eventId: string;
  addOnId: string;
  tierId: string;
}

export const AddEventAddOnTier = async ({
  eventId,
  addOnId,
  tierId,
}: AddEventAddOnTierParams): Promise<ConnectedXMResponse<EventAddOn>> => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.post(
    `/events/${eventId}/addOns/${addOnId}/tiers/${tierId}`
  );
  return data;
};

export const useAddEventAddOnTier = (eventId: string, addOnId: string) => {
  const queryClient = useQueryClient();

  return useConnectedMutation<string>(
    (tierId: string) => AddEventAddOnTier({ eventId, addOnId, tierId }),
    {
      onSuccess: (response: Awaited<ReturnType<typeof AddEventAddOnTier>>) => {
        queryClient.invalidateQueries(
          EVENT_ADD_ON_TIERS_QUERY_KEY(eventId, addOnId)
        );
        SET_EVENT_ADD_ON_QUERY_DATA(queryClient, [eventId, addOnId], response);
      },
    }
  );
};

export default useAddEventAddOnTier;
