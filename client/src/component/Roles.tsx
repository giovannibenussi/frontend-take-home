import { Badge, Box, Flex, Skeleton, Table, Tooltip } from "@radix-ui/themes";
import { getRoles, RoleType } from "../api";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { DeleteRoleDialog } from "./DeleteRoleDialog";
import { SetDefaultRoleDialog } from "./SetDefaultRoleDialog";
import AddRoleButton from "./AddRoleButton";
import { ErrorCallout } from "./ErrorCallout";
import { Actions } from "./Actions";
import AddRoleDialog from "./AddRoleDialog";

function PendingUIRows({ length }: { length: number }) {
  return Array.from({ length }, () => (
    <Table.Row>
      <Table.Cell>
        <Skeleton width="150px" height="1.4em" className="block">
          Loading...
        </Skeleton>
      </Table.Cell>
      <Table.Cell colSpan={2}>
        <Skeleton width="300px" height="1.4em" className="block">
          Loading...
        </Skeleton>
      </Table.Cell>
    </Table.Row>
  ));
}

function RoleActions({ role }: { role: RoleType }) {
  const [modal, setModal] = useState<string | undefined>();

  return (
    <>
      <Actions
        label={`Actions for the ${role.name} role`}
        onValueChange={(action) => setModal(action)}
        actions={[
          { label: "Edit role", action: "edit", disabled: false },
          {
            label: "Set as default",
            action: "setDefault",
            disabled: role.isDefault,
          },
          { label: "Delete role", action: "delete", disabled: role.isDefault },
        ]}
      />
      <DeleteRoleDialog
        role={role}
        open={modal === "delete"}
        onOpenChange={() => setModal(undefined)}
      />
      <SetDefaultRoleDialog
        role={role}
        open={modal === "setDefault"}
        onOpenChange={() => setModal(undefined)}
      />
      <AddRoleDialog
        role={role}
        open={modal === "edit"}
        onOpenChange={() => setModal(undefined)}
      />
    </>
  );
}

export function Roles() {
  const { data, status } = useQuery({
    queryKey: ["roles"],
    queryFn: () => getRoles(),
  });
  const roles = data?.data;

  return (
    <Flex direction="column" gap="5">
      <Box className="self-end">
        <AddRoleButton />
      </Box>

      {status === "error" ? (
        <ErrorCallout content="There was an error loading the roles." />
      ) : (
        <Table.Root variant="surface">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Description</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>
                <span className="sr-only">Actions</span>
              </Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {status === "pending" ? (
              <PendingUIRows length={10} />
            ) : (
              roles?.map((role) => (
                <Table.Row key={role.id}>
                  <Table.Cell>
                    <Flex align="center" gap="2">
                      {role.name}
                      {role.isDefault && (
                        <Tooltip content="Default role assigned to new users">
                          <Badge>Default</Badge>
                        </Tooltip>
                      )}
                    </Flex>
                  </Table.Cell>
                  <Table.Cell>{role.description}</Table.Cell>
                  <Table.Cell>
                    <RoleActions role={role} />
                  </Table.Cell>
                </Table.Row>
              ))
            )}
          </Table.Body>
        </Table.Root>
      )}
    </Flex>
  );
}
