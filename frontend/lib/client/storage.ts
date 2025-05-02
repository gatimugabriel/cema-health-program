interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

interface Tokens {
  refreshToken: string;
  accessToken: string;
}

export const setClientStorage = (user: User, tokens: Tokens) => {
  localStorage.setItem('user', JSON.stringify(user));
  localStorage.setItem('accessToken', tokens.accessToken);
};

export const removeClientStorage = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('accessToken');
}; 