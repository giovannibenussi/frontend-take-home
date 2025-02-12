import { z } from "zod";

const API_URL = "http://localhost:3002";

const userSchema = z.object({
  id: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  first: z.string(),
  last: z.string(),
  roleId: z.string(),
  photo: z.string(),
});

export type UserType = z.infer<typeof userSchema>;

const userApiResponseSchema = z.object({
  data: z.array(userSchema),
  next: z.number().nullable(),
  prev: z.number().nullable(),
});

const roleSchema = z.object({
  id: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  name: z.string(),
  isDefault: z.boolean(),
  description: z.string(),
});

export async function getUsers({
  page,
  searchText = "",
}: {
  page: number;
  searchText: string;
}) {
  const response = await fetch(
    `${API_URL}/users?search=${searchText}&page=${page}`,
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const data = userApiResponseSchema.parse(await response.json());
  const roles = await getRoles();

  const usersWithRoles = data.data.map((user) => {
    const role = roles.data.find((role) => role.id === user.roleId);
    return { ...user, role };
  });

  return { ...data, usersWithRoles };
}

export async function addUser(data: Partial<Omit<UserType, "id">>) {
  try {
    if (data.first) {
      data.first = data.first.trim();
    }
    if (data.last) {
      data.last = data.last.trim();
    }
    if (!data.first) {
      return { success: false, message: "First name is required" };
    }
    if (!data.last) {
      return { success: false, message: "Last name is required" };
    }

    const response = await fetch(`${API_URL}/users`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const responseBody = await response.json();

    if (!response.ok) {
      return { success: false, message: responseBody.message };
    }

    return { success: true };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "An error occurred while creating the user",
    };
  }
}

export async function updateUser(
  id: string,
  data: Partial<Omit<UserType, "id">>,
) {
  try {
    if (data.first) {
      data.first = data.first.trim();
    }
    if (data.last) {
      data.last = data.last.trim();
    }

    const response = await fetch(`${API_URL}/users/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const responseBody = await response.json();

    if (!response.ok) {
      return { success: false, message: responseBody.message };
    }

    return { success: true };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "An error occurred while updating the user",
    };
  }
}

export async function addOrUpdateUser(
  data: Partial<Omit<UserType, "id">> & { userId: string },
) {
  console.log("userId", data.userId);
  if (data.userId) {
    return updateUser(data.userId, data);
  }

  return addUser(data);
}

export async function deleteUser(id: string) {
  const response = await fetch(`${API_URL}/users/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
}

export async function deleteRole(id: string) {
  try {
    const response = await fetch(`${API_URL}/roles/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const responseBody = await response.json();
      return {
        success: false,
        message:
          responseBody.message || "An error occurred while deleting the role",
      };
    }

    return { success: true };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "An error occurred while deleting the role",
    };
  }
}

export async function addRole(data: Partial<Omit<RoleType, "id">>) {
  try {
    if (data.name) {
      data.name = data.name.trim();
    }
    if (data.description) {
      data.description = data.description.trim();
    }

    const response = await fetch(`${API_URL}/roles`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const responseBody = await response.json();

    if (!response.ok) {
      return { success: false, message: responseBody.message };
    }

    return { success: true };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "An error occurred while creating the role",
    };
  }
}

export async function updateRole(
  id: string,
  data: Partial<Omit<RoleType, "id">>,
) {
  try {
    if (data.name) {
      data.name = data.name.trim();
    }
    if (data.description) {
      data.description = data.description.trim();
    }

    const response = await fetch(`${API_URL}/roles/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const responseBody = await response.json();

    if (!response.ok) {
      return { success: false, message: responseBody.message };
    }

    return { success: true };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "An error occurred while updating the role",
    };
  }
}

export type RoleType = z.infer<typeof roleSchema>;

const roleApiResponseSchema = z.object({
  data: z.array(roleSchema),
});

export async function getRoles() {
  const response = await fetch(`${API_URL}/roles`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return roleApiResponseSchema.parse(await response.json());
}
