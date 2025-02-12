import {
  Flex,
  Table,
  Avatar,
  Skeleton,
  TextField,
  Button,
} from "@radix-ui/themes";
import { DotsHorizontalIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { useQuery } from "@tanstack/react-query";
import { getUsers, UserType } from "../api";
import { useEffect, useState } from "react";
import { useDebounceValue } from "usehooks-ts";
import { DeleteUserDialog } from "./DeleteUserDialog";
import AddUserDialog from "./AddUserDialog";
import { ErrorCallout } from "./ErrorCallout";
import { AddUserButton } from "./AddUserButton";
import { LoadingSR } from "./LoadingSR";
import { Actions } from "./Actions";

function PendingUIRows({ length }: { length: number }) {
  return Array.from({ length }, (_, i) => (
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
  const [modal, setModal] = useState<string | undefined>();

  return (
    <>
      <Actions
        label={`Actions for user ${user.first} ${user.last}`}
        onValueChange={(action) => setModal(action)}
        actions={[
          { label: "Edit user", action: "edit" },
          { label: "Delete user", action: "delete" },
        ]}
      />
      <AddUserDialog
        user={user}
        open={modal === "edit"}
        onOpenChange={() => setModal(undefined)}
      />
      <DeleteUserDialog
        user={user}
        open={modal === "delete"}
        onOpenChange={() => setModal(undefined)}
      />
    </>
  );
}

function UserAvatar({ user }: { user: UserType }) {
  return (
    <Avatar
      src={user.photo ?? undefined}
      fallback={user.first.slice(0, 1)}
      alt={`Avatar of ${user.first} ${user.last}`}
      size="1"
      radius="full"
    />
  );
}

function UsersTable({ searchText }: { searchText: string }) {
  const [page, setPage] = useState(1);
  const { data, status } = useQuery({
    queryKey: ["users", page, searchText],
    queryFn: () => getUsers({ page, searchText }),
  });
  const { usersWithRoles: users, prev, next } = data || {};

  useEffect(() => {
    setPage(1);
  }, [searchText]);

  if (status === "error") {
    return <ErrorCallout content="There was an error loading the users." />;
  }

  return (
    <Table.Root variant="surface">
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeaderCell>User</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Role</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell className="max-md:hidden">
            Joined
          </Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>
            <span className="sr-only">Actions</span>
          </Table.ColumnHeaderCell>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {status === "pending" ? (
          <PendingUIRows length={10} />
        ) : users?.length === 0 ? (
          <Table.Row>
            <Table.Cell colSpan={4} className="text-center">
              No users found
            </Table.Cell>
          </Table.Row>
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
              <Table.Cell className="max-md:hidden">
                {formatDate(user.createdAt)}
              </Table.Cell>
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
                onClick={() => prev && setPage(prev)}
                size="1"
                aria-label="Previous Page"
                highContrast
              >
                Previous
              </Button>

              <Button
                type="button"
                color="gray"
                variant="surface"
                onClick={() => next && setPage(next)}
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
  const [searchText, setSearchText] = useState("");
  const [debouncedSearchText] = useDebounceValue(
    searchText,
    DEBOUNCE_DELAY_IN_MS,
  );

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

      <UsersTable searchText={debouncedSearchText} />
    </Flex>
  );
}
