import { useQuery } from "@tanstack/react-query";
import { getRoles } from "../api";

export function useRoles() {
  const { data, status } = useQuery({
    queryKey: ["roles"],
    queryFn: () => getRoles(),
  });
  const roles = data?.data;

  return { roles, status };
}
