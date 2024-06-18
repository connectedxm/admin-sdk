import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../useConnectedMutation";
import { Activity } from "@interfaces";
import { useQueryClient } from "@tanstack/react-query";
import { SET_ACTIVITY_QUERY_DATA } from "@queries/activities/useGetActivity";
import { ACTIVITIES_QUERY_KEY } from "@context/queries/activities/useGetActivities";

interface UpdateActivityParams {
  activityId: string;
  activity: Activity;
}

export const UpdateActivity = async ({
  activityId,
  activity,
}: UpdateActivityParams): Promise<ConnectedXMResponse<Activity>> => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.put(`/activities/${activityId}`, activity);
  return data;
};

export const useUpdateActivity = (activityId: string) => {
  const queryClient = useQueryClient();

  return useConnectedMutation<Activity>(
    (activity: Activity) => UpdateActivity({ activityId, activity }),
    {
      onSuccess: (response: Awaited<ReturnType<typeof UpdateActivity>>) => {
        SET_ACTIVITY_QUERY_DATA(queryClient, [activityId], response);
        queryClient.invalidateQueries(ACTIVITIES_QUERY_KEY());
      },
    }
  );
};

export default useUpdateActivity;
