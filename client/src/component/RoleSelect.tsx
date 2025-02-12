import { Badge, Select, Skeleton } from "@radix-ui/themes";
import { useRoles } from "../hooks/useRoles";

export function RoleSelect({
  defaultValue,
}: {
  defaultValue: string | undefined;
}) {
  const { roles, status } = useRoles();
  if (status === "pending") {
    return <Skeleton height="1.8em" />;
  }
  const defaultRole = roles?.find((role) => role.isDefault);

  return (
    <Select.Root defaultValue={defaultValue || defaultRole?.id} name="roleId">
      <Select.Trigger />
      <Select.Content>
        <Select.Group>
          {roles?.map((role) => (
            <Select.Item key={role.id} value={role.id}>
              {role.name} {role.isDefault && <Badge>Default</Badge>}
            </Select.Item>
          ))}
        </Select.Group>
      </Select.Content>
    </Select.Root>
  );
}
