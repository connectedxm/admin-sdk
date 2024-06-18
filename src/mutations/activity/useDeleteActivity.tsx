import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../useConnectedMutation";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { ACTIVITIES_QUERY_KEY } from "@queries/activities/useGetActivities";
import { ACTIVITY_QUERY_KEY } from "@context/queries/activities/useGetActivity";

interface DeleteActivityParams {
  activityId: string;
}

export const DeleteActivity = async ({
  activityId,
}: DeleteActivityParams): Promise<ConnectedXMResponse<null>> => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.delete(`/activities/${activityId}`);
  return data;
};

export const useDeleteActivity = (activityId: string) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useConnectedMutation(() => DeleteActivity({ activityId }), {
    onSuccess: async (
      _response: Awaited<ReturnType<typeof DeleteActivity>>
    ) => {
      await router.push("/activities");
      queryClient.invalidateQueries(ACTIVITIES_QUERY_KEY());
      queryClient.removeQueries(ACTIVITY_QUERY_KEY(activityId));
    },
  });
};

export default useDeleteActivity;
