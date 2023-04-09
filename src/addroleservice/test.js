const { createRoles } = require('./logic');


describe('createRoles', () => {
  test('should create a new role', async () => {
    const token = 'mock_token';
    const name = 'test_role';
    const project = 1;
    const order = 2;
    const computable = true;
    const permissions = [1, 2];

    // Mock the fetch API call
    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ id: 1, name, project, order, computable, permissions }),
      })
    );

    const role = await createRoles(name, project, order, computable, permissions, token);

    expect(fetch).toHaveBeenCalledWith('https://api.taiga.io/api/v1/roles', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, project, order, computable, permissions }),
    });

    expect(role).toEqual({ id: 1, name, project, order, computable, permissions });
  });

  test('should throw an error if the API call fails', async () => {
    const token = 'mock_token';
    const name = 'test_role';
    const project = 1;
    const order = 2;
    const computable = true;
    const permissions = [1, 2];

    // Mock the fetch API call to return an error
    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: false,
        statusText: 'Internal Server Error',
      })
    );

    await expect(createRoles(name, project, order, computable, permissions, token)).rejects.toThrow(
      'Failed to create role: Internal Server Error'
    );
  });
});
