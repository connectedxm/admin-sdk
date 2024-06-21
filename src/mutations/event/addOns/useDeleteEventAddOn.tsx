import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../../useConnectedMutation";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { EVENT_ADD_ONS_QUERY_KEY } from "@context/queries/events/addOns/useGetEventAddOns";
import { EVENT_ADD_ON_QUERY_KEY } from "@context/queries/events/addOns/useGetEventAddOn";

interface DeleteAddOnParams {
  eventId: string;
  addOnId: string;
}

export const DeleteAddOn = async ({
  eventId,
  addOnId,
}: DeleteAddOnParams): Promise<ConnectedXMResponse<null>> => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.delete(
    `/events/${eventId}/addOns/${addOnId}`
  );
  return data;
};

export const useDeleteAddOn = (eventId: string, addOnId: string) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useConnectedMutation(() => DeleteAddOn({ eventId, addOnId }), {
    onSuccess: async (_response: Awaited<ReturnType<typeof DeleteAddOn>>) => {
      await router.push(`/events/${eventId}/addOns`);
      queryClient.invalidateQueries(EVENT_ADD_ONS_QUERY_KEY(eventId));
      queryClient.removeQueries(EVENT_ADD_ON_QUERY_KEY(eventId, addOnId));
    },
  });
};

export default useDeleteAddOn;
