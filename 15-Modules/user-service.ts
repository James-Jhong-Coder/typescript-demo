// =============================================
// 混合匯出：值 + 型別
// =============================================

// 匯出型別
export type UserDTO = {
  id: number;
  name: string;
};

// 匯出類別（值）
export class UserService {
  private users: UserDTO[] = [
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" },
  ];

  getAll(): UserDTO[] {
    return this.users;
  }

  getById(id: number): UserDTO | undefined {
    return this.users.find((u) => u.id === id);
  }
}
