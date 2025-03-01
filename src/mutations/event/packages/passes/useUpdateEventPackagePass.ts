import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, EventPackagePass } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EventPackagePassUpdateInputs } from "@src/params";
import { EVENT_PACKAGE_PASSES_QUERY_KEY } from "@src/queries/events/packages/passes/useGetEventPackagePasses";
import { SET_EVENT_PACKAGE_PASS_QUERY_DATA } from "@src/queries/events/packages/passes/useGetEventPackagePass";

/**
 * @category Params
 * @group Event-Packages
 */
export interface UpdateEventPackagePassParams extends MutationParams {
  eventId: string;
  packageId: string;
  passId: string;
  pass: EventPackagePassUpdateInputs;
}

/**
 * @category Methods
 * @group Event-Packages
 */
export const UpdateEventPackagePass = async ({
  eventId,
  packageId,
  passId,
  pass,
  adminApiParams,
  queryClient,
}: UpdateEventPackagePassParams): Promise<
  ConnectedXMResponse<EventPackagePass>
> => {
  if (!passId) throw new Error("Pass ID Undefined");
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put<ConnectedXMResponse<EventPackagePass>>(
    `/events/${eventId}/packages/${packageId}/passes/${passId}`,
    {
      ...pass,
      id: undefined,
      createdAt: undefined,
      updatedAt: undefined,
      passType: undefined,
    }
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_PACKAGE_PASSES_QUERY_KEY(eventId, packageId),
    });
    SET_EVENT_PACKAGE_PASS_QUERY_DATA(
      queryClient,
      [eventId, packageId, passId || data.data?.id],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Packages
 */
export const useUpdateEventPackagePass = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateEventPackagePass>>,
      Omit<UpdateEventPackagePassParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateEventPackagePassParams,
    Awaited<ReturnType<typeof UpdateEventPackagePass>>
  >(UpdateEventPackagePass, options, {
    domain: "events",
    type: "update",
  });
};
