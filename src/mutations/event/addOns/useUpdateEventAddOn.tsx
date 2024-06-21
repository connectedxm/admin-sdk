import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../../useConnectedMutation";
import { EventAddOn } from "@interfaces";
import { useQueryClient } from "@tanstack/react-query";
import { SET_EVENT_ADD_ON_QUERY_DATA } from "@context/queries/events/addOns/useGetEventAddOn";
import { EVENT_ADD_ONS_QUERY_KEY } from "@context/queries/events/addOns/useGetEventAddOns";

interface UpdateAddOnParams {
  eventId: string;
  addOnId: string;
  addOn: EventAddOn;
}

export const UpdateAddOn = async ({
  eventId,
  addOnId,
  addOn,
}: UpdateAddOnParams): Promise<ConnectedXMResponse<EventAddOn>> => {
  if (!addOnId) throw new Error("Add On ID Undefined");
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.put(
    `/events/${eventId}/addOns/${addOnId}`,
    {
      ...addOn,
      id: undefined,
      event: undefined,
      eventId: undefined,
      allowedTickets: undefined,
      allowedTiers: undefined,
      _count: undefined,
      createdAt: undefined,
      updatedAt: undefined,
      image: undefined,
    }
  );
  return data;
};

export const useUpdateAddOn = (eventId: string, addOnId?: string) => {
  const queryClient = useQueryClient();

  return useConnectedMutation<EventAddOn>(
    (addOn: EventAddOn) =>
      UpdateAddOn({ eventId, addOnId: addOnId || addOn?.id, addOn }),
    {
      onSuccess: (response: Awaited<ReturnType<typeof UpdateAddOn>>) => {
        queryClient.invalidateQueries(EVENT_ADD_ONS_QUERY_KEY(eventId));
        SET_EVENT_ADD_ON_QUERY_DATA(
          queryClient,
          [eventId, addOnId || response.data?.id],
          response
        );
      },
    }
  );
};

export default useUpdateAddOn;
