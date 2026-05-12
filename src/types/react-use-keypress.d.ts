declare module "react-use-keypress" {
  export default function useKeypress(
    key: string | string[],
    handler: (event: KeyboardEvent) => void,
    options?: { event?: "keydown" | "keyup" | "keypress"; target?: EventTarget | null },
  ): void;
}
