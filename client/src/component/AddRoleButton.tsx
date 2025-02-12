import {
  AlertDialog,
  Button,
  Flex,
  TextField,
  Text,
  TextArea,
  Checkbox,
} from "@radix-ui/themes";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { addRole } from "../api";
import { PlusIcon } from "@radix-ui/react-icons";
import { useRoles } from "../hooks/useRoles";

export default function AddRoleButton() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");

  const { data, mutate, status } = useMutation({
    mutationFn: addRole,
    onSuccess: (data) => {
      if (!data.success) {
        return;
      }

      setOpen(false);
      setName("");
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
  });
  const { roles } = useRoles();
  const nameIsAlreadyTaken = roles?.some((role) => role.name === name);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const name = (formData.get("name") || "") as string;
    const description = (formData.get("description") || "") as string;
    const isDefault = !!formData.get("isDefault");
    mutate({ name, description, isDefault });
  }

  return (
    <AlertDialog.Root open={open} onOpenChange={setOpen}>
      <AlertDialog.Trigger>
        <Button>
          <PlusIcon />
          Add role
        </Button>
      </AlertDialog.Trigger>
      <AlertDialog.Content maxWidth="550px">
        <AlertDialog.Title>Add role</AlertDialog.Title>
        <AlertDialog.Description>
          Roles are used to group users and define their permissions.
        </AlertDialog.Description>

        <form onSubmit={handleSubmit}>
          <Flex gap="3" mt="4" direction="column">
            <label className="flex flex-col gap-1">
              <Text weight="bold">Name</Text>
              <TextField.Root
                placeholder="Name of the role"
                onChange={(e) => setName(e.target.value)}
                required
                name="name"
                aria-invalid={nameIsAlreadyTaken ? "true" : "false"}
                aria-describedby={nameIsAlreadyTaken ? "name-error" : undefined}
              />
              {nameIsAlreadyTaken && (
                <Text size="2" color="red" id="name-error" role="alert">
                  A role with the same name already exists.
                </Text>
              )}
            </label>

            <label className="flex flex-col gap-1">
              <Text weight="bold">Description</Text>
              <TextArea
                placeholder="Description of the role"
                name="description"
              />
            </label>

            <label className="flex gap-2 items-center">
              <Checkbox name="isDefault" />
              <Text weight="bold">Set as default</Text>
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
              disabled={status === "pending" || nameIsAlreadyTaken}
              loading={status === "pending"}
            >
              Add role
            </Button>
          </Flex>
        </form>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
}
