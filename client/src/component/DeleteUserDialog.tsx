import { Button, Dialog, Flex, Strong } from "@radix-ui/themes";
import { deleteUser, UserType } from "../api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LoadingSR } from "./LoadingSR";

export function DeleteUserDialog({
  user,
  onClose,
}: {
  user: UserType;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();

  const { mutate, status } = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      onClose();
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    mutate(user.id);
  }

  return (
    <Dialog.Root open onOpenChange={onClose}>
      <Dialog.Content maxWidth="485px">
        <Dialog.Title mt="1">Delete user</Dialog.Title>
        <Dialog.Description size="2" mb="3">
          Are you sure? The user{" "}
          <Strong>
            {user.first} {user.last}
          </Strong>{" "}
          will be permanently deleted.
        </Dialog.Description>

        <Flex gap="3" mt="4" justify="end">
          <Dialog.Close>
            <Button
              type="button"
              variant="soft"
              color="gray"
              disabled={status === "pending"}
            >
              Cancel
            </Button>
          </Dialog.Close>
          <form onSubmit={handleSubmit}>
            <Button
              color="red"
              variant="surface"
              loading={status === "pending"}
            >
              Delete user
            </Button>
            <LoadingSR loading={status === "pending"} />
          </form>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
