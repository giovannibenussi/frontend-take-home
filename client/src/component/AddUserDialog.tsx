import { AlertDialog, Button, Flex, TextField, Text } from "@radix-ui/themes";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { addOrUpdateUser, formUserSchema, UserType } from "../api";
import { RoleSelect } from "./RoleSelect";
import { LoadingSR } from "./LoadingSR";

export default function AddUserDialog({
  open,
  user,
  onOpenChange,
}: {
  open: boolean;
  user: UserType | undefined;
  onOpenChange: (open: boolean) => void;
}) {
  const queryClient = useQueryClient();
  const [first, setFirst] = useState(user?.first || "");
  const [last, setLast] = useState(user?.last || "");
  const [roleId, setRoleId] = useState(user?.roleId || "");
  const [showErrors, setShowErrors] = useState(false);

  const { data, mutate, status } = useMutation({
    mutationFn: addOrUpdateUser,
    onSuccess: (data) => {
      if (!data.success) {
        return;
      }

      const createdNewUser = !user?.id;
      if (createdNewUser) {
        setFirst("");
        setLast("");
        setRoleId("");
        setShowErrors(false);
      }

      onOpenChange(false);
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const formData = {
    first,
    last,
    roleId,
    userId: user?.id,
  };
  const parsedData = formUserSchema.safeParse(formData);
  const errors = parsedData.error?.format();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!parsedData.success) {
      setShowErrors(true);
      return;
    }

    mutate(formData);
  }

  return (
    <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
      <AlertDialog.Content maxWidth="550px">
        <AlertDialog.Title>
          {user ? `Edit user ${user.first} ${user.last}` : "Add user"}
        </AlertDialog.Title>
        <AlertDialog.Description>
          {!user &&
            "Add a new user to the system so they can access the application."}
        </AlertDialog.Description>

        <form onSubmit={handleSubmit}>
          <Flex gap="3" mt="4" direction="column">
            <label className="flex flex-col gap-1">
              <Text weight="bold">First name</Text>
              <TextField.Root
                placeholder="Enter a first name"
                value={first}
                onChange={(e) => setFirst(e.target.value)}
                name="first"
                aria-invalid={errors?.first ? "true" : "false"}
                aria-describedby={errors?.first ? "first-error" : undefined}
              />
              {showErrors && errors?.first && (
                <Text size="2" color="red" id="first-error" role="alert">
                  {errors?.first._errors.join(", ")}
                </Text>
              )}
            </label>

            <label className="flex flex-col gap-1">
              <Text weight="bold">Last name</Text>
              <TextField.Root
                placeholder="Enter a last name"
                value={last}
                onChange={(e) => setLast(e.target.value)}
                name="last"
                aria-invalid={errors?.first ? "true" : "false"}
                aria-describedby={errors?.first ? "last-error" : undefined}
              />
              {showErrors && errors?.last && (
                <Text size="2" color="red" id="last-error" role="alert">
                  {errors?.last._errors.join(", ")}
                </Text>
              )}
            </label>

            <label className="flex flex-col gap-1">
              <Text weight="bold">Role</Text>
              <RoleSelect
                defaultValue={roleId}
                onValueChange={(roleId) => setRoleId(roleId)}
              />
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
              loading={status === "pending"}
              onClick={() => setShowErrors(true)}
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
