'use server';

import { PERMITIO_SDK } from '@/lib/permitio';

// permit.io actions

interface User {
  email: string;
  key: string;
}

interface ResourceInstance {
  key: string;
  resource: string;
}

interface ResourceInstanceRole {
  user: string;
  role: string;
  resource_instance: string;
}

export type PermissionType = 'read' | 'create' | 'delete' | 'update';

interface ResourcePermission {
  user: string;
  resource_instance: string;
  permissions: PermissionType[];
}

/**
 *
 * @param user `{email: string, key: string}`
 */
export async function syncUserWithPermit(user: User) {
  try {
    const syncedUser = await PERMITIO_SDK.api.syncUser(user);

    console.log('User synced with permit.io', syncedUser.email);
  } catch (error) {
    console.error(error);
  }
}

async function getPermitioUser(key: string) {
  try {
    const user = await PERMITIO_SDK.api.users.getByKey(key);
    return user;
  } catch (error) {
    console.error(error);
    return null;
  }
}

/**
 *
 * @param resourceInstance `{key: string, resource: string}`
 * @returns createdInstance
 */
export async function createResourceInstance(
  resourceInstance: ResourceInstance
) {
  console.log('Creating a resource instance...');
  try {
    const createdInstance = await PERMITIO_SDK.api.resourceInstances.create({
      key: resourceInstance.key,
      tenant: 'default',
      resource: resourceInstance.resource,
    });

    console.log(`Resource instance created: ${createdInstance.key}`);
    return createdInstance;
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    } else {
      console.log('An unknown error occurred');
    }

    return null;
  }
}

/**
 *
 * @param resourceInstanceRole `{user: string, role: string, resource_instance: string}`
 * @returns assignedRole
 */
export async function assignResourceInstanceRoleToUser(
  resourceInstanceRole: ResourceInstanceRole
) {
  try {
    const user = await getPermitioUser(resourceInstanceRole.user);

    if (!user) {
      await syncUserWithPermit({
        email: resourceInstanceRole.user,
        key: resourceInstanceRole.user,
      });
    }

    const assignedRole = await PERMITIO_SDK.api.roleAssignments.assign({
      user: resourceInstanceRole.user,
      role: resourceInstanceRole.role,
      resource_instance: resourceInstanceRole.resource_instance,
      tenant: 'default',
    });

    console.log(`Role assigned: ${assignedRole.role} to ${assignedRole.user}`);

    return assignedRole;
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    } else {
      console.log('An unknown error occurred');
    }

    return null;
  }
}

/**
 *
 * @param resourcePermission `{user: string, resource_instance: string, permission: string}`
 * @returns permitted
 */
export async function getResourcePermissions(
  resourcePermission: ResourcePermission
) {
  try {
    const permissions = resourcePermission.permissions;

    const permissionMap: Record<PermissionType, boolean> = {
      read: false,
      create: false,
      delete: false,
      update: false,
    };

    for await (const permission of permissions) {
      permissionMap[permission] = await PERMITIO_SDK.check(
        resourcePermission.user,
        permission,
        resourcePermission.resource_instance
      );
    }

    return permissionMap;
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    } else {
      console.log('An unknown error occurred');
    }

    return {
      read: false,
      create: false,
      delete: false,
      update: false,
    };
  }
}
