import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import { ConnectedXMResponse, Login } from "@src/interfaces";
import { LOGINS_QUERY_KEY } from "./useGetLogins";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * @category Keys
 * @group Logins
 */
export const LOGIN_QUERY_KEY = (username: string) => [
  ...LOGINS_QUERY_KEY(),
  username,
];

interface GetLoginProps extends SingleQueryParams {
  username: string;
}

/**
 * @category Queries
 * @group Logins
 */
export const GetLogin = async ({
  username,
  adminApiParams,
}: GetLoginProps): Promise<ConnectedXMResponse<Login>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/logins/${username}`);
  return data;
};
/**
 * @category Hooks
 * @group Logins
 */
export const useGetLogin = (
  username: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetLogin>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetLogin>>(
    LOGIN_QUERY_KEY(username),
    (params: SingleQueryParams) => GetLogin({ username, ...params }),
    {
      ...options,
      enabled: !!username && (options?.enabled ?? true),
    },
    "accounts"
  );
};
