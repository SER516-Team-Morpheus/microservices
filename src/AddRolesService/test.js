//This will have your test case to test the microservices based on jest framework.

const logic = require('./logic');

describe('Role API', () => {
  let roleId;

  test('createRole should create a new role', async () => {
    const name = 'New role';
    const project = 1;
    const order = 10;
    const computable = true;
    const permissions = ['view_us', 'view_project'];

    const role = await logic.createRoles(name, project, order, computable, permissions);

    roleId = role.id;

    expect(role.name).toBe(name);
    expect(role.project).toBe(project);
    expect(role.order).toBe(order);
    expect(role.computable).toBe(computable);
    expect(role.permissions).toEqual(permissions);

  });

  test('updateRole should update an existing role', async () => {
    const name = 'Updated role name';
    const order = 20;
    const computable = false;
    const permissions = ['edit_us', 'view_project'];

    const role = await logic.updateRole(roleId, name, order, computable, permissions);

    expect(role).toHaveProperty('id', roleId);
    expect(role.name).toBe(name);
    expect(role.order).toBe(order);
    expect(role.computable).toBe(computable);
    expect(role.permissions).toEqual(permissions);
  });

  test('getRole should retrieve an existing role', async () => {
    const role = await logic.getRole(roleId);

    expect(role).toHaveProperty('id', roleId);
    expect(role).toHaveProperty('name');
    expect(role).toHaveProperty('order');
    expect(role).toHaveProperty('computable');
    expect(role).toHaveProperty('permissions');
  });
});