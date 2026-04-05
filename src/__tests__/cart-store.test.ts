import { describe, it, expect, beforeEach } from "vitest";
import { useCartStore, MAX_QUANTITY } from "@/store/cart-store";
import { Product } from "@/types/product";

function resetStore() {
  useCartStore.setState({ items: [] });
}

const mockProduct: Product = {
  id: "prod-1",
  name: "테스트 상품",
  description: "테스트 설명",
  price: 100000,
  category: "sns",
  image: "/images/test.svg",
  features: ["기능1"],
  recommendations: ["추천1"],
  processSteps: [{ step: 1, title: "단계1", description: "설명1" }],
  faqs: [{ question: "Q1", answer: "A1" }],
  contentBlocks: [],
  isActive: true,
  createdAt: "2024-01-01",
};

const mockProduct2: Product = {
  ...mockProduct,
  id: "prod-2",
  name: "테스트 상품 2",
  price: 200000,
  category: "blog",
};

describe("cart-store", () => {
  beforeEach(() => {
    resetStore();
  });

  describe("초기 상태", () => {
    it("장바구니가 비어있어야 한다", () => {
      const { items } = useCartStore.getState();
      expect(items).toEqual([]);
    });
  });

  describe("상품 추가 (addItem)", () => {
    it("새 상품을 장바구니에 추가할 수 있어야 한다", () => {
      useCartStore.getState().addItem(mockProduct);

      const { items } = useCartStore.getState();
      expect(items).toHaveLength(1);
      expect(items[0].product.id).toBe("prod-1");
      expect(items[0].quantity).toBe(1);
    });

    it("지정된 수량으로 상품을 추가할 수 있어야 한다", () => {
      useCartStore.getState().addItem(mockProduct, 3);

      const { items } = useCartStore.getState();
      expect(items[0].quantity).toBe(3);
    });

    it("이미 있는 상품을 추가하면 수량이 증가해야 한다", () => {
      const { addItem } = useCartStore.getState();
      addItem(mockProduct, 2);
      useCartStore.getState().addItem(mockProduct, 3);

      const { items } = useCartStore.getState();
      expect(items).toHaveLength(1);
      expect(items[0].quantity).toBe(5);
    });

    it("수량이 MAX_QUANTITY를 초과하면 MAX_QUANTITY로 제한해야 한다", () => {
      useCartStore.getState().addItem(mockProduct, 50);
      useCartStore.getState().addItem(mockProduct, 60);

      const { items } = useCartStore.getState();
      expect(items[0].quantity).toBe(MAX_QUANTITY); // 99
    });

    it("서로 다른 상품을 각각 추가할 수 있어야 한다", () => {
      useCartStore.getState().addItem(mockProduct);
      useCartStore.getState().addItem(mockProduct2);

      const { items } = useCartStore.getState();
      expect(items).toHaveLength(2);
    });
  });

  describe("상품 제거 (removeItem)", () => {
    it("장바구니에서 상품을 제거할 수 있어야 한다", () => {
      useCartStore.getState().addItem(mockProduct);
      useCartStore.getState().addItem(mockProduct2);

      useCartStore.getState().removeItem("prod-1");

      const { items } = useCartStore.getState();
      expect(items).toHaveLength(1);
      expect(items[0].product.id).toBe("prod-2");
    });

    it("존재하지 않는 상품을 제거해도 에러가 나지 않아야 한다", () => {
      useCartStore.getState().addItem(mockProduct);
      useCartStore.getState().removeItem("nonexistent");

      const { items } = useCartStore.getState();
      expect(items).toHaveLength(1);
    });
  });

  describe("수량 변경 (updateQuantity)", () => {
    it("상품 수량을 변경할 수 있어야 한다", () => {
      useCartStore.getState().addItem(mockProduct, 1);
      useCartStore.getState().updateQuantity("prod-1", 5);

      const { items } = useCartStore.getState();
      expect(items[0].quantity).toBe(5);
    });

    it("수량이 1 미만이면 변경되지 않아야 한다", () => {
      useCartStore.getState().addItem(mockProduct, 3);
      useCartStore.getState().updateQuantity("prod-1", 0);

      const { items } = useCartStore.getState();
      expect(items[0].quantity).toBe(3);
    });

    it("수량이 MAX_QUANTITY 초과이면 변경되지 않아야 한다", () => {
      useCartStore.getState().addItem(mockProduct, 3);
      useCartStore.getState().updateQuantity("prod-1", MAX_QUANTITY + 1);

      const { items } = useCartStore.getState();
      expect(items[0].quantity).toBe(3);
    });
  });

  describe("장바구니 비우기 (clearCart)", () => {
    it("장바구니를 완전히 비울 수 있어야 한다", () => {
      useCartStore.getState().addItem(mockProduct);
      useCartStore.getState().addItem(mockProduct2);

      useCartStore.getState().clearCart();

      const { items } = useCartStore.getState();
      expect(items).toEqual([]);
    });
  });

  describe("총 금액 계산 (getTotalPrice)", () => {
    it("빈 장바구니의 총 금액은 0이어야 한다", () => {
      expect(useCartStore.getState().getTotalPrice()).toBe(0);
    });

    it("상품 금액 x 수량의 합계를 올바르게 계산해야 한다", () => {
      useCartStore.getState().addItem(mockProduct, 2); // 100000 * 2
      useCartStore.getState().addItem(mockProduct2, 3); // 200000 * 3

      expect(useCartStore.getState().getTotalPrice()).toBe(800000);
    });
  });

  describe("총 수량 계산 (getTotalItems)", () => {
    it("빈 장바구니의 총 수량은 0이어야 한다", () => {
      expect(useCartStore.getState().getTotalItems()).toBe(0);
    });

    it("모든 상품의 수량 합계를 올바르게 계산해야 한다", () => {
      useCartStore.getState().addItem(mockProduct, 2);
      useCartStore.getState().addItem(mockProduct2, 3);

      expect(useCartStore.getState().getTotalItems()).toBe(5);
    });
  });
});
