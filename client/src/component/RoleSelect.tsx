import { Badge, Select, Skeleton } from "@radix-ui/themes";
import { useRoles } from "../hooks/useRoles";
import { useEffect, useState } from "react";

export function RoleSelect({
  defaultValue,
  onValueChange,
}: {
  defaultValue: string | undefined;
  onValueChange: (value: string) => void;
}) {
  const [value, setValue] = useState<string | undefined>(defaultValue);
  const { roles, status } = useRoles();
  const defaultRole = roles?.find((role) => role.isDefault);

  useEffect(() => {
    if (!value && defaultRole) {
      setValue(defaultRole.id);
      onValueChange(defaultRole.id);
    }
  }, [defaultRole, onValueChange, value]);

  if (status === "pending") {
    return <Skeleton height="1.8em" />;
  }

  return (
    <Select.Root
      defaultValue={defaultValue || defaultRole?.id}
      name="roleId"
      value={value}
      onValueChange={(newValue) => {
        onValueChange(newValue);
        setValue(newValue);
      }}
    >
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
