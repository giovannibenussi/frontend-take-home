import {
  Avatar,
  Badge,
  Box,
  DropdownMenu,
  Flex,
  IconButton,
  Skeleton,
  Table,
  Tooltip,
} from "@radix-ui/themes";
import { getRoles, RoleType } from "../api";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { DeleteRoleDialog } from "./DeleteRoleDialog";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { SetDefaultRoleDialog } from "./SetDefaultRoleDialog";
import { EditRoleDialog } from "./EditRoleDialog";
import AddRoleButton from "./AddRoleButton";
import { ErrorCallout } from "./ErrorCallout";

function PendingUIRows() {
  return Array.from({ length: 10 }, () => (
    <Table.Row>
      <Table.Cell>
        <Flex align="center" gap="2">
          <Skeleton>
            <Avatar fallback="" radius="full" size="1" />
          </Skeleton>
          <Skeleton width="120px" height="1.4em">
            Loading...
          </Skeleton>
          <Skeleton width="80px" height="1.4em">
            Loading...
          </Skeleton>
        </Flex>
      </Table.Cell>
      <Table.Cell>
        <Skeleton>Loading...</Skeleton>
      </Table.Cell>
      <Table.Cell>
        <Skeleton>Loading...</Skeleton>
      </Table.Cell>
      <Table.Cell></Table.Cell>
    </Table.Row>
  ));
}

function RoleActions({ role }: { role: RoleType }) {
  const [modal, setModal] = useState<
    "delete" | "setDefault" | "edit" | undefined
  >();

  return (
    <>
      {modal === "delete" && (
        <DeleteRoleDialog role={role} onClose={() => setModal(undefined)} />
      )}
      {modal === "setDefault" && (
        <SetDefaultRoleDialog role={role} onClose={() => setModal(undefined)} />
      )}
      {modal === "edit" && (
        <EditRoleDialog role={role} onClose={() => setModal(undefined)} />
      )}
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <IconButton variant="ghost">
            <span className="sr-only">Actions for the {role.name} role</span>
            <DotsHorizontalIcon />
          </IconButton>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item onClick={() => setModal("edit")}>
            Edit
          </DropdownMenu.Item>
          <DropdownMenu.Item
            onClick={() => !role.isDefault && setModal("setDefault")}
            disabled={role.isDefault}
          >
            Set as default
          </DropdownMenu.Item>
          <DropdownMenu.Item
            color="red"
            onClick={() => !role.isDefault && setModal("delete")}
            disabled={role.isDefault}
          >
            Delete
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
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
    <Flex direction="column" gap="4">
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
              <PendingUIRows />
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
