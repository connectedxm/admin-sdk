import {
  MutationFunction,
  QueryClient,
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query";
import { AxiosError } from "axios";
import {
  ConnectedXMResponse,
  PermissionDomain,
  PermissionType,
  useConnectedXM,
} from "..";
import { AdminApiParams } from "@src/AdminAPI";
import usePermission from "@src/utilities/usePermission";

export interface MutationParams {
  adminApiParams: AdminApiParams;
  queryClient?: QueryClient;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ConnectedXMMutationOptions<TResponseData, TMutationParams>
  extends UseMutationOptions<
    TResponseData,
    AxiosError<TResponseData>,
    TMutationParams
  > {}

export const useConnectedMutation = <
  TMutationParams extends MutationParams,
  TResponseData extends ConnectedXMResponse<any>
>(
  mutation: MutationFunction<TResponseData, TMutationParams>,
  options?: Omit<
    ConnectedXMMutationOptions<
      TResponseData,
      Omit<TMutationParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  >,
  permission?: {
    domain: PermissionDomain | PermissionDomain[];
    type: PermissionType | PermissionType[];
  }
) => {
  const { apiUrl, getToken, organizationId, getExecuteAs, onMutationError } =
    useConnectedXM();
  const queryClient = useQueryClient();

  const { allowed, enabled } = usePermission(
    permission?.domain,
    permission?.type
  );

  return useMutation<
    TResponseData,
    AxiosError<TResponseData>,
    Omit<TMutationParams, "queryClient" | "adminApiParams">
  >({
    mutationFn: (data) => {
      if (!!permission?.domain && !!permission.type) {
        if (!enabled) {
          throw Error(
            `${capitalize(permission.type.toString())} ${
              permission.domain
            } feature not enabled`
          );
        } else if (!allowed) {
          throw Error(
            `Missing ${permission.type} ${permission.domain} permission`
          );
        }
      }
      return mutation({
        queryClient,
        adminApiParams: {
          apiUrl,
          getToken,
          organizationId,
          getExecuteAs,
        },
        ...data,
      } as TMutationParams);
    },
    ...options,
    onError: (error, variables, context) => {
      if (onMutationError) onMutationError(error, variables, context);
      if (options?.onError) options.onError(error, variables, context);
    },
  });
};

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
