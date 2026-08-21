import type { Action } from "@/content/types";

type Props = {
  action: Action;
  variant?: "primary" | "secondary";
  className?: string;
};

/**
 * One primary action, one destination. `kind` is carried through to a data
 * attribute so the Probierz conversion journey can assert the approved target
 * without submitting anything.
 */
export default function PrimaryAction({ action, variant = "primary", className }: Props) {
  const classes = ["button", variant === "primary" ? "button--primary" : "button--secondary", className]
    .filter(Boolean)
    .join(" ");

  if (action.kind === "url") {
    const external = /^https?:/.test(action.target);
    return (
      <a
        className={classes}
        href={action.target}
        data-primary-action={variant === "primary" ? "true" : undefined}
        data-action-kind={action.kind}
        {...(external ? { rel: "noreferrer" } : {})}
      >
        {action.label}
      </a>
    );
  }

  return (
    <a
      className={classes}
      href={action.target}
      data-primary-action={variant === "primary" ? "true" : undefined}
      data-action-kind={action.kind}
    >
      {action.label}
    </a>
  );
}
