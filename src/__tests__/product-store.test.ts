import { describe, it, expect, beforeEach } from "vitest";
import { useProductStore } from "@/store/product-store";
import { Product } from "@/types/product";

function resetStore() {
  const { setState, getInitialState } = useProductStore;
  setState(getInitialState(), true);
}

const newProductData: Omit<Product, "id" | "createdAt"> = {
  name: "새 테스트 상품",
  description: "새 테스트 설명",
  price: 500000,
  category: "seo",
  image: "/images/test-new.svg",
  features: ["기능A", "기능B"],
  recommendations: ["추천A"],
  processSteps: [{ step: 1, title: "단계1", description: "설명1" }],
  faqs: [{ question: "Q", answer: "A" }],
  contentBlocks: [],
  isActive: true,
};

describe("product-store", () => {
  beforeEach(() => {
    resetStore();
  });

  describe("초기 상태", () => {
    it("초기 상품 목록이 로드되어야 한다", () => {
      const { products } = useProductStore.getState();
      expect(products.length).toBeGreaterThan(0);
    });

    it("초기 상품에 필수 필드가 모두 존재해야 한다", () => {
      const { products } = useProductStore.getState();
      const product = products[0];

      expect(product.id).toBeDefined();
      expect(product.name).toBeDefined();
      expect(product.price).toBeGreaterThan(0);
      expect(product.category).toBeDefined();
      expect(typeof product.isActive).toBe("boolean");
    });
  });

  describe("상품 추가 (addProduct)", () => {
    it("새 상품을 추가할 수 있어야 한다", () => {
      const initialCount = useProductStore.getState().products.length;

      useProductStore.getState().addProduct(newProductData);

      const { products } = useProductStore.getState();
      expect(products).toHaveLength(initialCount + 1);

      const added = products[products.length - 1];
      expect(added.name).toBe("새 테스트 상품");
      expect(added.price).toBe(500000);
      expect(added.category).toBe("seo");
    });

    it("추가된 상품에 id와 createdAt이 자동 생성되어야 한다", () => {
      useProductStore.getState().addProduct(newProductData);

      const { products } = useProductStore.getState();
      const added = products[products.length - 1];

      expect(added.id).toBeDefined();
      expect(added.id.length).toBeGreaterThan(0);
      expect(added.createdAt).toBeDefined();
    });
  });

  describe("상품 수정 (updateProduct)", () => {
    it("상품 정보를 부분 수정할 수 있어야 한다", () => {
      const { products } = useProductStore.getState();
      const targetId = products[0].id;

      useProductStore.getState().updateProduct(targetId, {
        name: "수정된 상품명",
        price: 999999,
      });

      const updated = useProductStore.getState().products.find((p) => p.id === targetId);
      expect(updated!.name).toBe("수정된 상품명");
      expect(updated!.price).toBe(999999);
    });

    it("수정하지 않은 필드는 유지되어야 한다", () => {
      const { products } = useProductStore.getState();
      const target = products[0];
      const originalCategory = target.category;

      useProductStore.getState().updateProduct(target.id, { name: "변경됨" });

      const updated = useProductStore.getState().products.find((p) => p.id === target.id);
      expect(updated!.category).toBe(originalCategory);
    });

    it("isActive 상태를 토글할 수 있어야 한다", () => {
      const { products } = useProductStore.getState();
      const target = products[0];

      useProductStore.getState().updateProduct(target.id, { isActive: false });

      const updated = useProductStore.getState().products.find((p) => p.id === target.id);
      expect(updated!.isActive).toBe(false);
    });
  });

  describe("상품 삭제 (deleteProduct)", () => {
    it("상품을 삭제할 수 있어야 한다", () => {
      const initialCount = useProductStore.getState().products.length;
      const targetId = useProductStore.getState().products[0].id;

      useProductStore.getState().deleteProduct(targetId);

      const { products } = useProductStore.getState();
      expect(products).toHaveLength(initialCount - 1);
      expect(products.find((p) => p.id === targetId)).toBeUndefined();
    });

    it("존재하지 않는 상품 삭제 시 목록이 변경되지 않아야 한다", () => {
      const initialCount = useProductStore.getState().products.length;

      useProductStore.getState().deleteProduct("nonexistent-id");

      expect(useProductStore.getState().products).toHaveLength(initialCount);
    });
  });

  describe("상품 조회 (getProductById)", () => {
    it("ID로 상품을 조회할 수 있어야 한다", () => {
      const { products } = useProductStore.getState();
      const targetId = products[0].id;

      const found = useProductStore.getState().getProductById(targetId);
      expect(found).toBeDefined();
      expect(found!.id).toBe(targetId);
    });

    it("존재하지 않는 ID로 조회하면 undefined를 반환해야 한다", () => {
      const found = useProductStore.getState().getProductById("nonexistent");
      expect(found).toBeUndefined();
    });
  });

  describe("카테고리별 상품 조회 (getProductsByCategory)", () => {
    it("특정 카테고리의 활성 상품만 반환해야 한다", () => {
      const snsProducts = useProductStore.getState().getProductsByCategory("sns");

      expect(snsProducts.length).toBeGreaterThan(0);
      snsProducts.forEach((p) => {
        expect(p.category).toBe("sns");
        expect(p.isActive).toBe(true);
      });
    });

    it("비활성 상품은 카테고리 조회에서 제외되어야 한다", () => {
      const { products } = useProductStore.getState();
      const snsProduct = products.find((p) => p.category === "sns");

      useProductStore.getState().updateProduct(snsProduct!.id, { isActive: false });

      const snsProducts = useProductStore.getState().getProductsByCategory("sns");
      expect(snsProducts.find((p) => p.id === snsProduct!.id)).toBeUndefined();
    });

    it("해당 카테고리의 상품이 없으면 빈 배열을 반환해야 한다", () => {
      // 모든 SNS 상품을 비활성화
      const snsProducts = useProductStore.getState().products.filter(
        (p) => p.category === "sns"
      );
      snsProducts.forEach((p) => {
        useProductStore.getState().updateProduct(p.id, { isActive: false });
      });

      const result = useProductStore.getState().getProductsByCategory("sns");
      expect(result).toEqual([]);
    });
  });

  describe("활성 상품 조회 (getActiveProducts)", () => {
    it("활성 상품만 반환해야 한다", () => {
      const activeProducts = useProductStore.getState().getActiveProducts();

      activeProducts.forEach((p) => {
        expect(p.isActive).toBe(true);
      });
    });

    it("비활성화한 상품은 제외되어야 한다", () => {
      const { products } = useProductStore.getState();
      const targetId = products[0].id;

      useProductStore.getState().updateProduct(targetId, { isActive: false });

      const activeProducts = useProductStore.getState().getActiveProducts();
      expect(activeProducts.find((p) => p.id === targetId)).toBeUndefined();
    });

    it("모든 상품을 비활성화하면 빈 배열을 반환해야 한다", () => {
      const { products } = useProductStore.getState();
      products.forEach((p) => {
        useProductStore.getState().updateProduct(p.id, { isActive: false });
      });

      expect(useProductStore.getState().getActiveProducts()).toEqual([]);
    });
  });
});
