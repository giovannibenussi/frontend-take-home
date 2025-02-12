import { AlertDialog, Button, Flex, TextField, Text } from "@radix-ui/themes";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { addOrUpdateUser, UserType } from "../api";
import { RoleSelect } from "./RoleSelect";
import { LoadingSR } from "./LoadingSR";

export default function AddUserDialog({
  user,
  onClose,
}: {
  user: UserType | undefined;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const [first, setFirst] = useState(user?.first || "");
  const [last, setLast] = useState(user?.last || "");

  const { data, mutate, status } = useMutation({
    mutationFn: addOrUpdateUser,
    onSuccess: (data) => {
      if (!data.success) {
        return;
      }

      onClose();
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setFirst("");
      setLast("");
    },
  });

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const first = (formData.get("first") || "") as string;
    const last = (formData.get("last") || "") as string;
    const roleId = (formData.get("roleId") || "") as string;
    const userId = (formData.get("userId") || "") as string;
    mutate({ first, last, roleId, userId });
  }

  return (
    <AlertDialog.Root open onOpenChange={() => onClose()}>
      <AlertDialog.Content maxWidth="550px">
        <AlertDialog.Title>
          {user ? `Edit user ${user.first} ${user.last}` : "Add user"}
        </AlertDialog.Title>
        <AlertDialog.Description>
          {!user &&
            "Add a new user to the system so they can access the application."}
        </AlertDialog.Description>

        <form onSubmit={handleSubmit}>
          <input type="hidden" name="userId" value={user?.id} />
          <Flex gap="3" mt="4" direction="column">
            <label className="flex flex-col gap-1">
              <Text weight="bold">First name</Text>
              <TextField.Root
                placeholder="Enter a first name"
                value={first}
                onChange={(e) => setFirst(e.target.value)}
                name="first"
                required
              />
            </label>

            <label className="flex flex-col gap-1">
              <Text weight="bold">Last name</Text>
              <TextField.Root
                placeholder="Enter a last name"
                value={last}
                onChange={(e) => setLast(e.target.value)}
                name="last"
                required
              />
            </label>

            <label className="flex flex-col gap-1">
              <Text weight="bold">Role</Text>
              <RoleSelect defaultValue={user?.roleId} />
            </label>
          </Flex>

          {data?.message && (
            <Text size="2" color="red">
              {data?.message}
            </Text>
          )}

          <Flex gap="3" mt="4" justify="end">
            <AlertDialog.Cancel>
              <Button variant="soft" color="gray">
                Cancel
              </Button>
            </AlertDialog.Cancel>

            <Button
              disabled={status === "pending"}
              loading={status === "pending"}
            >
              Add user
            </Button>
            <LoadingSR loading={status === "pending"} />
          </Flex>
        </form>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
}
