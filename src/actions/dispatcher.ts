import { Alert } from "react-native";
import type { Action } from "../types/sdui";
import { useCartStore } from "../store/cartStore";

export function handleAction(action: Action): void {
  switch (action.type) {
    case "ADD_TO_CART":
      useCartStore.getState().addItem(action.payload);
      break;
    case "DEEP_LINK":
      Alert.alert("Deep link", `Navigating to: ${action.payload.url}`);
      break;
    case "OPEN_PRODUCT":
      Alert.alert("Open product", `Product #${action.payload.id}`);
      break;
    case "BOOK_EVENT":
      Alert.alert("Book event", `Booking: ${action.payload.title}`);
      break;
    case "APPLY_MYSTERY_GIFT_COUPON":
      Alert.alert(
        "🎁 Mystery Gift",
        `Coupon "${action.payload.code}" applied!`,
      );
      break;
    default:
      assertNever(action);
  }
}

function assertNever(action: never): never {
  console.warn("[dispatcher] Unhandled action:", action);
  return undefined as never;
}
