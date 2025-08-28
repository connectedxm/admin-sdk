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
export const LOGIN_QUERY_KEY = (sub: string) => [...LOGINS_QUERY_KEY(), sub];

interface GetLoginProps extends SingleQueryParams {
  sub: string;
}

/**
 * @category Queries
 * @group Logins
 */
export const GetLogin = async ({
  sub,
  adminApiParams,
}: GetLoginProps): Promise<ConnectedXMResponse<Login>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/logins/${sub}`);
  return data;
};
/**
 * @category Hooks
 * @group Logins
 */
export const useGetLogin = (
  sub: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetLogin>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetLogin>>(
    LOGIN_QUERY_KEY(sub),
    (params: SingleQueryParams) => GetLogin({ sub, ...params }),
    {
      ...options,
      enabled: !!sub && (options?.enabled ?? true),
    },
    "accounts"
  );
};
