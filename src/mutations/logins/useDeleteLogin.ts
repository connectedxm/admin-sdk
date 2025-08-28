import { Login, ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import {
  LOGINS_QUERY_KEY,
  LOGIN_QUERY_KEY,
} from "@src/queries";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * @category Params
 * @group Logins
 */
export interface DeleteLoginParams extends MutationParams {
  sub: string;
}

/**
 * @category Methods
 * @group Logins
 */
export const DeleteLogin = async ({
  sub,
  adminApiParams,
  queryClient,
}: DeleteLoginParams): Promise<ConnectedXMResponse<Login>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<Login>>(
    `/logins/${sub}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: LOGINS_QUERY_KEY(),
    });
    queryClient.invalidateQueries({
      queryKey: LOGIN_QUERY_KEY(sub),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Logins
 */
export const useDeleteLogin = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteLogin>>,
      Omit<DeleteLoginParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteLoginParams,
    Awaited<ReturnType<typeof DeleteLogin>>
  >(DeleteLogin, options, {
    domain: "accounts",
    type: "update",
  });
};
