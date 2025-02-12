import { Button, Dialog, Flex, Strong, Text } from "@radix-ui/themes";
import { deleteRole, RoleType } from "../api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LoadingSR } from "./LoadingSR";

export function DeleteRoleDialog({
  open,
  role,
  onOpenChange,
}: {
  open: boolean;
  role: RoleType;
  onOpenChange: (open: boolean) => void;
}) {
  const queryClient = useQueryClient();

  const { data, mutate, reset, status } = useMutation({
    mutationFn: () => deleteRole(role.id),
    onSuccess: (data) => {
      if (!data?.success) {
        return;
      }

      onOpenChange(false);
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
  });

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content maxWidth="485px">
        <Dialog.Title mt="1">Delete role</Dialog.Title>
        <Dialog.Description size="2" mb="3">
          Are you sure? The role <Strong>{role.name}</Strong> will be
          permanently deleted.
          {data?.message && (
            <Text as="p" mt="1" size="2" color="red">
              {data?.message}
            </Text>
          )}
        </Dialog.Description>

        <Flex gap="3" mt="4" justify="end">
          <Dialog.Close>
            <Button variant="soft" color="gray" disabled={status === "pending"}>
              Cancel
            </Button>
          </Dialog.Close>
          <Button
            color="red"
            variant="surface"
            onClick={() => {
              reset();
              mutate();
            }}
            loading={status === "pending"}
          >
            Delete role
          </Button>
          <LoadingSR loading={status === "pending"} />
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
