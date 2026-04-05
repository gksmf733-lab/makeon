import { describe, it, expect, beforeEach } from "vitest";
import { useAuthStore } from "@/store/auth-store";

// 스토어를 매 테스트마다 초기 상태로 리셋
function resetStore() {
  const { setState, getInitialState } = useAuthStore;
  setState(getInitialState(), true);
}

const validUserInput = {
  username: "testuser",
  password: "password123",
  name: "테스트 사용자",
  phone: "010-1234-5678",
  businessName: "테스트 회사",
  industry: "IT",
  url: "https://example.com",
  businessNumber: "123-45-67890",
  address: "서울시 강남구",
};

describe("auth-store", () => {
  beforeEach(() => {
    resetStore();
  });

  describe("초기 상태", () => {
    it("기본 관리자 계정이 존재해야 한다", () => {
      const { users } = useAuthStore.getState();
      expect(users).toHaveLength(1);
      expect(users[0].username).toBe("admin");
      expect(users[0].role).toBe("admin");
    });

    it("로그인된 사용자가 없어야 한다", () => {
      const { currentUser } = useAuthStore.getState();
      expect(currentUser).toBeNull();
    });
  });

  describe("회원가입 (register)", () => {
    it("새 사용자를 등록할 수 있어야 한다", () => {
      const { register } = useAuthStore.getState();
      const result = register(validUserInput);

      expect(result.success).toBe(true);
      expect(result.message).toBe("회원가입이 완료되었습니다.");

      const { users } = useAuthStore.getState();
      expect(users).toHaveLength(2);

      const newUser = users.find((u) => u.username === "testuser");
      expect(newUser).toBeDefined();
      expect(newUser!.name).toBe("테스트 사용자");
      expect(newUser!.role).toBe("user");
      expect(newUser!.id).toBeDefined();
      expect(newUser!.createdAt).toBeDefined();
    });

    it("중복 아이디로 등록하면 실패해야 한다", () => {
      const { register } = useAuthStore.getState();

      register(validUserInput);
      const result = register(validUserInput);

      expect(result.success).toBe(false);
      expect(result.message).toBe("이미 사용 중인 아이디입니다.");

      const { users } = useAuthStore.getState();
      expect(users).toHaveLength(2); // admin + testuser (한 번만 등록)
    });

    it("admin 아이디로 등록하면 실패해야 한다", () => {
      const { register } = useAuthStore.getState();
      const result = register({ ...validUserInput, username: "admin" });

      expect(result.success).toBe(false);
    });

    it("비밀번호가 해싱되어 저장되어야 한다", () => {
      const { register } = useAuthStore.getState();
      register(validUserInput);

      const { users } = useAuthStore.getState();
      const newUser = users.find((u) => u.username === "testuser");
      expect(newUser!.password).not.toBe("password123");
      expect(newUser!.password).toMatch(/^hashed_/);
    });
  });

  describe("로그인 (login)", () => {
    it("올바른 자격증명으로 로그인할 수 있어야 한다", () => {
      const { login } = useAuthStore.getState();
      const result = login("admin", "admin123");

      expect(result.success).toBe(true);
      expect(result.message).toBe("로그인 되었습니다.");

      const { currentUser } = useAuthStore.getState();
      expect(currentUser).not.toBeNull();
      expect(currentUser!.username).toBe("admin");
    });

    it("잘못된 비밀번호로 로그인하면 실패해야 한다", () => {
      const { login } = useAuthStore.getState();
      const result = login("admin", "wrongpassword");

      expect(result.success).toBe(false);
      expect(result.message).toBe("아이디 또는 비밀번호가 일치하지 않습니다.");

      const { currentUser } = useAuthStore.getState();
      expect(currentUser).toBeNull();
    });

    it("존재하지 않는 사용자로 로그인하면 실패해야 한다", () => {
      const { login } = useAuthStore.getState();
      const result = login("nonexistent", "password");

      expect(result.success).toBe(false);
    });

    it("등록한 사용자로 로그인할 수 있어야 한다", () => {
      const store = useAuthStore.getState();
      store.register(validUserInput);

      const { login } = useAuthStore.getState();
      const result = login("testuser", "password123");

      expect(result.success).toBe(true);

      const { currentUser } = useAuthStore.getState();
      expect(currentUser!.username).toBe("testuser");
    });
  });

  describe("로그아웃 (logout)", () => {
    it("로그아웃하면 currentUser가 null이 되어야 한다", () => {
      const { login } = useAuthStore.getState();
      login("admin", "admin123");

      expect(useAuthStore.getState().currentUser).not.toBeNull();

      useAuthStore.getState().logout();

      expect(useAuthStore.getState().currentUser).toBeNull();
    });
  });

  describe("관리자 확인 (isAdmin)", () => {
    it("관리자로 로그인하면 isAdmin이 true여야 한다", () => {
      const { login } = useAuthStore.getState();
      login("admin", "admin123");

      expect(useAuthStore.getState().isAdmin()).toBe(true);
    });

    it("일반 사용자로 로그인하면 isAdmin이 false여야 한다", () => {
      const store = useAuthStore.getState();
      store.register(validUserInput);

      const { login } = useAuthStore.getState();
      login("testuser", "password123");

      expect(useAuthStore.getState().isAdmin()).toBe(false);
    });

    it("로그인하지 않으면 isAdmin이 false여야 한다", () => {
      expect(useAuthStore.getState().isAdmin()).toBe(false);
    });
  });
});
