import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, EventPackagePass } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EventPackagePassCreateInputs } from "@src/params";
import { EVENT_PACKAGE_PASSES_QUERY_KEY } from "@src/queries/events/packages/passes/useGetEventPackagePasses";
import { SET_EVENT_PACKAGE_PASS_QUERY_DATA } from "@src/queries/events/packages/passes/useGetEventPackagePass";

/**
 * @category Params
 * @group Event-Packages
 */
export interface CreateEventPackagePassParams extends MutationParams {
  eventId: string;
  packageId: string;
  pass: EventPackagePassCreateInputs;
}

/**
 * @category Methods
 * @group Event-Packages
 */
export const CreateEventPackagePass = async ({
  eventId,
  packageId,
  pass,
  adminApiParams,
  queryClient,
}: CreateEventPackagePassParams): Promise<
  ConnectedXMResponse<EventPackagePass>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<
    ConnectedXMResponse<EventPackagePass>
  >(`/events/${eventId}/packages/${packageId}/passes`, pass);

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_PACKAGE_PASSES_QUERY_KEY(eventId, packageId),
    });
    SET_EVENT_PACKAGE_PASS_QUERY_DATA(
      queryClient,
      [eventId, packageId, data.data.id],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Packages
 */
export const useCreateEventPackagePass = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateEventPackagePass>>,
      Omit<CreateEventPackagePassParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateEventPackagePassParams,
    Awaited<ReturnType<typeof CreateEventPackagePass>>
  >(CreateEventPackagePass, options);
};
