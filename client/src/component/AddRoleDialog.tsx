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
import { addOrUpdateRole, formRoleSchema, RoleType } from "../api";
import { useRoles } from "../hooks/useRoles";

export default function AddRoleDialog({
  open,
  onOpenChange,
  role,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role?: RoleType;
}) {
  const queryClient = useQueryClient();
  const [name, setName] = useState(role?.name || "");
  const [description, setDescription] = useState(role?.description || "");
  const [isDefault, setIsDefault] = useState(role?.isDefault || false);
  const [showErrors, setShowErrors] = useState(false);

  const { data, mutate, status } = useMutation({
    mutationFn: addOrUpdateRole,
    onSuccess: (data) => {
      if (!data.success) {
        return;
      }

      const createdNewRole = !role?.id;
      if (createdNewRole) {
        setName("");
        setDescription("");
        setIsDefault(false);
        setShowErrors(false);
      }

      onOpenChange(false);
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
  });
  const { roles } = useRoles();
  const formData = { id: role?.id, name, description, isDefault };
  const parsedData = formRoleSchema.safeParse(formData);
  const errors = parsedData.error?.format();
  const nameIsAlreadyTaken = roles?.some((role) => role.name === name);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!parsedData.success) {
      setShowErrors(true);
      return;
    }

    const formData = new FormData(e.currentTarget);

    const name = (formData.get("name") || "") as string;
    const description = (formData.get("description") || "") as string;
    const isDefault = !!formData.get("isDefault");
    mutate({ id: role?.id, name, description, isDefault });
  }
  const nameError =
    errors?.name?._errors.join(", ") ||
    (nameIsAlreadyTaken ? "Name is already taken" : undefined);

  return (
    <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
      <AlertDialog.Content maxWidth="550px">
        <AlertDialog.Title>
          {role ? `Edit ${role.name} role` : "Add"} role
        </AlertDialog.Title>
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
                name="name"
                defaultValue={role?.name}
                aria-invalid={errors?.name ? "true" : "false"}
                aria-describedby={errors?.name ? "name-error" : undefined}
              />
              {showErrors && nameError && (
                <Text size="2" color="red" id="name-error" role="alert">
                  {nameError}
                </Text>
              )}
            </label>

            <label className="flex flex-col gap-1">
              <Text weight="bold">Description</Text>
              <TextArea
                placeholder="Description of the role"
                name="description"
                defaultValue={role?.description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </label>

            {!role && (
              <label className="flex gap-2 items-center">
                <Checkbox
                  name="isDefault"
                  onCheckedChange={(checked) => setIsDefault(!!checked)}
                />
                <Text weight="bold">Set as default</Text>
              </label>
            )}
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
              {role ? "Save changes" : "Add role"}
            </Button>
          </Flex>
        </form>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
}
