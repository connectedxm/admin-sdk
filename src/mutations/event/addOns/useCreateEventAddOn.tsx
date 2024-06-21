import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../../useConnectedMutation";
import { EventAddOn } from "@interfaces";
import { useQueryClient } from "@tanstack/react-query";
import { EVENT_ADD_ONS_QUERY_KEY } from "@context/queries/events/addOns/useGetEventAddOns";
import { SET_EVENT_ADD_ON_QUERY_DATA } from "@context/queries/events/addOns/useGetEventAddOn";

interface CreateAddOnParams {
  eventId: string;
  addOn: EventAddOn;
}

export const CreateAddOn = async ({
  eventId,
  addOn,
}: CreateAddOnParams): Promise<ConnectedXMResponse<EventAddOn>> => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.post(`/events/${eventId}/addOns`, addOn);
  return data;
};

export const useCreateAddOn = (eventId: string) => {
  const queryClient = useQueryClient();

  return useConnectedMutation<EventAddOn>(
    (addOn: EventAddOn) => CreateAddOn({ eventId, addOn }),
    {
      onSuccess: (response: Awaited<ReturnType<typeof CreateAddOn>>) => {
        queryClient.invalidateQueries(EVENT_ADD_ONS_QUERY_KEY(eventId));
        SET_EVENT_ADD_ON_QUERY_DATA(
          queryClient,
          [eventId, response.data.id],
          response
        );
      },
    }
  );
};

export default useCreateAddOn;
