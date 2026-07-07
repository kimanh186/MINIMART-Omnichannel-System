import httpAxios from './httpAxios';

export const authService = {
  // TẠO CA LÀM
  login: async (username, password, pos_machine = 'POS-01') => {
    const res = await httpAxios.post('/pos/login', {
      username,
      password,
      pos_machine
    });

    if (res.data.session_id) {
      localStorage.setItem('work_session_id', res.data.session_id);
    }

    return res.data;
  },

  // KẾT THÚC CA
  logout: async (token) => {
    const sessionId = localStorage.getItem('work_session_id');

    return await httpAxios.post(
      '/pos/logout',
      { session_id: sessionId },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
  }
};
