export const UserQueries = {

  GetUsers: `
  SELECT 
    a.mail,
    a.password,
    a.username,
    a.gender,
    a.avatar,
    a.role, a.created_at
      FROM user a
  `,

  GetUserById: `
  SELECT 
    a.mail,
    a.password,
    a.username,
    a.gender,
    a.avatar,
    a.role, a.created_at
      FROM user a
        WHERE a.id = ?
  `,

  CreateUser: `
  INSERT INTO user (mail, password,
    username,
    gender,
    avatar,
    role, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `,

  UpdateUser: `
  UPDATE user
    SET mail = ?,
    password = ?,
    username = ?,
    avatar = ?,
    role = ?,
      WHERE id = ?
  `,

}