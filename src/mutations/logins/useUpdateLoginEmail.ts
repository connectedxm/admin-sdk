import { Login, ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { LOGINS_QUERY_KEY, LOGIN_QUERY_KEY } from "@src/queries";
import { GetAdminAPI } from "@src/AdminAPI";
/**
 * @category Params
 * @group Logins
 */
export interface UpdateLoginEmailParams extends MutationParams {
  username: string;
  email: string;
}

/**
 * @category Methods
 * @group Logins
 */
export const UpdateLoginEmail = async ({
  username,
  email,
  adminApiParams,
  queryClient,
}: UpdateLoginEmailParams): Promise<ConnectedXMResponse<Login>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put<ConnectedXMResponse<Login>>(
    `/logins/${username}/email`,
    { email }
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: LOGINS_QUERY_KEY(),
    });
    queryClient.invalidateQueries({
      queryKey: LOGIN_QUERY_KEY(username),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Logins
 */
export const useUpdateLoginEmail = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateLoginEmail>>,
      Omit<UpdateLoginEmailParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateLoginEmailParams,
    Awaited<ReturnType<typeof UpdateLoginEmail>>
  >(UpdateLoginEmail, options, {
    domain: "accounts",
    type: "update",
  });
};
