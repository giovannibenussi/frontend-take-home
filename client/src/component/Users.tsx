import {
  Flex,
  Table,
  Avatar,
  IconButton,
  Skeleton,
  TextField,
  Button,
  DropdownMenu,
} from "@radix-ui/themes";
import { DotsHorizontalIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { QueryStatus, useQuery } from "@tanstack/react-query";
import { getUsers, UserType } from "../api";
import { useState } from "react";
import { useDebounceValue } from "usehooks-ts";
import { DeleteUserDialog } from "./DeleteUserDialog";
import AddUserDialog from "./AddUserDialog";
import { ErrorCallout } from "./ErrorCallout";
import { AddUserButton } from "./AddUserButton";
import { LoadingSR } from "./LoadingSR";

function PendingUIRows() {
  return Array.from({ length: 10 }, (_, i) => (
    <Table.Row key={i + ""}>
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

function formatDate(dateStr: string) {
  const date = new Date(dateStr);

  const formattedDate = date.toLocaleDateString(undefined, {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });

  return formattedDate;
}

function UserActions({ user }: { user: UserType }) {
  const [modal, setModal] = useState<"delete" | "edit" | undefined>();

  return (
    <>
      {modal === "edit" && (
        <AddUserDialog user={user} onClose={() => setModal(undefined)} />
      )}
      {modal === "delete" && (
        <DeleteUserDialog user={user} onClose={() => setModal(undefined)} />
      )}
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <IconButton variant="ghost" color="gray" radius="full" size="1">
            <span className="sr-only">
              Actions for user {user.first} {user.last}
            </span>
            <DotsHorizontalIcon />
          </IconButton>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content align="end" sideOffset={4} alignOffset={4}>
          <DropdownMenu.Item onClick={() => setModal("edit")} className="!pr-8">
            Edit user
          </DropdownMenu.Item>
          <DropdownMenu.Item
            onClick={() => setModal("delete")}
            className="!pr-8"
          >
            Delete user
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </>
  );
}

function UserAvatar({ user }: { user: UserType }) {
  return (
    <Avatar
      src={user.photo}
      fallback={user.first.slice(0, 1)}
      alt={`Avatar of ${user.first} ${user.last}`}
      size="1"
      radius="full"
    />
  );
}

function UsersTable({
  data,
  status,
  onPageChange,
}: {
  data: Awaited<ReturnType<typeof getUsers>> | undefined;
  status: QueryStatus;
  onPageChange: (page: number) => void;
}) {
  const { usersWithRoles: users, prev, next } = data || {};

  if (status === "error") {
    return <ErrorCallout content="There was an error loading the users." />;
  }

  return (
    <Table.Root variant="surface">
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeaderCell>User</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Role</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Joined</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>
            <span className="sr-only">Actions</span>
          </Table.ColumnHeaderCell>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {status === "pending" ? (
          <PendingUIRows />
        ) : (
          users?.map((user) => (
            <Table.Row key={user.id}>
              <Table.Cell py="2">
                <Flex align="center" gap="2">
                  <UserAvatar user={user} />
                  {user.first} {user.last}
                </Flex>
              </Table.Cell>
              <Table.Cell>{user.role?.name || "-"}</Table.Cell>
              <Table.Cell>{formatDate(user.createdAt)}</Table.Cell>
              <Table.Cell className="flex justify-end">
                <UserActions user={user} />
              </Table.Cell>
            </Table.Row>
          ))
        )}
        <Table.Row>
          <Table.Cell colSpan={4} py="2">
            <Flex justify="end" gap="2">
              <Button
                type="button"
                color="gray"
                variant={!prev ? "soft" : "surface"}
                disabled={!prev}
                onClick={() => prev && onPageChange(prev)}
                size="1"
                aria-label="Previous Page"
              >
                Previous
              </Button>

              <Button
                type="button"
                color="gray"
                variant="surface"
                onClick={() => next && onPageChange(next)}
                disabled={!next}
                size="1"
                aria-label="Next Page"
                highContrast
              >
                Next
              </Button>

              <LoadingSR
                loading={status === "pending"}
                content="Loading users"
              />
            </Flex>
          </Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table.Root>
  );
}

const DEBOUNCE_DELAY_IN_MS = 500;

export function Users() {
  const [page, setPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [debouncedSearchText] = useDebounceValue(
    searchText,
    DEBOUNCE_DELAY_IN_MS,
  );
  const { data, status } = useQuery({
    queryKey: ["users", page, debouncedSearchText],
    queryFn: () => getUsers({ page, searchText: debouncedSearchText }),
  });

  return (
    <Flex direction="column" gap="5">
      <Flex gap="2">
        <TextField.Root
          placeholder="Search by name…"
          className="flex-grow"
          onChange={(e) => setSearchText(e.target.value)}
        >
          <TextField.Slot>
            {debouncedSearchText !== searchText ? (
              <DotsHorizontalIcon />
            ) : (
              <MagnifyingGlassIcon height="16" width="16" />
            )}
          </TextField.Slot>
        </TextField.Root>
        <AddUserButton />
      </Flex>

      <UsersTable
        data={data}
        status={status}
        onPageChange={(page) => setPage(page)}
      />
    </Flex>
  );
}
